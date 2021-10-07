import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  _url ="";
  _url_getUserDetails ='http://localhost:3000/getUserDetails';
  _url_getVehicleDetails = 'http://localhost:3000/getVehicleDetails';
  _url_getAppointments =  'http://localhost:3000/getAppointments';
  _url_Update_confirm_edit = 'http://localhost:3000/Update_confirm_edit';
  _url_update_user_img = 'http://localhost:3000/update_user_img';
  _url_Remove_Vehicle='http://localhost:3000/Remove_Vehicle';
  _url_getRating = 'http://localhost:3000/getRating';
  _url_post_rating= 'http://localhost:3000/post_rating';
  _url_post_appointment_rated =  'http://localhost:3000/post_appointment_rated';
  _url_Remove_Appointment = 'http://localhost:3000/Remove_Appointment';

  constructor(private _http:HttpClient) { }

  enroll(fromBookTestArray: Array<string>) {
    
    return this._http.post<any>(this._url,fromBookTestArray);
  }

  getUserDetails(userIdfromSession: number){

    var param = new HttpParams();
    param = param.append('userId', userIdfromSession );
    
    return this._http.get<any>(this._url_getUserDetails, {params:param});
  }

  getVehicleDetails(userIdfromSession:number){
    var param = new HttpParams();
    param = param.append('userId', userIdfromSession );
    return this._http.get<any>(this._url_getVehicleDetails, {params:param});

  }
  getAppointments(userIdfromSession:number){
    var param = new HttpParams();
    param = param.append('userId', userIdfromSession );
    return this._http.get<any>(this._url_getAppointments, {params:param});
  }

  Update_confirm_edit(final_arr:any){

    console.log(final_arr);
    return this._http.post<any>(this._url_Update_confirm_edit, final_arr);
  }


  update_user_img(file:FormData){
  
    console.log(file);
    return this._http.post<any>(this._url_update_user_img, file);

  }

  Remove_Vehicle(vehicle_number:number){
    var param = new HttpParams();
    param = param.append('vehicle_number', vehicle_number );
    return this._http.delete<any>(this._url_Remove_Vehicle, {params:param});
  }

  getRating(st_id:number){
    var param = new HttpParams();
    param = param.append('st_id', st_id );
    return this._http.get<any>(this._url_getRating, {params:param});
  }

  post_rating(final_rating_row:any){
    return this._http.post<any>(this._url_post_rating, final_rating_row);
  }

  post_appointment_rated(appointment_id_IN_arr:any){
    return this._http.post<any>(this._url_post_appointment_rated, appointment_id_IN_arr);
  }

  Remove_Appointment(appointment_id:any){
    var param = new HttpParams();
    param = param.append('appointment_id', appointment_id );
    return this._http.delete<any>(this._url_Remove_Appointment, {params:param});
  }





}

