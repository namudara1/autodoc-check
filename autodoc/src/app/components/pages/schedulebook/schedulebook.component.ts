import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment';
import { BayNslotsClass } from 'src/app/bay-nslots-class.model';
import { DateAppointmentClass, freeSlots } from 'src/app/date-appointment-class.model';
import { StationService } from 'src/app/stationService/station.service';
import { BookingtestService } from 'src/app/bookingtest.service';
import { ProfileService } from 'src/app/profileService/profile.service';




// export interface DialogData{
//   animal: 'panda' | 'unicorn' | 'lion';
// }

@Component({
  selector: 'app-schedulebook',
  templateUrl: './schedulebook.component.html',
  styleUrls: ['./schedulebook.component.css']
})
export class SchedulebookComponent {

  ServiceStationIDfromSession:any = 1;
  Allappointments:any;
  Allappointments_unfixed:any; // date n time moment nemei original
  dateAppointment_array: DateAppointmentClass[]=[];
  selectedDateObject_from_dateAppointment_array:any;
  bayRows: any;
  selected_date:any=new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() ); // Thu Sep 30 2021 00:00:00 GMT+0530 (India Standard Time)    Mehema print wenne me value eka . Date type ekama thamai.
  selected_bay_appointment_final_arr:any;


  constructor(public dialog: MatDialog , private _stationServiceVariable:StationService ,private _bookingserviceVariable:BookingtestService) {}

  ngOnInit(): void {

    this.getBaysDetails();
    this.getAllBookings();
    // this.get_selected_date_appointments(); // meka methanin ain kala uda functions call wela iwra nathi nisa.
    

  }

  getBaysDetails(){
    this._bookingserviceVariable.getBaysDetails(this.ServiceStationIDfromSession)
    .subscribe(
      data=> {console.log('bay details',data);
               this.bayRows = data; 
              console.log(this.bayRows,"bayrows");
              },
      error=>console.log('Error in bayDetails',error)
    );

  }

  getAllBookings(){
    this._stationServiceVariable.getTodayBookings(this.ServiceStationIDfromSession)
    .subscribe(
      data=> {this.Allappointments = data;
        this.Allappointments_unfixed = JSON.parse(JSON.stringify(  data  )  );
        console.log(this.Allappointments);  
        console.log(this.Allappointments_unfixed,"unfixed");    
        
        this.makeDateTime();
        this.get_selected_date_appointments();
        
      },
      error=>console.log('today appointment details error!!',error)
      );
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
    //  console.log(strt_time,"hehe",final_end_time_str);
     let range =   moment(strt_time,["HH.mm"]).format("hh:mm A")+ " - " + moment(final_end_time_str,["HH.mm"]).format("hh:mm A");
     return range;
  }

  makeDateTime(){

    for(let i =0;i<this.Allappointments.length;i++){

      let range = this.getRange(moment(this.Allappointments[i].time).format("HH "),moment(this.Allappointments[i].time).format("mm ") , this.Allappointments[i].duration_hrs );
      this.Allappointments[i].time =   range;
      this.Allappointments[i].date =  moment(this.Allappointments[i].date ).format("DD/MM/YYYY");
    }

    console.log(this.Allappointments,"fixed appointments");
  }

  get_selected_date_appointments(){
    let selected_date_moment =moment(this.selected_date).format("DD/MM/YYYY");
    let selected_date_appointments_bays:any=[];

    for(let i=0;i<this.bayRows.length;i++){
      selected_date_appointments_bays[i] = []; // 0th element kiyanne 1st bay , 1st element kiyanne 2nd bay.....
    }

    for(let i=0;i<this.Allappointments.length;i++){
      if(this.Allappointments[i].date == selected_date_moment){
        selected_date_appointments_bays[  this.Allappointments[i].bay_id-1  ].push(this.Allappointments[i]);
      }
    }
    let selected_date_appointments_bays_copy = JSON.parse(JSON.stringify(  selected_date_appointments_bays  )  );
    console.log(selected_date_appointments_bays);

    selected_date_appointments_bays_copy = this.get_decimal_time_with_sorted(selected_date_appointments_bays_copy);
    console.log(selected_date_appointments_bays_copy,"decimal wela sort wela awada?");

    selected_date_appointments_bays_copy=  this.fill_bays_time_slots(selected_date_appointments_bays_copy); // free, online , manual ewa map karanawa hama bay ekema
    selected_date_appointments_bays_copy = this.sort_by_time(selected_date_appointments_bays_copy);
    console.log(selected_date_appointments_bays_copy,"free dala sort una final array");
    this.selected_bay_appointment_final_arr = selected_date_appointments_bays_copy;
  }

  fill_bays_time_slots(selected_date_appointments_bays_copy:any){

    let selected_date_appointments_bays_copy_with_freeSlots = JSON.parse(JSON.stringify(  selected_date_appointments_bays_copy  )  );


    for(let i=0;i<selected_date_appointments_bays_copy.length;i++){

      let nextTime = 9.0;
      let endTime = 18.0;

      for(let j=0;j<selected_date_appointments_bays_copy[i].length;j++){

        if(   selected_date_appointments_bays_copy[i][j].time==nextTime    ){
          
          nextTime = selected_date_appointments_bays_copy[i][j].time + selected_date_appointments_bays_copy[i][j].duration_hrs;

        }
        else{
          selected_date_appointments_bays_copy_with_freeSlots[i].push( new freeSlots(nextTime,  selected_date_appointments_bays_copy[i][j].time - nextTime ,i+1    )   );
          nextTime = selected_date_appointments_bays_copy[i][j].time + selected_date_appointments_bays_copy[i][j].duration_hrs ;
        }

        if(j==selected_date_appointments_bays_copy[i].length-1 ){ // last appointment of that bay nam...
          if(nextTime!=endTime){
            selected_date_appointments_bays_copy_with_freeSlots[i].push( new freeSlots(nextTime,  endTime-nextTime ,i+1  )   );
            nextTime = endTime;
          }
        }

      }

      if(selected_date_appointments_bays_copy[i].length==0){
        selected_date_appointments_bays_copy_with_freeSlots[i].push( new freeSlots(nextTime,  endTime-nextTime ,i+1    )   );
      }
      
    }

    console.log(selected_date_appointments_bays_copy_with_freeSlots,"with free slots");
    return selected_date_appointments_bays_copy_with_freeSlots;

  }

  get_decimal_time_with_sorted(selected_date_appointments_bays_copy:any){
    for(let i =0;i<selected_date_appointments_bays_copy.length;i++){
      for(let j=0;j<selected_date_appointments_bays_copy[i].length;j++){
        selected_date_appointments_bays_copy[i][j].time = this.getTimeAsNumber(selected_date_appointments_bays_copy[i][j].time);
      }
    }

  console.log(selected_date_appointments_bays_copy,"after making time decimal");
  return    this.sort_by_time(selected_date_appointments_bays_copy) ;

  }

  sort_by_time(selected_date_appointments_bays_copy:any){

    for(let i=0;i<selected_date_appointments_bays_copy.length;i++){
      selected_date_appointments_bays_copy[i].sort(function(a: { time: any; }, b: { time: any; }) {
        return parseFloat(a.time) - parseFloat(b.time);
     });

    }

  console.log(selected_date_appointments_bays_copy,"after sorted");
  return selected_date_appointments_bays_copy;
  }

  getTimeAsNumber(time_range:string){
    var LHS_RHS = time_range.split(" - "); 
    let LHS_time_AM = LHS_RHS[0]; // 02:00 PM ,09:00 AM, 01:30 PM
    let LHS_time_24h =  moment(LHS_time_AM,["hh:mm A"]).format("HH:mm");
    console.log(LHS_time_24h);
    let hrs_mins  = LHS_time_24h.split(":");
    let hrs = Number(hrs_mins[0]);
    let mins_deci = Number( hrs_mins[1]  )/60;  //0.5 or 0
    let LHS_final = hrs+mins_deci;
    console.log(LHS_final);
    return LHS_final;

  }

  getColspan(duration_hrs:number){
    // console.log("called")
    return duration_hrs*2;
  }
  
  renderClass(isonline:any){
    if(isonline==1){
      return "onlineAppointment";
    }
    else if (isonline==0){
      return "manualAppointment";
    }
    else{
      return "freeSlot";
    }
  }

  get_time_start_AM(start_time:any){
    let LHS_deci = start_time;
    let LHS_hrs_str = String(Math.floor(LHS_deci)); // 14,9
    let LHS_mins_str = String( (LHS_deci % 1)*60 ); // "30 || 0"

    if(LHS_hrs_str.length==1 ){
      LHS_hrs_str = "0"+LHS_hrs_str;
    }
    if(LHS_mins_str.length==1 ){
      LHS_mins_str = "0"+ LHS_mins_str;
    }
    let LHS = LHS_hrs_str+":"+LHS_mins_str;
    let LHS_AM = moment(LHS,["HH:mm"]).format("hh:mm A");
    return LHS_AM ;
  }

  get_time_range(time:any,duration_hrs:number){
    let LHS_deci = time;
    let RHS_deci = time+duration_hrs;

    let LHS_hrs_str = String(Math.floor(LHS_deci)); // 14,9
    let LHS_mins_str = String( (LHS_deci % 1)*60 ); // "30 || 0"

    let RHS_hour_str = String( Math.floor(RHS_deci)  ); // "15"
    let RHS_mins_str = String( (RHS_deci % 1)*60   ); // "30||0"

    if(LHS_hrs_str.length==1 ){
      LHS_hrs_str = "0"+LHS_hrs_str;
    }
    if(LHS_mins_str.length==1 ){
      LHS_mins_str = "0"+ LHS_mins_str;
    }
    if(RHS_hour_str.length==1){
      RHS_hour_str= "0"+ RHS_hour_str;
    }
    if(RHS_mins_str.length==1){
      RHS_mins_str = "0"+ RHS_mins_str;
    }

    let LHS = LHS_hrs_str+":"+LHS_mins_str;
    let RHS = RHS_hour_str+":"+RHS_mins_str;

    let LHS_AM = moment(LHS,["HH:mm"]).format("hh:mm A");
    let RHS_AM = moment(RHS,["HH:mm"]).format("hh:mm A")
    // console.log(LHS_AM,"-",RHS_AM);
    return LHS_AM+" - "+RHS_AM;
  }

  openDialog(appointment:any) {
    console.log(appointment,"mnwd tiyenne");
    let momentDate = moment(this.selected_date).format("YYYY-MM-DD"); 

    const dialogRef= this.dialog.open(TimeslotComponent, {
      data: {
        appointment: appointment,
        st_id:this.ServiceStationIDfromSession,
        momentDate: momentDate

      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result,"printed in parent")

      this.ngOnInit();
    });

  }


}

