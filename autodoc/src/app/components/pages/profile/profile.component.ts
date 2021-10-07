import { Component, Inject, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { ProfileService } from 'src/app/profileService/profile.service';
import * as moment from 'moment';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { DateAppointmentClass, Ongoing_Appointment } from 'src/app/date-appointment-class.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { ChartType } from 'chart.js';
// import { MultiDataSet, Label } from 'ng2-charts';


//nimnakage


//nimnakage


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  //nimnakage methana idan
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 95.5123;
  diameter = 250;
  //nimnakage methanata yanakan

  UserIdfromSession:number=18000045;
  User_details :any;
  vehicleRows:any;
  AppointmentRows:any
  searchedKeyword!: string; 
  Ongoing_appointment_arr:any[]=[];

  called_count:number=0;

  // public doughnutChartLabels: Label[] = ['To be completed', 'Completion'];
  // public doughnutChartData: MultiDataSet = [
  //   [10,90]
  // ];
  // public doughnutChartType: ChartType = 'doughnut';



  constructor(private _profileServiceVariable:ProfileService, public dialog: MatDialog) { }

  ngOnInit(){

    this._profileServiceVariable.getUserDetails(this.UserIdfromSession)
    .subscribe(
      data=> {this.User_details = data[0];
              
        console.log(data,"dasdasdasdsd");
      },
      error=> console.log('get user details error!',error)
      
    );

    // console.log(this.User_details.last_name,"eliyen");

    this._profileServiceVariable.getVehicleDetails(this.UserIdfromSession)
    .subscribe(
      data=> {this.vehicleRows = data;

        console.log(data);
      },
      error=> console.log('get user details error!',error)
      
    );

    this.getAppointments();
    
 



  }

  getRange(time_hrs:string,time_mins:string , duration:number){

    // console.log(time_mins,time_hrs,duration);
     let mins_deci = (Number(time_mins)/60) ; //30 =0.5
     let hrs_mins_deci = Number(time_hrs) +mins_deci ; // 13:30 =   13+ 0.5 = 13.5 
     let end_time = hrs_mins_deci + duration; // 13.5 + 2.0 = 15.5
    //  console.log(end_time,"end");
     let end_time_min = String( (end_time % 1)*60  ); //30|| 0

     if(end_time_min=='0'){
      end_time_min = '00';
     }
    

     let end_time_hr =  String( Math.floor(end_time)  );
     if(end_time_hr.length==1){
       end_time_hr= "0"+ end_time_hr;
     }

    //  console.log(end_time_hr,"!!",end_time_min);

     let final_end_time_str =  end_time_hr + ":" +end_time_min; //15:30
     let strt_time = time_hrs+":"+time_mins;
     console.log(strt_time,"hehe",final_end_time_str);
     let range =   moment(strt_time,["HH.mm"]).format("hh:mm A")+ " - " + moment(final_end_time_str,["HH.mm"]).format("hh:mm A");
     return range;
  }


  getAppointments(){
    this._profileServiceVariable.getAppointments(this.UserIdfromSession)
    .subscribe(
      data=> {this.AppointmentRows = data;

        console.log(data,"appoint");

        console.log(this.AppointmentRows[0].time,"tt");
        console.log(this.AppointmentRows[0].date,"dd");
        console.log( moment(this.AppointmentRows[0].date ).format("YYYY/MM/DD") ,"mmnt dte");

        for(var i in this.AppointmentRows){
          this.AppointmentRows[i].date =   moment(this.AppointmentRows[i].date ).format("DD/MM/YYYY");
           let range = this.getRange(moment(this.AppointmentRows[i].time).format("HH "),moment(this.AppointmentRows[i].time).format("mm ") , this.AppointmentRows[i].duration_hrs );
           this.AppointmentRows[i].time =   range;
        }

      },
      error=> console.log('get user appointments error!',error)
      
    );
  }

  Is_within_Range(range:string){
    var LHS_RHS = range.split(" - "); //09:00 AM - 01:00 PM
    // console.log(LHS_RHS[0]);// 09:00 AM
    // console.log(LHS_RHS[1]);// 01:00 PM

     let LHS_hrs = moment(LHS_RHS[0],["hh.mm A"]).format("HH:mm"); // 9:00
     let RHS_hrs =  moment(LHS_RHS[1],["hh.mm A"]).format("HH:mm"); // 13:00
    //  console.log(LHS_hrs,"jj",RHS_hrs);

     let LHS_hr_min = LHS_hrs.split(":"); 
     let LHS_hr_number = LHS_hr_min[0]; //9
     let LHS_min_number = LHS_hr_min[1]; //0, 30

     let final_LHS = Number(LHS_hr_number) + Number(LHS_min_number)/60  ;  // 9.0 || 9.5 wage

     let RHS_hr_min = RHS_hrs.split(":");
     let RHS_hr_number = RHS_hr_min[0]; //13
     let RHS_min_number = RHS_hr_min[1]; //0,30

     let final_RHS = Number(RHS_hr_number) + Number(RHS_min_number)/60 ; // 13.0||13.5

     let now  = moment(new Date() ).format("HH:mm") ;
     let now_hr_min = now.split(":");
     let now_hr_number = now_hr_min[0]; //13
     let now_min_number = now_hr_min[1]; //0,42,53,37
     let final_now = Number(now_hr_number)+ Number(now_min_number)/60;

    //  console.log(final_LHS,final_now,"k",final_RHS);
     if( final_now <=final_RHS && final_now>= final_LHS) {
       return "within range"; // dan welawa range eka athulenam tiyenne
     }
     else if(final_now<final_LHS){
      return "before start";
     } 
     else {
       return "after completed";
     }

  }


  checkCompletion(appointmentRow:any){

    // console.log( moment(new Date).format('YYYY/MM/DD'), "---",    moment(appointmentRow.date, 'DD.MM.YYYY').format('YYYY/MM/DD')  );

    let appointment_date = moment(appointmentRow.date, 'DD.MM.YYYY').format('YYYY-MM-DD') ;
    let today = moment(new Date()).format('YYYY-MM-DD');

    // console.log(appointment_date,today)

    let now_time = moment(new Date()).format("HH:mm A")


    if( moment(appointment_date).isBefore(today)  ){
      return "completed";
    }
    else if(   moment(appointment_date).isSame(today)   )
    {
      if(  this.Is_within_Range(appointmentRow.time)=="within range" ) {

        var index_of_appointmentDate=  this.Ongoing_appointment_arr.map(function(x) {return x.appointment_id; }).indexOf(appointmentRow.appointment_id) ;
       if(  index_of_appointmentDate == -1  ){

          let index_of_vehicle = this.vehicleRows.map(function(x: { vehicle_number: any; }) {return x.vehicle_number; }).indexOf(appointmentRow.vehicle_number) ;
          let make =  this.vehicleRows[index_of_vehicle].make;
          let model = this.vehicleRows[index_of_vehicle].model;

          this.Ongoing_appointment_arr.push(  new Ongoing_Appointment(appointmentRow.appointment_id , appointmentRow.time, make  ,model , appointmentRow.vehicle_number)   );
       } 
       else{
           this.Ongoing_appointment_arr[index_of_appointmentDate].value =  this.Change_perecentage_ongoing(appointmentRow.time);
       }    
          
        return "on-going";
      }
      else if(  this.Is_within_Range(appointmentRow.time)=="before start"  ){
        return "yet to start";
      }
      else{
        return "completed";
      }
        
    }
    else{
      return "yet to start";
    }

  }

  Change_perecentage_ongoing(range:string){
    console.log(range,"range")
       this.called_count++;
      // console.log("menna call una ",this.called_count);

      var LHS_RHS = range.split(" - "); //09:00 AM - 01:00 PM

       let LHS_hrs = moment(LHS_RHS[0],["hh.mm A"]).format("HH:mm"); // 9:00
       let RHS_hrs =  moment(LHS_RHS[1],["hh.mm A"]).format("HH:mm"); // 13:00
      //  console.log(RHS_hrs,"rhs 24hrs");
  
       let LHS_hr_min = LHS_hrs.split(":"); 
       let LHS_hr_number = LHS_hr_min[0]; //9
       let LHS_min_number = LHS_hr_min[1]; //0, 30
      //  console.log(LHS_hr_number,">>",LHS_min_number);
  
       let final_LHS = Number(LHS_hr_number) + Number(LHS_min_number)/60  ;  // 9.0 || 9.5 wage
  
       let RHS_hr_min = RHS_hrs.split(":");
       let RHS_hr_number = RHS_hr_min[0]; //13
       let RHS_min_number = RHS_hr_min[1]; //0,30
  
       let final_RHS = Number(RHS_hr_number) + Number(RHS_min_number)/60 ; // 13.0||13.5
  
       let now  = moment(new Date() ).format("HH:mm") ;
       let now_hr_min = now.split(":");
       let now_hr_number = now_hr_min[0]; //13
       let now_min_number = now_hr_min[1]; //0,42,53,37
       let final_now = Number(now_hr_number)+ Number(now_min_number)/60;
       

       let percentage = ( (final_now - final_LHS)  / (final_RHS-final_LHS)  )* 100;
       percentage = Number (  percentage.toFixed(2) );
  
        console.log(final_LHS,"k",final_now,"k",final_RHS);

        return percentage;

  }

  Get_Mat_icon(completion:string){
      if(completion=="completed"){
        return "done";
      }
      else if (completion == "on-going"){
        return "sync_alt";
      }
      else return "schedule";
  }

  OpenPDF_Invoice(appointment_id:number){
    let url = "assets/invoice/"+appointment_id+".pdf";
    window.open(url);
  }

  openDialog(appointmentRow:any) {
    const dialogRef = this.dialog.open(Ratingpopup , {
      data: {appointmentRow: appointmentRow}
    });

  }

  disabled_rating(appointmentRow:any){
    if( this.checkCompletion(appointmentRow) !="completed"  ){
      return "disable";
    }
    else{
      if(appointmentRow.rated == 1){
        return "disable";
      }
      else{
        let today = moment(new Date() ).format("DD/MM/YYYY") ;
        if(  appointmentRow.date == today){
          return "enable";
        }
        return "disable";
      }
    }

  }

  delete_appointment(appointmentRow:any){
    
    if(confirm("\n \nAre your sure you want to Remove this appointment from ?\n\nAppointment Date:  "+appointmentRow.date+"\nTime:  "+appointmentRow.time+"\nService Station:  "+appointmentRow.st_name+"\n\nYou will only be able to delete a set appointment if today is two days before the set date of the appointment.")){
      
      this._profileServiceVariable.Remove_Appointment(appointmentRow.appointment_id)
      .subscribe(
        data=> { console.log("deleted appointment from database",data);
        this.ngOnInit();   },
        error=> console.log('delete appointment error!',error)
  
      );

    }

  }

  check_delete_disable(appointmentRow:any){
    let today = moment(new Date()).format('DD/MM/YYYY');

    let today_val = moment( [ moment(today,['DD/MM/YYYY']).format("YYYY"),    moment(today,['DD/MM/YYYY']).format("M")   ,   moment(today,['DD/MM/YYYY']).format("D")  ]  );
    let appoint_date_val =  moment( [ moment(appointmentRow.date,['DD/MM/YYYY']).format("YYYY") ,     moment(appointmentRow.date,['DD/MM/YYYY']).format("M")   ,    moment(appointmentRow.date,['DD/MM/YYYY']).format("D")  ]  );

    let diff_days =   appoint_date_val.diff(today_val, 'days')   ;
    // console.log(diff_days,appointmentRow.date)

    if(diff_days >=2){
      return "enable";
    }
    else return "disable";
   
  }


}

