import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import * as moment from 'moment';
import { StationService } from 'src/app/stationService/station.service';



export interface PeriodicElement {
  service: string;
  position: number;
  vehicleNo: string;
  bay: number;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, service: 'Full service', bay: 1, vehicleNo: 'WP HH 6460'},
//   {position: 2, service: 'Full service', bay: 4, vehicleNo: 'WP JR 6460'},
//   {position: 3, service: 'Custom service', bay: 2, vehicleNo: 'WP CAR 6460'},
//   {position: 4, service: 'Full service', bay: 1, vehicleNo: 'WP CAB 6460'},
//   {position: 5, service: 'Full service', bay: 6, vehicleNo: 'WP CBI 6460'},
//   {position: 6, service: 'Custom service', bay: 2, vehicleNo: 'WP MY 6460'},
//   {position: 7, service: 'Full service', bay: 3, vehicleNo: 'WP DAD 6460'},
//   {position: 8, service: 'Custom service', bay: 4, vehicleNo: 'WP CAT 6460'},
//   {position: 9, service: 'Full service', bay: 3, vehicleNo: 'WP CBI 6460'},
//   {position: 10, service: 'Full service', bay: 1, vehicleNo: 'WP CAQ 6460'},

// ];



@Component({
  selector: 'app-stationprofile',
  templateUrl: './stationprofile.component.html',
  styleUrls: ['./stationprofile.component.css']
})
export class StationprofileComponent {

  // displayedColumns: string[] = ['position', 'service', 'bay', 'vehicleNo'];
  // dataSource = ELEMENT_DATA;


  colorBay1: ThemePalette = 'primary';
  modeBay1: ProgressSpinnerMode = 'determinate';
  valueBay1 = 80;
  diameterBay1 = 300;

  ///////////
  ServiceStationIDfromSession:any = 1;
  Allappointments:any;
  TodayAppointments:any= [];

  constructor(private _stationServiceVariable:StationService){}

  ngOnInit(): void {
    this.getAllBookings(); // meka athule get today booking function eka call kala.

  }

  getTodayBookings(){
    console.log(  moment().format("DD/MM/YYYY")   );
    for(let i=0;i<this.Allappointments.length;i++){
      if( moment().format("DD/MM/YYYY") == this.Allappointments[i].date  ){
        this.TodayAppointments.push( this.Allappointments[i]);
      }
    }
    console.log(this.TodayAppointments,"todayAppointments");
  }

  getAllBookings(){
    this._stationServiceVariable.getTodayBookings(this.ServiceStationIDfromSession)
    .subscribe(
      data=> {this.Allappointments = data;
        console.log(this.Allappointments);      
        
        this.makeDateTime();
        this.getTodayBookings(); //from all bookings
        
      },
      error=>console.log('today appointment details error!!',error)
      );
  }

  makeDateTime(){

    for(let i =0;i<this.Allappointments.length;i++){

      let range = this.getRange(moment(this.Allappointments[i].time).format("HH "),moment(this.Allappointments[i].time).format("mm") , this.Allappointments[i].duration_hrs );
      this.Allappointments[i].time =   range;
      this.Allappointments[i].date =  moment(this.Allappointments[i].date ).format("DD/MM/YYYY");
    }
    
    console.log(this.Allappointments,"fixed appointments");
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





}

