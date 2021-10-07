import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ProfileService } from 'src/app/profileService/profile.service';
import { BookingtestService } from 'src/app/bookingtest.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

export interface DialogData{
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-editowner',
  templateUrl: './editowner.component.html',
  styleUrls: ['./editowner.component.css']
})
export class EditownerComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);


  id_from_profile:any;
  User_details:any;
  selected_file!: File;
  first_name:string = "";
  last_name:string="";
  address:string="";
  mobile_no:string="";
  email_addr:string="";
  vehicleRows: any;
  existing_owner_img_name: any;
  new_owner_img_name:string="";

  constructor(public dialog: MatDialog,private _Activatedroute:ActivatedRoute, private _profileServiceVariable:ProfileService,private router: Router ) {}

  ngOnInit(): void {


    console.log(  this._Activatedroute.snapshot.paramMap.get("owner_id")  );
    this.id_from_profile=this._Activatedroute.snapshot.paramMap.get("owner_id");

    this._profileServiceVariable.getUserDetails(this.id_from_profile)
    .subscribe(
      data=> {this.User_details = data[0];
              this.first_name = this.User_details.first_name;
              this.last_name = this.User_details.last_name;
              this.address = this.User_details.address;
              this.email_addr = this.User_details.email;
              this.mobile_no = this.User_details.mobile;
              this.existing_owner_img_name = this.User_details.owner_img_name;
      
      },
      error=> console.log('get user details error!',error)  
    );

    this._profileServiceVariable.getVehicleDetails(this.id_from_profile)
    .subscribe(
      data=> {this.vehicleRows = data;

        console.log(data);
      },
      error=> console.log('get user details error!',error)
      
    );






  }

  openDialog() {
    this.dialog.open(Changepassowner, {
      data: {
        animal: 'panda'
      }
    });
  }
  openDialog2(){
    this.dialog.open(AddVehicleEditComponent, {
      data: {
        user_id: this.id_from_profile
      }
    });
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  confirm_edit(){

    let img_name;
    let  ext;
    

    ext =this.existing_owner_img_name.split('.').pop() ;

    if(this.new_owner_img_name!=""){
      ext =this.new_owner_img_name.split('.').pop() ;
    }
   ext = ext.toUpperCase();
    console.log(ext);

    img_name = String(this.id_from_profile) + "."+ ext;
    console.log(img_name);

    let arr = [this.first_name,       this.last_name,         this.mobile_no,   this.email_addr,       img_name,       this.address,      this.id_from_profile ];
    this._profileServiceVariable.Update_confirm_edit(arr)
    .subscribe(
      data=> { console.log("confirmed edit",data);     },
      error=> console.log('edit user details error!',error)

    );

    if(this.selected_file!=undefined){
      let fd = new FormData(); 
      fd.append("image",this.selected_file,img_name);
  
      this._profileServiceVariable.update_user_img(fd)
      .subscribe(
        data=> { console.log("confirmed edit",data);     },
        error=> console.log('edit user details error!',error)
        
      );
    }

    this.router.navigate(['/profile']);

  }

  back_button(){
    this.router.navigate(['/profile']);
  }

  chooseFile(event:any){
    
    if(event.target.value){
      this.selected_file=<File>event.target.files[0];
      console.log(this.selected_file.name,"yoyoyo"); 
      this.new_owner_img_name = this.selected_file.name;
      
    }
  }

  remove_Vehicle(vehicleRow:any){
    if(confirm("\n \nAre your sure you want to Remove this vehicle from your Autodoc account?\n\nRegistration number:  "+vehicleRow.vehicle_number+"\nMake:  "+vehicleRow.make+"\nModel:  "+vehicleRow.model)){
      
      this._profileServiceVariable.Remove_Vehicle(vehicleRow.vehicle_number)
      .subscribe(
        data=> { console.log("deleted vehcile from edit",data);
        window.location.reload()     },
        error=> console.log('delete vehicle error!',error)
  
      );

    }
  }


}



@Component({
  selector: 'changepassowner',
  templateUrl: 'changepassowner.html',
})
export class Changepassowner implements OnInit {

  oldPassword = new FormControl('', [Validators.required])
  newPassword = new FormControl('', [Validators.required])
  reNewPassword = new FormControl('', [Validators.required])

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  getErrorMessage() {
    if (this.newPassword.hasError('required')) {
      return 'You must enter a Password';
    }

    return this.newPassword.hasError('email') ? 'Not a valid Password' : '';
  }


  ngOnInit(): void {
  }

}



///////////////////////////////////////////////////
////////////////////////////////////////////////////


@Component({
  selector: 'addvehicleedit',
  templateUrl: 'addvehicleedit.html',
  styleUrls: ['../booking/addvehicle.css']
})
export class AddVehicleEditComponent {

  vehcicle_reg_number:string ="";
  brand:string ="";
  model:string = "";
  mileage!:any ;
  year_manf:any ;

  user_details: any="ddddd";
  selected_file!: File;
  vehicle_category:any;



  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _bookingserviceVariable: BookingtestService) {}

  ngOnInit() {
    console.log(this.data.user_id);
    console.log(this.vehcicle_reg_number);


    this._bookingserviceVariable.getOwnerdetails(this.data.user_id)
    .subscribe(
      data=> {this.user_details = data[0]; // owner's name and stuff
        console.log(data);        
      },
      error=>console.log('vehicle details error!!',error)
      
      );

  }

  addNewVehicle(){

    let fd = new FormData();                                              //extention(jpg wage)
  
    this.vehcicle_reg_number = this.vehcicle_reg_number.toUpperCase() ;
    this.brand = this.brand.toUpperCase() ;
    this.model = this.model.toUpperCase() ;

    let file_name= this.data.user_id+"-"+this.brand+"-"+this.model+"."+this.selected_file.name.split('.').pop();
    fd.append("image",this.selected_file,file_name);

    let arr = [this.vehcicle_reg_number , this.model, this.brand ,this.mileage, this.data.user_id,file_name,this.vehicle_category ,this.year_manf];
    this._bookingserviceVariable.postaddNewVehicle(arr)
    .subscribe(
      data=> { console.log('successfully confirmed vehcile adding!!!',data)
                                                      },
      error=>console.log('Error!!!',error)
      );

      this._bookingserviceVariable.postChooseFile(fd)
    .subscribe(
      data=> { console.log('successfully sent vehcile picture !!!',data)
                                                      },
      error=>console.log('Error!!!',error)
      );

  }
  
  reset(){
    console.log(this.vehicle_category,"xxx");

    console.log(this.brand);
    this.vehcicle_reg_number ="";
    this.brand ="";
    this.model = "";
    this.mileage =0;
    this.vehicle_category=undefined;
    this.year_manf = undefined;
    


    console.log(this.brand);
  }

  addbuttonLocked(){
    if(this.vehcicle_reg_number=="" || this.model==""||this.brand=="" ){
      return "addbuttonLocked";
    }
    return "addbutton";
  }

  chooseFile(event:any){
    let fd = new FormData();
    if(event.target.value){
      this.selected_file=<File>event.target.files[0];
      console.log(this.selected_file.name,"yoyoyo"); 
      fd.append("image",this.selected_file);
      console.log(fd.get("image"),"fdddd");
    }
  }


}