import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  _url_getRequestedServiceStations ='http://localhost:3000/getRequestedServiceStations';
  _url_get_details_of_req_station = 'http://localhost:3000/get_details_of_req_station';
  _url_getAllServiceStations = 'http://localhost:3000/getAllServiceStations';
  _url_getAllVehicleOwners = 'http://localhost:3000/getAllVehicleOwners';
  _url_post_ServiceStation = 'http://localhost:3000/post_ServiceStation';
  _url_post_serviceStation_services= 'http://localhost:3000/post_serviceStation_services';
  _url_remove_requested_station = 'http://localhost:3000/remove_requested_station';
  _url_insert_station_to_ratings = 'http://localhost:3000/insert_station_to_ratings';
  _url_insert_to_bays ='http://localhost:3000/insert_to_bays';
  _url_update_account_table = 'http://localhost:3000/update_account_table';

  constructor(private _http:HttpClient) { }

  getRequestedServiceStations(){

    // var param = new HttpParams();
    // param = param.append('userId', userIdfromSession );
    return this._http.get<any>(this._url_getRequestedServiceStations  );
  }

  get_details_of_req_station(reg_number:string){

    var param = new HttpParams();
    param = param.append('reg_number', reg_number );
    return this._http.get<any>(this._url_get_details_of_req_station , {params:param} );

  }

  getAllServiceStations(){
    return this._http.get<any>(this._url_getAllServiceStations  );
  }

  getAllVehicleOwners(){
    return this._http.get<any>(this._url_getAllVehicleOwners  );
  }

  post_ServiceStation(service_station_arr:any){
    return this._http.post<any>(this._url_post_ServiceStation , service_station_arr );
  }

  post_serviceStation_services(service_station_services_arr:any){
    return this._http.post<any>(this._url_post_serviceStation_services, service_station_services_arr);

  }

  remove_requested_station(reg_number:string){
    var param = new HttpParams();
    param = param.append('reg_number', reg_number );
    return this._http.delete<any>(this._url_remove_requested_station, {params:param} );
  }

  insert_station_to_ratings(pass_arr:any){
    return this._http.post<any>(this._url_insert_station_to_ratings , pass_arr );
  }

  insert_to_bays(arr_bays:any){
    return this._http.post<any>(this._url_insert_to_bays , arr_bays );
  }

  update_account_table(account_email_accpt_arr:any){
    return this._http.post<any>(this._url_update_account_table , account_email_accpt_arr );
  }


}
