import { Component, OnInit, Inject  } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common'; 

import { BookingtestService } from 'src/app/bookingtest.service';
import { Pipe } from '@angular/core';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { BayNslotsClass } from 'src/app/bay-nslots-class.model';
import { Available_timeslot_bayIndex, DateAppointmentClass } from 'src/app/date-appointment-class.model';
import * as moment from 'moment';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatSelectChange } from '@angular/material/select';

import { Router } from '@angular/router';

import {ThemePalette} from '@angular/material/core';
import {ProgressBarMode} from '@angular/material/progress-bar';

// import { time } from 'console';

// export interface DialogData{
//   animal: 'panda' | 'unicorn' | 'lion';
// }

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})



export class BookingComponent implements OnInit {

  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 50;
  bufferValue = 0;



  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  fourthFormGroup!: FormGroup;
  fifthFormGroup!: FormGroup;
  sixthFormGroup!: FormGroup;
  seventhFormGroup!: FormGroup;

  myusername: string = "";
  selectvehicle: any ="";
  serviceType: string= "Full Service";


  //for 1st page
  UserIdfromSession : number = 18000045;
  vehicleRows :any;
  servicestationTownRows : any;
  servicestationAllRows : any;
  price_multiplier :number = 1;
  Owner_details:any;

  //for 2nd page
  Selected_serviceStation_Object : any ="";
  activeState_id :any = '';
  availableServices:any;
  fullServiceLocked:number = 1 ; // 1 means locked
  searchedKeyword!: string; // table search

  //3rd page
  SelectedServiceType:string = '';

  
  //4th page
  hasService: number[]=[]; // meka number array ekak.
  // 0th element represents 11 service, 1st element represent 12 service, likewise......
   // if element has 0, doesn't have that service. if 1, has that service.
  selected_services_id : number[]= [];
  TotalServiceAmount:number=0;
  TotalServiceDuration:number=0;



  //5th page
  minDate!: Date;
  maxDate!: Date;
  startDate!: Date;
  

  appointmentRows:any;
  bayRows:any;

  dateAppointment_array: DateAppointmentClass[]=[];

  dateeeee!:Date;
  Unavailable_dates: Date[] =[];
  selected_date !: Date;
  selected_date_moment :string=""; //moment(this.selected_date).format("YYYY/MM/DD");


  //6th page
  bayCount: number =0; // meka 6th page ekata ona wela naa... baycount ekak nikan aran bayrows.lenght samana karala
  selectedDateObject_from_dateAppointment_array:DateAppointmentClass = new DateAppointmentClass("dummy date") ;
  
  Selected_Start_Time :any ;
  Selected_BayID !:number;
  Selected_Start_Time_index:number=1000; //

  Available_slots_table : Available_timeslot_bayIndex[] =[];

  duration_Availability_count:number=0; //checking


//7th page
  TotalServiceDuration_with_hrs_mins: string='';
   return_array_serviceNames:string[] = [];


  testingArray: Array<string> =['abc','asda','wasdaw', 'gdsfg'];

  //nimnakage
  //nimnakage
  selected!: Date | null;

  service=false;
  selectedService(){
    this.service=!this.service;
  } // me tika 

 

  

  constructor(private _formBuilder: FormBuilder, private _bookingserviceVariable: BookingtestService,public dialog: MatDialog ,private router: Router ) { }

