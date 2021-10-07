import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AdminService } from 'src/app/adminService/admin.service';

// export interface DialogData {
//   animal: 'panda' | 'unicorn' | 'lion';
// }

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css']
})
export class AdminpanelComponent implements OnInit {

  AdminIDfromSession!: number;

  searchedKeyword_1!: string;
  searchedKeyword_2!: string;
  searchedKeyword_3!: string;

  Requested_ServiceStations:any;
  AllServiceStationsRows: any;
  AllVehicleOwners: any;



  constructor(public dialog: MatDialog, private _adminServiceVariable: AdminService) {}

  ngOnInit(): void {

    this._adminServiceVariable.getRequestedServiceStations()
    .subscribe(
      data=> {this.Requested_ServiceStations = data;
        console.log(data);        
      },
      error=>console.log('requested serviceStation details error!!',error)
      
      );

    this._adminServiceVariable.getAllServiceStations()
    .subscribe(
      data=> {this.AllServiceStationsRows = data;
        console.log(data);        
      },
      error=>console.log('requested serviceStation eke details error!!',error)
      
      );
    
    this._adminServiceVariable.getAllVehicleOwners()
    .subscribe(
      data=> {this.AllVehicleOwners = data;
        console.log(data);        
      },
      error=>console.log('requested serviceStation eke details error!!',error)
      
      );

        



  }

  view_regPDF(reg_doc_name:string){
    let url = "assets/registration document/"+reg_doc_name+".pdf";
    window.open(url);
  }

  view_regPDF_of_ValidStations(st_id:string){
    let url = "assets/registration document/REG-"+st_id+".pdf";
    window.open(url);
  }

  openDialog(Requested_ServiceStation:any) {
    const dialogRef = this.dialog.open(Servicerequestview , {
      data: {Requested_ServiceStation: Requested_ServiceStation}
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
  



}

//////////////////////////
///////////////////////////

@Component({
  selector: 'servicerequestview',
  templateUrl: 'servicerequestview.html',
  styleUrls: ['servicerequestview.css']
})
export class Servicerequestview {
  
  Requested_ServiceStation_details:any // services gana details

  constructor( @Inject(MAT_DIALOG_DATA) public data: any , private _adminServiceVariable:AdminService) {}

  ngOnInit() {
    this._adminServiceVariable.get_details_of_req_station(this.data.Requested_ServiceStation.reg_number)
    .subscribe(
      data=> {this.Requested_ServiceStation_details = data;
        console.log(this.Requested_ServiceStation_details);        
      },
      error=>console.log('requested serviceStation eke details error!!',error)
      
      );

      console.log(this.data.Requested_ServiceStation);


  }

  add_ServiceStation(Requested_ServiceStation_object: any){

    var trimmed_ST_ID = Requested_ServiceStation_object.reg_number.split("-"); // REG , 501
    let st_id = trimmed_ST_ID[1];
    console.log(st_id); // 501
    st_id = Number(st_id);

    let service_station_arr = [st_id, Requested_ServiceStation_object.firstName,
                               Requested_ServiceStation_object.lastName , Requested_ServiceStation_object.st_name, 
                               Requested_ServiceStation_object.address , Requested_ServiceStation_object.town , 
                               Requested_ServiceStation_object.email , Requested_ServiceStation_object.mobile ]  ;
                          
    let service_station_services_arr:any[]= [] ;

    for(let i=0;i<this.Requested_ServiceStation_details.length;i++){
      service_station_services_arr[i] =[];
    }


    console.log(this.Requested_ServiceStation_details.length,"length",this.Requested_ServiceStation_details[0].amount);
    for(let i=0;i<this.Requested_ServiceStation_details.length;i++){
        service_station_services_arr[i][0] = this.Requested_ServiceStation_details[i].service_id;
        service_station_services_arr[i][1] = st_id;
        service_station_services_arr[i][2] = this.Requested_ServiceStation_details[i].amount;
        service_station_services_arr[i][3] = this.Requested_ServiceStation_details[i].duration;
    }
    console.log(service_station_services_arr,"arrr");
    console.log(Requested_ServiceStation_object);


    this._adminServiceVariable.post_ServiceStation(service_station_arr)
    .subscribe(
      data=> {  console.log('successfully added req Station to station table!!!',data); 

              this._adminServiceVariable.post_serviceStation_services(service_station_services_arr)
              .subscribe(
                data=> {console.log('successfully added req Station eke services to station_services table!!!',data);  
                 this.remove_requested_station(Requested_ServiceStation_object,0); // remove from request table after adding.
                this.add_to_bays(Requested_ServiceStation_object,st_id); //add bays to bay table
                 this.insert_station_to_ratings_table(st_id); // create station in rating table

                },
                error=>console.log('requested serviceStation_services eke error!!',error)
                
                );
                 
    },
      error=>console.log('requested serviceStation adding error!!',error)
      
    );

  }

  remove_requested_station(Requested_ServiceStation_object:any,isDeclined:any){ //is declined 0 nam accept karala. 1 nam decline karala

    this._adminServiceVariable.remove_requested_station(Requested_ServiceStation_object.reg_number)
    .subscribe(
      data=> {console.log('successfully removed req station!!!',data);      
      
      if(isDeclined==1){
          this.change_account_table(Requested_ServiceStation_object.email, 'declined');
      }
      else {
          this.change_account_table(Requested_ServiceStation_object.email, 'accepted');
      }

      },
      error=>console.log('requested station delete error!!',error)
      
      );

     
  }

  change_account_table(email:string, isDecline:string){ //accepted, declined

    console.log("change krnna called",isDecline);

    let account_email_accpt_arr =[email,isDecline];
    this._adminServiceVariable.update_account_table(account_email_accpt_arr)
    .subscribe(
      data=> {console.log('successfully accepted or declined account!!!',data);  
          if(isDecline=='declined'){
            window.location.reload();
          }
      },
      error=>console.log('account accept/decline error!!',error)
      
      );
  }

  insert_station_to_ratings_table(st_id:any){
    let pass_arr = [st_id];
    this._adminServiceVariable.insert_station_to_ratings(pass_arr)
    .subscribe(
      data=> {console.log('successfully inserted req station to rating!!!',data);  
                 window.location.reload();     
      },
      error=>console.log('insert new station to rating error!!',error)
      
      );
  }

  add_to_bays(Requested_ServiceStation_object:any,st_id:number){

    let arr_bays = [];

    for(let i=0;i<Requested_ServiceStation_object.bay_amount;i++){
      arr_bays[i] =[i+1,st_id];
    }

    this._adminServiceVariable.insert_to_bays(arr_bays)
    .subscribe(
      data=> {console.log('successfully added bays!!!',data);       
      },
      error=>console.log('insert bays error!!',error)
      
      );
  }


}