////////////////////////
///////////////////////



@Component({
  selector: 'timeslot',
  templateUrl: 'timeslot.html',
  styleUrls: ['timeslot.css']
})
export class TimeslotComponent {

  availableServices:any;
  Selected_services:any[] = [];
  selected_service_duration:number=0;
  timeSlot_button_arr:any[]=[];
  service_vehicle_number:string=""; //manual
  service_owner_name:string=""; //manual
  service_owner_mobile:string="";//manual
  selected_timeSlot:any;
  selected_start_time24h:any;
  owner_vehicle_online:any;
  services_of_selected_appointment:any;
  // checkVar:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _stationServiceVariable:StationService , private _bookingServiceVariable:BookingtestService,private _profileServiceVariable:ProfileService  , public dialogRef: MatDialogRef<TimeslotComponent>) {}

  ngOnInit(): void {
    this._bookingServiceVariable.getAvailableServices(this.data.st_id)
    .subscribe(
      data=> { this.availableServices = data; 
              console.log(this.availableServices,"available services");

              },
      error=>console.log('Error in available services...!!',error)
    );

    let strt_time= this.data.appointment.time;
    while(this.timeSlot_button_arr.length!= this.data.appointment.duration_hrs*2){
      this.timeSlot_button_arr.push(strt_time );
      strt_time= strt_time+0.5;
    }
    console.log(this.timeSlot_button_arr,"timeSlot_button_arr");

    if( this.data.appointment.isonline== 1){
      this.get_owner_vehicle_details();
    }

    this.get_appointment_services();

  }

