
import { BayNslotsClass } from "./bay-nslots-class.model";

export class DateAppointmentClass {
    public date: any;
    public object_array!: BayNslotsClass[];

    constructor(date:any ){
        this.date = date;
        this.object_array =[];
        
    }

}


export class Available_timeslot_bayIndex{
    public timeSlot_index : number ;
    public bay_index : number;
    
    constructor( bay_index:number, timeSlot_index:number){
        this.bay_index = bay_index;
        this.timeSlot_index= timeSlot_index;
    }
}

export class Ongoing_Appointment{
    public appointment_id :number;
    public value :number;
    public time : string;
    public make : string;
    public model:string;
    public vehicle_number : string;


    constructor( a_id:number ,time:string , make:string , model : string , vehicle_number : string){
        this.appointment_id = a_id;
        this.time= time;
        this.value =0;
        this.make = make;
        this.model = model;
        this.vehicle_number = vehicle_number;
    }
}

export class freeSlots{
    public time : number ;
    public duration_hrs : number;
    public isonline : any;
    public bay_id :any;
    
    constructor( time:number, duration_hrs:number , bay_id:any){
        this.time = time;
        this.duration_hrs= duration_hrs;
        this.isonline = "free";
        this.bay_id=bay_id;
    }
}