  ngOnInit(){
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl: ['', Validators.required]
    });
    this.fifthFormGroup = this._formBuilder.group({
      fifthCtrl: ['', Validators.required]
    });
    this.sixthFormGroup = this._formBuilder.group({
      sixthCtrl: ['', Validators.required]
    });
    this.seventhFormGroup = this._formBuilder.group({
      seventhCtrl: ['', Validators.required]
    });

    this.getOwner_details();

    //get vehicles from database
      this._bookingserviceVariable.getVehicleDetails(this.UserIdfromSession)
      .subscribe(
        data=> {this.vehicleRows = data;
          console.log(data);        
        },
        error=>console.log('vehicle details error!!',error)
        
        );

    //get service stations from databse from home town
        this._bookingserviceVariable.getServiceStationsByHomeTown(this.UserIdfromSession)
        .subscribe(
          data=> {this.servicestationTownRows = data;
            
                  
            console.log(data);
          },
          error=> console.log('get service station by home town error!',error)
          
        );

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const currentDate = new Date().getDate();
        console.log(currentMonth,"currentMonth",currentDate);
        this.minDate = new Date(currentYear,currentMonth,currentDate);
        this.maxDate = new Date(currentYear + 1, 11, 31);
        console.log(this.minDate);
       // this.startDate= new Date(currentYear,new Date().getMonth(),new Date().getDate());

       this.dateeeee = new Date(2021, 7, 26);    // 0 -11 index walin months tiyenne
 
  }

  getAllStations(){
      //get all the service stations from databse 

      this._bookingserviceVariable.getServiceStationsAll(this.UserIdfromSession,this.Owner_details.home_town)
      .subscribe(
        data=> {this.servicestationAllRows = data;
                
          console.log(data);
        },
        error=> console.log('get all service station error!',error)
        
      );
  }

  getOwner_details(){
    this._bookingserviceVariable.getOwnerdetails(this.UserIdfromSession)
    .subscribe(
      data=> {this.Owner_details = data[0];
        console.log(this.Owner_details,"owner details");
        this.getAllStations();

      },
      error=> console.log('get owner details error!',error)
      
    );
  }

  
  changeDateSelectedMoment(){
    
    this.selected_date_moment = moment(this.selected_date).format("YYYY/MM/DD");
  }


  clickme() {
    this.myusername=this.thirdFormGroup.get('thirdCtrl')?.value;
    console.log('it does nothing', this.thirdFormGroup.get('thirdCtrl'));
  }


  SelectVehicle(vehicleObject: any) {
   
    this.selectvehicle= vehicleObject;
  
    if(vehicleObject.type =="car"){
      this.price_multiplier=1;
    }
    else if(vehicleObject.type=='van'){
      this.price_multiplier=1.2;
    }
    else if(vehicleObject.type=='suv'){
      this.price_multiplier=1.4;
    }
    else { // anik ewa...lorry wage 
      this.price_multiplier=1.6;
    
  }
    console.log(this.price_multiplier);
    console.log('vehicle object selected from 1st page', this.selectvehicle);
    
}
          //meka ara mulinma hadapu function eka 
  serviceSelect(service: string) {
    this.serviceType= service;
    console.log('it does nothinggg', this.testingArray);
    this._bookingserviceVariable.enroll(this.testingArray)
      .subscribe(
        data=> console.log('success!!!',data),
        error=>console.log('Error!!!!!',error)
      )
  } // methana yanakam 