  get_appointment_services(){
    this._stationServiceVariable.get_appointment_services(this.data.appointment.appointment_id)
    .subscribe(
      data=> { this.services_of_selected_appointment = data; 
              console.log(this.services_of_selected_appointment,"services_of_selected_appointment awaa");

              },
      error=>console.log('Error in services_of_selected_appointment...!!',error)
    );
  }  

  get_owner_vehicle_details(){
    this._stationServiceVariable.get_owner_vehicle_details(this.data.appointment.vehicle_number)
    .subscribe(
      data=> { this.owner_vehicle_online = data[0]; 
              console.log(this.owner_vehicle_online,"owner vehicle online awa");

              },
      error=>console.log('Error in owner vehicle...!!',error)
    );
  }


  getBookingType(){
    if(this.data.appointment.isonline==1){
      return "Online";
    }
    else if(this.data.appointment.isonline==0){
      return "Manual";
    }
    else{
      return "FreeSlot";
    }
  }

  
  get_time_range(time:any,duration_hrs:number){
    let LHS_deci = time;
    let RHS_deci = time+duration_hrs;

    let LHS_hrs_str = String(Math.floor(LHS_deci)); // 14,9
    let LHS_mins_str = String( (LHS_deci % 1)*60 ); // "30 || 0"

    let RHS_hour_str = String( Math.floor(RHS_deci)  ); // "15"
    let RHS_mins_str = String( (RHS_deci % 1)*60   ); // "30||0"

    if(LHS_hrs_str.length==1 ){
      LHS_hrs_str = "0"+LHS_hrs_str;
    }
    if(LHS_mins_str.length==1 ){
      LHS_mins_str = "0"+ LHS_mins_str;
    }
    if(RHS_hour_str.length==1){
      RHS_hour_str= "0"+ RHS_hour_str;
    }
    if(RHS_mins_str.length==1){
      RHS_mins_str = "0"+ RHS_mins_str;
    }

    let LHS = LHS_hrs_str+":"+LHS_mins_str;
    let RHS = RHS_hour_str+":"+RHS_mins_str;

    let LHS_AM = moment(LHS,["HH:mm"]).format("hh:mm A");
    let RHS_AM = moment(RHS,["HH:mm"]).format("hh:mm A");
    // console.log(LHS_AM,"-",RHS_AM);
    return LHS_AM+" - "+RHS_AM;
  }