/////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////   RATING //////////////////////////
//////////////////////////////////////////////

@Component({
  selector: 'ratingpopup',
  templateUrl: 'ratingpopup.html',
  styleUrls: ['ratingpopup.css']
})
export class Ratingpopup {

  rating_details_of_station:any;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any , private _profileServiceVariable:ProfileService) {}

  ngOnInit() { 

    console.log(this.data.appointmentRow.st_id);
    this._profileServiceVariable.getRating(this.data.appointmentRow.st_id)
    .subscribe(
      data=> {this.rating_details_of_station = data[0];
              
        console.log(data,"---rating_details_of_station");
      },
      error=> console.log('get user details error!',error)
      
    );



   }

  rate_station(rating:number){

    let current_rate = this.rating_details_of_station.current_rate;
    let rate_count = this.rating_details_of_station.rate_count;

    let final_rating;

    final_rating =  ((current_rate * rate_count) + rating )/ (rate_count+1);

    
    final_rating =   Number(  final_rating.toFixed(2)  );
    console.log(final_rating);

    let final_rating_row=[this.data.appointmentRow.st_id, rate_count+1 , final_rating];

    this._profileServiceVariable.post_rating(final_rating_row)
    .subscribe(
      data=> {console.log('successfully rated service station!!!',data); 
         this.set_appointment_rated();      
      },
      error=>console.log('rating error error!!',error)
      
      );

      window.location.reload();

  }

  set_appointment_rated(){

    let appointment_id_IN_arr = [    this.data.appointmentRow.appointment_id    ];
    console.log(appointment_id_IN_arr);

    this._profileServiceVariable.post_appointment_rated( appointment_id_IN_arr   )
    .subscribe(
      data=> {console.log('successfully set appoinment rated station!!!',data); 
      },
      error=>console.log('setting as rated error!!',error)
      
      );
  }




}