//get the available services of selected service station
//check if full service available or not
  selectServiceStation(ServiceStation: any) {
    this.Selected_serviceStation_Object= ServiceStation; 
    console.log(this.Selected_serviceStation_Object);


    this.activeState_id = ServiceStation.st_id;
    console.log(this.activeState_id);

    this._bookingserviceVariable.getAvailableServices(this.Selected_serviceStation_Object.st_id)
    .subscribe(
      data=>  {  this.availableServices= data; 
                  // console.log(this.availableServices, " avaialable services");

                  for(var i in this.availableServices){
                    this.availableServices[i].amount = this.availableServices[i].amount * this.price_multiplier;
                  }

                  console.log(this.availableServices, " avaialable services after");
                 // console.log(JSON.parse(JSON.stringify(obj)))  console before after changes same wena awla nathi wenawa meken.
                 //console.log eken pennanne reference eke print ekak.ethakota parana ekath aluth eke value eken print wenne.

                  

                  let x:(any|undefined)[]=[];

                    x[0] =this.availableServices.find((element: { service_id: number; }) => element.service_id === 11);
                    x[3]=this.availableServices.find((element: { service_id: number; }) => element.service_id === 14);
                    x[6]=this.availableServices.find((element: { service_id: number; }) => element.service_id === 17);

                   if(x[0]!= undefined  && x[3]!=undefined && x[6]!=undefined){
                      this.fullServiceLocked = 0;
                   }
                   else this.fullServiceLocked=1;
                  console.log(this.fullServiceLocked);


                   x[1]=this.availableServices.find((element: { service_id: number; }) => element.service_id === 12);
                   x[2]=this.availableServices.find((element: { service_id: number; }) => element.service_id === 13);
                   x[4]=this.availableServices.find((element: { service_id: number; }) => element.service_id === 15);
                   x[5]=this.availableServices.find((element: { service_id: number; }) => element.service_id === 16);
                   x[7]=this.availableServices.find((element: { service_id: number; }) => element.service_id === 18);
                  
                    for(let i =0;i<8;i++){
                      if(x[i]!=undefined) {
                        this.hasService[i] = 1;
                      }
                      else {
                        this.hasService[i] = 0;
                      }

                      console.log( i+" "+this.hasService[i]);
                    }
                  

                },
      error=> console.log('get all services of station error!!',error)
    );
                  
  } 

  emptyServiceStations(){
    this.Selected_serviceStation_Object = '';
    this.activeState_id = '';
  }


  selectServiceType(service_type: string){
    this.SelectedServiceType = service_type;
    console.log(service_type);

    this.selected_services_id = [];
    this.TotalServiceAmount = 0;
    this.TotalServiceDuration=0;

    if(service_type=="full service"){
      this.selected_services_id.push(11);
      this.selected_services_id.push(14);
      this.selected_services_id.push(17); 
      
      this.TotalServiceAmount = this.availableServices.find((element: { service_id: number; }) => element.service_id === 11).amount + this.availableServices.find((element: { service_id: number; }) => element.service_id === 14).amount+this.availableServices.find((element: { service_id: number; }) => element.service_id === 17).amount;
      console.log(this.TotalServiceAmount);
      this.TotalServiceDuration = this.availableServices.find((element: { service_id: number; }) => element.service_id === 11).duration_hrs + this.availableServices.find((element: { service_id: number; }) => element.service_id === 14).duration_hrs+this.availableServices.find((element: { service_id: number; }) => element.service_id === 17).duration_hrs;
      console.log(this.TotalServiceDuration);

      
    }
  }

  hasServiceFunction(elemnt_of_service: number){
    if(this.hasService[elemnt_of_service]!= undefined){
      return true;
    }
    else return false;
  }

  SelectPreferedServices(service_id:number){

    if(this.SelectedServiceType=== "full service" && (service_id==11 || service_id==14|| service_id==17)){

    }
    else{
          if(this.selected_services_id.find(element=> element==service_id) == undefined){
            this.selected_services_id.push(service_id);


            this.TotalServiceAmount = this.TotalServiceAmount +  this.availableServices.find((element: { service_id: number; }) => element.service_id === service_id).amount;
            console.log(this.TotalServiceAmount);

            this.TotalServiceDuration = this.TotalServiceDuration +   this.availableServices.find((element: { service_id: number; }) => element.service_id === service_id).duration_hrs;
            console.log(this.TotalServiceDuration);
        }
        else{
          let index: number = this.selected_services_id.indexOf(service_id);
            if (index !== -1) {
              this.selected_services_id.splice(index, 1);


              this.TotalServiceAmount = this.TotalServiceAmount -  this.availableServices.find((element: { service_id: number; }) => element.service_id === service_id).amount
              console.log(this.TotalServiceAmount);

              this.TotalServiceDuration = this.TotalServiceDuration -  this.availableServices.find((element: { service_id: number; }) => element.service_id === service_id).duration_hrs
              console.log(this.TotalServiceDuration);

            }       
        }
    }

    console.log(this.selected_services_id);

  
  }


  renderClass(service_id:number):string{
    if(this.SelectedServiceType==="full service"){
      return "fullServiceSelected";
    }
    else{
     if(this.selected_services_id.indexOf(service_id) !== -1 ){
       return "serviceSelected";
     }
     else return "";
    }
  }

  EmptySelectedServices(){
    this.selected_services_id = [];
    console.log(this.selected_services_id);
    this.SelectedServiceType='';

    this.TotalServiceAmount = 0;
    this.TotalServiceDuration=0;
  }


  dateFilter =(date:Date|null):boolean=> { 
    if(date!=null){
      const day =date.getDay();  

          var date_moment = moment(date).format("YYYY-MM-DD")  ;
          var moment_array_unavailable = this.Unavailable_dates.map(x => moment(x).format("YYYY-MM-DD"));

          console.log(moment_array_unavailable); // 5:30:00 time tiyenne but indian time
          console.log(date_moment); // 00:00:00 time tiyenne but indian time ---> calender eken enne
          // eka nisa string karala compare kala 
          

        return   !moment_array_unavailable.some(x => x == date_moment)    ;   //false nam lock wenawa day eka
        // !this.Unavailable_dates.find(x=>x.getTime()==date.getTime())
    }
    else return false;    
  }

 

  CheckLockedDates(){
    this._bookingserviceVariable.getLockedDates(this.Selected_serviceStation_Object.st_id)
    .subscribe(
      data=> console.log('locked datess',data),
      error=>console.log('Error!!!!!',error)
    );

  }


  getAppointmentRows(){
    this._bookingserviceVariable.getAppointmentRows(this.Selected_serviceStation_Object.st_id)
      .subscribe(
        data=> {console.log('locked datess',data);
                 this.appointmentRows = data;     
                console.log(this.appointmentRows.length+"length"); 
                 
                  },
        error=>console.log('Error!!!!!',error)
      );

  }

  getBaysDetails(){
    this._bookingserviceVariable.getBaysDetails(this.Selected_serviceStation_Object.st_id)
    .subscribe(
      data=> {console.log('bay details',data);
               this.bayRows = data; 
               this.bayCount = this.bayRows.length;
                console.log(this.bayCount+" bay ccccount");  },
      error=>console.log('Error in bayDetails',error)
    );

    //console.log(this.appointmentRows.length+"APPINTMENT length in getBaysDetails");

  }

  get_start_end_index(time:any, duration:any){

    let start_time_hrs = moment(time ).format(" HH");
    let start_time_mins = moment(time).format(" mm");
    let start_time_mins_deci  = Number(start_time_mins)/60;
    let start_time_correct = Number(start_time_hrs) + start_time_mins_deci;
    var final_time = start_time_correct + Number(duration);

    let strt_index = (start_time_correct-9)*2;
    let end_index = ((final_time-9) *2)-1;

    const indexes= [strt_index,end_index];

    return indexes;


  }

  checkAvaialability(){

    console.log(" checkAvaialability ekata awa");

    if(this.appointmentRows!=""){

      console.log(" checkAvaialability eke appointmentRows! awa");

        console.log(this.appointmentRows.length+"ALen");

        for(let i =0;i<this.appointmentRows.length ; i++ ){

          console.log(" loop ekata awa");
          if(this.dateAppointment_array.length==0  ||  this.dateAppointment_array.map(function(x) {return x.date; }).indexOf(moment(this.appointmentRows[i].TIMEE ).format("YYYY-MM-DD")) ==-1 ){

            console.log(" if ekata awa");

            let date_object = new DateAppointmentClass(moment(this.appointmentRows[i].TIMEE ).format("YYYY-MM-DD")) ;
            for(let j=0;j<this.bayRows.length;j++){
              date_object.object_array.push(new BayNslotsClass(this.bayRows[j].bayID));
            }
            let indexOfbay_AppointmentRow = date_object.object_array.map(function(x) {return x.bayId; }).indexOf(this.appointmentRows[i].bay_id);

            let indexes =  this.get_start_end_index(this.appointmentRows[i].TIMEE,this.appointmentRows[i].duration_hrs);
            let strt_index = indexes[0];
            let end_index = indexes[1];

            for(let x=strt_index;x<end_index+1;x++){
              date_object.object_array[indexOfbay_AppointmentRow].baySlots[x] =1;
            }
            this.dateAppointment_array.push(date_object);
            
          }
          else{

            let indexOfEqualDates = this.dateAppointment_array.map(function(x) {return x.date; }).indexOf(moment(this.appointmentRows[i].TIMEE ).format("YYYY-MM-DD"))
            let indexOfbay_AppointmentRow = this.dateAppointment_array[indexOfEqualDates].object_array.map(function(x) {return x.bayId; }).indexOf(this.appointmentRows[i].bay_id);
            let indexes =  this.get_start_end_index(this.appointmentRows[i].TIMEE,this.appointmentRows[i].duration_hrs);
            let strt_index = indexes[0];
            let end_index = indexes[1];

            for(let x=strt_index;x<end_index+1;x++){
              this.dateAppointment_array[indexOfEqualDates].object_array[indexOfbay_AppointmentRow].baySlots[x] =1;
            }


          }
        }

        console.log("loop eken eliye");


    }
    else{
      console.log("appointment rows naa");
    }

    console.log(this.dateAppointment_array);

  }

  checkWithDuration(){
    const totalSlots_needed = this.TotalServiceDuration *2;
    console.log(totalSlots_needed+"slots needed");
    console.log(this.dateAppointment_array);
    var free_slots_count =0;

    for(let i=0;i<this.dateAppointment_array.length;i++){// date objects
      
      // console.log(i+"i\n");
      free_slots_count=0;
       
      for(let j=0;j<this.dateAppointment_array[i].object_array.length;j++){// date ekak athule bay array
        // console.log(j+"j\n");
        free_slots_count=0;
        
        for(let k=0;k<this.dateAppointment_array[i].object_array[j].baySlots.length;k++){// bay eke 18
            
          // console.log(k+"k\n");
            if(this.dateAppointment_array[i].object_array[j].baySlots[k] ==0){
              free_slots_count++;
              // console.log(free_slots_count);
                      
            }
            else{
              free_slots_count=0;
            }

            if(free_slots_count==totalSlots_needed) { 
               console.log("athulen break");
              break;
            }   

        }

        if(free_slots_count==totalSlots_needed){
          console.log("eliyen break");
          break;
        }

        if(j==this.dateAppointment_array[i].object_array.length-1  &&  free_slots_count!=totalSlots_needed ){
          console.log(this.dateAppointment_array[i].date + " new date ta kalin");
          this.Unavailable_dates.push(    new Date(  this.dateAppointment_array[i].date )     );
          console.log(this.Unavailable_dates[0] + " new date ta passe");
          console.log(" me length-1 scn ekata awa");
        }
       
      }


    }

    console.log(this.Unavailable_dates + "unavailableee");
  }

  EmptyUnavailableDates(){
    console.log("empty kala unavailable dates");
    this.Unavailable_dates = [];
    
    this.selected_date_moment =""; // selected date eka empty karanwa back giyoth.

  }

  setTimeSlots(){

      console.log(this.dateAppointment_array, "hhhhh");
      console.log(moment(this.selected_date).format("YYYY-MM-DD") + "mmnt");
      //console.log(this.selected_date_moment+ "orignl mmnt"); //selected_date_moment eka ganna ba eka tiyenne yyyy/mmm/ddd .... yyy-mm-d nemei
      console.log(this.dateAppointment_array+"kkkkkk");

      let index_date_object = this.dateAppointment_array.findIndex(x => x.date == moment(this.selected_date).format("YYYY-MM-DD"));
      let date_object;

      if(index_date_object==-1){  
        date_object=undefined;
        console.log("index-1")
      }
      else{
        

         date_object = JSON.parse(JSON.stringify(this.dateAppointment_array[index_date_object]));
        //kalin pahala comment eke vidiyata nikan assign kale. ethakota reference ekak enawa date_object ekata this.dateAppointment_array[index_date_object]  eken.
        //eetapasse pahala this.selectedDateObject_from_dateAppointment_array = date_object karala tynwa. me deka athara reference enwa.
        //ethakota this.selectedDateObject_from_dateAppointment_array AND this.dateAppointment_array[index_date_object] athara reference enwa.
        //pahala this.selectedDateObject_from_dateAppointment_array.object_array.length =0 karala tiynwa. ethakota this.dateAppointment_array[index_date_object] length ekath 0 wenawa.


        // date_object = this.dateAppointment_array[index_date_object];
      }

    if(  date_object==undefined ){
        console.log("ona welawak plwn denna. ");

        this.selectedDateObject_from_dateAppointment_array.object_array.length = 0;

        this.selectedDateObject_from_dateAppointment_array.date = moment(this.selected_date).format("YYYY-MM-DD");

        for(let i =0;i <this.bayRows.length;i++){
          this.selectedDateObject_from_dateAppointment_array.object_array.push(new BayNslotsClass(this.bayRows[i].bayID));
        }

        //console.log(this.selectedDateObject_from_dateAppointment_array.object_array[0].baySlots+" objct arrayss if eke for psse ");
        // console.log(this.selectedDateObject_from_dateAppointment_array.object_array[1].baySlots+" objct arrayss if eke for psse"); 

    }
    else{

      this.selectedDateObject_from_dateAppointment_array = date_object;

      console.log(this.selectedDateObject_from_dateAppointment_array.object_array[0].baySlots+" objct arrayss else eke ");
      // console.log(this.selectedDateObject_from_dateAppointment_array.object_array[1].baySlots+" objct arrayss else eke "); 
      console.log("else eke inne");

    }
    // console.log(this.selectedDateObject_from_dateAppointment_array.object_array[0].baySlots+" objct arrayss");
    // console.log(this.selectedDateObject_from_dateAppointment_array.object_array[1].baySlots+" objct arrayss");


    // console.log(this.selected_date_moment + "caller");
     console.log(this.bayRows.length);
    
    // let x = this.Map_to_OneTable();
    // this.Available_slots_table =x;
    //console.log(this.Available_slots_table+ "slots table form setTime");

    console.log("settimeSlots iwarai");


  }

  printTimeslot_Intable_AM_PM(j:number){
    let LHS_AM_PM = this.printTimeslot_InTable(j);
    return moment(LHS_AM_PM, ["HH.mm"]).format("hh:mm A");
  }

  printTimeslot_InTable(j:number){ // ForWhat=1 means get the range , ForWhat =0 means get L

      let duration_hrs  = (j* 30)/60; 
      let LHS_deci = 9+ duration_hrs;    //14:30 -15:00
      let RHS_deci = LHS_deci+ 0.5;
      
      let LHS_hour_str = String(Math.floor(LHS_deci)); // "14"
      let LHS_mins_str = String( (LHS_deci % 1)*60 ); // "30 || 0"

      let RHS_hour_str = String( Math.floor(RHS_deci)  );  // "15"
      let RHS_mins_str = String( (RHS_deci % 1)*60   ); // "30||0"

      if(LHS_hour_str.length==1){
        LHS_hour_str = "0"+LHS_hour_str;
      }
      if(RHS_hour_str.length==1){
        RHS_hour_str = "0"+RHS_hour_str;
      }

      if(LHS_mins_str=="0"){
        LHS_mins_str = "00";
      }
      if(RHS_mins_str=="0"){
        RHS_mins_str = "00";
      }

      let LHS = LHS_hour_str.concat(':',LHS_mins_str);
      let RHS = RHS_hour_str.concat(':',RHS_mins_str);

      var LHS_RHS = LHS.concat(' - ',RHS);


    //  return LHS_RHS;
        return LHS;
 
  }


  duration_Availability=(bay_index:number, time_index: number )=>{

      this.duration_Availability_count++;
     // console.log("menna "+ bay_index +"-"+time_index +"="+ this.duration_Availability_count); ...........................



    let availability_count =0;

    let consistent_slots = this.TotalServiceDuration *2;
   // console.log(this.TotalServiceDuration+" total duration enwada?"); .....................................

    for(let i =time_index;i< (consistent_slots+time_index) ;i++){
        if(   this.selectedDateObject_from_dateAppointment_array.object_array[bay_index].baySlots[i] == 0     ){
            availability_count++;

        }
        else{ 
          availability_count=0;
          return "Cannot_Allocate";
        }
    }

     return "Can_Allocate";

  }

  timeslot_Select(bay_index:number,time_index:number){
      console.log(time_index+"click una ");

      this.Selected_Start_Time = this.printTimeslot_InTable(time_index);
      this.Selected_Start_Time_index =time_index;

      this.Selected_BayID = this.selectedDateObject_from_dateAppointment_array.object_array[bay_index].bayId;
      console.log(this.Selected_Start_Time +","+ this.Selected_BayID);

  }

  GetTotalDuration_hrs_mins(){
    let hrs_floor_str =  String(Math.floor(this.TotalServiceDuration));
    let min_str=  String( (this.TotalServiceDuration % 1)*60 ); // "30 || 0"

    if(min_str=="0"){
        min_str ="00";
    }
    this.TotalServiceDuration_with_hrs_mins = hrs_floor_str+ "hours + " +min_str+"mins"; // 2 hours + 30mins

  }

  send_Appointment_date_HTML (){

    return    moment(this.selected_date).format("DD")+"-"+ moment().month(     Number(moment(this.selected_date).format("MM")) -1      ).format("MMMM")+"-"+  moment(this.selected_date).format("YYYY") ;//2021 octomber 08 
  }

  send_Appointment_duration_range_HTML(){
    let LHS_str = this.printTimeslot_InTable(this.Selected_Start_Time_index); //09:30
    let RHS_str = this.printTimeslot_InTable( this.Selected_Start_Time_index + this.TotalServiceDuration*2   ) //14:30

    return moment(LHS_str, ["HH.mm"]).format("hh:mm a") +" - " + moment(RHS_str, ["HH.mm"]).format("hh:mm a");
  }


  Map_to_OneTable(){
    
    //console.log(that.selected_date_moment+ "callee");
    console.log(this.selected_date_moment+ "callee this");
    console.log(this.bayRows.length+"callee");

    //console.log("map to one ekata awa"+ this.startDate);

    for(let j=0;j<18;j++){ // timeslot rows
      for(let i =0;i<this.bayRows.length;i++){ //bay rows
        if(   this.duration_Availability(i,j)== "Can_Allocate"  &&  this.Available_slots_table.map(function(x) {return x.timeSlot_index; }).indexOf( j )== -1  ){  /* j = time slot index */ 
          this.Available_slots_table.push(  new Available_timeslot_bayIndex(i,j)  );   
          break;

        }
      }
    }


    console.log(this.Available_slots_table+ " from map_to_one");
    // return this.Available_slots_table;

  }

  Empty_OneTable_availableSlots(){
    this.Available_slots_table=[];
  }

  print_selectedServices(){

    console.log(this.availableServices);
    console.log(this.selected_services_id);


    for(let i =0;i<this.selected_services_id.length;i++){

      let index =this.availableServices.findIndex((x: { service_id: number; })=> x.service_id ==this.selected_services_id[i] ); 

      // fruits.findIndex(fruit => fruit.type === "Orange"); 

        if(  index !=-1    ){
          this.return_array_serviceNames.push(this.availableServices[index].service_name);
        }
    }

    console.log(this.return_array_serviceNames);

  }

  empty_return_Services(){
    this.return_array_serviceNames = [];
  }

  rate_bar(current_rate:number){
    return current_rate*100/5;
  }

  confirm_appointment(/*st_id:number , bay_id:number, date:Date , date_timestamp:string, duration: number,reminder:number*/){
      let st_id = this.Selected_serviceStation_Object.st_id;
      let bay_id = this.Selected_BayID ;
      let duration = this.TotalServiceDuration;
      let date =  this.selected_date;
      // let date_ISO = date.toISOString();
      let vehicle_number = this.selectvehicle.vehicle_number;

      // console.log(date,"from calender date");
      // console.log(date.toISOString());// meken wenne date eka ISO type ekata convert karanawa. ara z tiyana scene eka.
      // console.log(this.Selected_Start_Time+"strtTime"); //24hrs walin tiyenne

      let momentDate = moment(date).format("YYYY-MM-DD");
      // console.log(momentDate+"mmntDate")
      // console.log(this.Selected_Start_Time);
      let date_time_stampUTZ = momentDate+"T"+String(this.Selected_Start_Time)+":00.000Z" ;
      // console.log(date_time_stampUTZ,"hadapu stamp");
      // console.log ( moment( date_time_stampUTZ ).format() , "hadapu stmp momnt"   );
      // console.log(  new Date(), "new Date"   );
      // console.log (  new Date().toISOString(),"new date ISO" );
      // console.log (  moment(  new Date() ).format() , "new date momnet"   );


      let momented_time_stamp = moment( date_time_stampUTZ ).format(); 
      let moment_stamp_wage_made = momentDate+"T"+String(this.Selected_Start_Time)+":00+05:30" ;

      let waradda_hewwa = momentDate+" "+this.Selected_Start_Time+":00";
      console.log(waradda_hewwa,"wrdda hewwa");

      let isonline=1;

      var final_arr = [ st_id,bay_id,duration,waradda_hewwa,vehicle_number, momentDate, this.selected_services_id,  isonline ];

      let Selected_Start_Time_AM_PM =  moment(this.Selected_Start_Time,["HH:mm"]).format("hh:mm A");
      console.log(this.Selected_Start_Time,Selected_Start_Time_AM_PM);
      var email_arr = [st_id,    this.Selected_serviceStation_Object.st_name,       bay_id,     duration,    momentDate,    Selected_Start_Time_AM_PM,   vehicle_number    ,  this.selected_services_id   ,this.Owner_details.email];

      console.log(email_arr);


      this._bookingserviceVariable.set_confirm_appointment(final_arr)
      .subscribe(
        data=> { console.log('successfully confirmed!!!',data);
        this.send_appointment_confirmation_email(email_arr);
          this.router.navigate(['/profile']);    },
        error=>console.log('Error!!!',error)
      )

  }

  send_appointment_confirmation_email(email_arr:any){

    let selected_services_names=[];

    for(let i=0;i<this.selected_services_id.length;i++){

     let index=  this.availableServices.map(function(x: { service_id: any; }) {return x.service_id; }).indexOf( this.selected_services_id[i] );
     selected_services_names.push (  this.availableServices[index].service_name   );
    }

    email_arr.push( selected_services_names  );
    console.log(email_arr)

    this._bookingserviceVariable.send_appointment_confirmation_email(email_arr)
    .subscribe(
      data=> { console.log('successfully sent email!!!',data);     },
      error=>console.log('Error sending email!!!',error)
    )
  }


  timeSlot_disable(time_AM:any){
    console.log(time_AM);
    let today = moment(new Date()).format("YYYY-MM-DD");
    let selected_date_chnged_format_mmnt = moment( this.selected_date_moment   ).format("YYYY-MM-DD");
    console.log( this.selected_date_moment,selected_date_chnged_format_mmnt, today);
    if(   moment(selected_date_chnged_format_mmnt).isSame(today)   ){     
      if( this.convertTimeDecimal(  moment(new Date() ).format("HH:mm")   )>=   this.convertTimeDecimal(  moment(time_AM,["hh:mm A"]).format("HH:mm")  )    ){
        return "disable";
      }
      else return "enable";
    }
    else return "enable;"
  }

  convertTimeDecimal(time_24H:any){
    // let now_hr_min = moment(new Date() ).format("HH:mm") ;
    let hr_min = time_24H.split(":");
    let hr_deci = Number( hr_min[0] );
    let min_deci= Number(  hr_min[1] );
    // console.log(hr_deci,min_deci)
    
    let final_now = hr_deci +  (min_deci/60);
    // console.log(final_now,"final now");
    return final_now;

  }

  openDialog() {
    this.dialog.open(AddCarBookingComponent, {
      data: {
        user_id: this.UserIdfromSession
      }
    });
  }

// add vehicle component   dd vehicle component add vehicle component add vehicle component add vehicle component
// add vehicle component   dd vehicle component add vehicle component add vehicle component add vehicle component
// add vehicle component   dd vehicle component add vehicle component add vehicle component add vehicle component
// add vehicle component   dd vehicle component add vehicle component add vehicle component add vehicle component
// add vehicle component   dd vehicle component add vehicle component add vehicle component add vehicle component
// add vehicle component   dd vehicle component add vehicle component add vehicle component add vehicle component


}

@Component({
  selector: 'addcarbooking',
  templateUrl: 'addcarbooking.html',
  styleUrls: ['./addvehicle.css']
})
export class AddCarBookingComponent {

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