  add_remove_selected(service:any){

    this.selected_timeSlot =null;

   let has_index = this.Selected_services.map(function(x) {return x.service_id; }).indexOf(service.service_id);
   
   if(has_index==-1){
      this.Selected_services.push(service); 
      this.selected_service_duration =this.selected_service_duration + service.duration_hrs;
   }
   console.log(has_index);
   if (has_index > -1) {
    this.Selected_services.splice(has_index, 1);
    this.selected_service_duration = this.selected_service_duration - service.duration_hrs;
  }
  console.log(this.Selected_services,"selected services");
  console.log(this.selected_service_duration,"selected total duration");
    
  }

  check_disable_service(service:any){
    
    if(service.duration_hrs >  (this.data.appointment.duration_hrs -this.selected_service_duration)  ){
      if( this.Selected_services.map(function(x) {return x.service_id; }).indexOf(service.service_id) != -1   ){
            return "enable";
          }
      else return "disable";
    }
    else return "enable";

  }

  get_time_AM(timeslot:number){
    let hrs = String(Math.floor(timeslot)); // 14,9
    let mins = String( (timeslot % 1)*60 ); // "30 || 0"

    if(hrs.length==1){
      hrs = "0"+hrs;
    }
    if(mins.length==1){
      mins="0"+mins;
    }
    let final_24h = hrs+":"+mins;
    // console.log(final_24h);
   let final_time=  moment(final_24h,["HH:mm"]).format("hh:mm A");
  //  console.log(final_time);
    return final_time;
  }

  nowTimeDecimal(){
    let now_hr_min = moment(new Date() ).format("HH:mm") ;
    let hr_min = now_hr_min.split(":");
    let hr_deci = Number( hr_min[0] );
    let min_deci= Number(  hr_min[1] );
    // console.log(hr_deci,min_deci)
    
    let final_now = hr_deci +  (min_deci/60);
    // console.log(final_now,"final now");
    return final_now;

  }

  timeSlot_disable(timeslot:number){

    let today = moment(new Date()).format('YYYY-MM-DD');

    console.log(this.data.momentDate,today)

    if(  moment(this.data.momentDate).isBefore(today)   ){
      return "disable";
    }
    
    if(   moment(this.data.momentDate).isSame(today)   ){     
      if( this.nowTimeDecimal()>= timeslot    ){
        return "disable";
      }
    }

    if(this.selected_service_duration==0){
      return "disable";
    }
    else{
      if(  (this.data.appointment.time + this.data.appointment.duration_hrs)  < (timeslot +this.selected_service_duration)    ){
        return "disable";
      }
      else return "enable";
    }
    
  }

  appointment_delete_disable(start_time:number){
    // console.log(start_time,"dlt srt time  ")
    let today = moment(new Date()).format('YYYY-MM-DD');

    if(  moment(this.data.momentDate).isBefore(today)   ){
      return "disable";
    }
    
    else if(   moment(this.data.momentDate).isSame(today)   ){  
      // console.log ( this.nowTimeDecimal,"nw timedeci",start_time);   
      if( this.nowTimeDecimal() > start_time    ){
        return "disable";
      }
      else return "enable";
    }
    else return "enable";
    
  }

  
  delete_appointment(appointmentRow:any){
    
    if(confirm("\n \nAre your sure you want to Remove this appointment from ?\n\nAppointment Date:  "+appointmentRow.date+"\nDuration:  "+appointmentRow.time+" hours\nAppointment ID:  "+appointmentRow.appointment_id+"\nVehicle Reg.No:  "+appointmentRow.vehicle_number)){
      
      this._profileServiceVariable.Remove_Appointment(appointmentRow.appointment_id)
      .subscribe(
        data=> { console.log("deleted appointment from database",data);
        this.dialogRef.close("badu awathe deleted?");      },
        error=> console.log('delete appointment error!',error)
  
      );

    }

  }

  disable_set_appointment(){
    if( this.service_vehicle_number== "" || this.selected_timeSlot ==undefined ||this.service_owner_name=="" || this.service_owner_mobile=="" ){
      return "disable";
    }
    else return "enable";
  }

  select_timeSlot(timeslot:number){
    this.selected_timeSlot = timeslot;
    this.selected_start_time24h    =     this.make_start_time24h(    this.get_time_AM(timeslot)    );
  }

  selected_timeSlot_css(timeslot:number){
    if(timeslot == this.selected_timeSlot){
      return "selected_timeSlot_css";
    }
    else  return "";
  }

  make_start_time24h(time_AM:any){
    return moment(time_AM,["hh:mm A"]).format("HH:mm");
  }

  confirm_appointment(){
    console.log("clicked");
    console.log(this.selected_timeSlot,this.service_vehicle_number);

    let selected_services_id:any =[];

    for(var i in this.Selected_services){
      selected_services_id.push(  this.Selected_services[i].service_id  );
    }

    let appointment_timeStamp =  this.data.momentDate+" "+this.selected_start_time24h+":00";
    console.log(appointment_timeStamp,"time stmp");
    let isonline=0;

    this.service_owner_name= this.service_owner_name.toUpperCase();
    this.service_vehicle_number = this.service_vehicle_number.toUpperCase();

    var final_arr = [ this.data.st_id   ,this.data.appointment.bay_id  ,this.selected_service_duration  ,appointment_timeStamp,    this.service_vehicle_number    , this.data.momentDate,  selected_services_id , isonline,  this.service_owner_name,   this.service_owner_mobile   ];
    console.log(final_arr);

    this._bookingServiceVariable.set_confirm_appointment_manual(final_arr)
    .subscribe(
      data=> {console.log('successfully confirmed!!!',data) ;
      this.dialogRef.close("badu awathe?");             },
      error=>console.log('Error!!!',error)
    )
    
  }

}


