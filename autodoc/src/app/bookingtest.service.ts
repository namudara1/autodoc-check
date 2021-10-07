import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BookingtestService {
 

  _url ='http://localhost:3000/enroll';
  _url_getVehicleName='http://localhost:3000/getVehicleDetails';
  _url_getServiceStationsByHomeTown = 'http://localhost:3000/getServiceStationsByHomeTown';
  _url_getServiceStationsAll = 'http://localhost:3000/getServiceStationsAll';
  _url_getServicesOfServiceStation = 'http://localhost:3000/getServicesOfServiceStation';
  _url_getLockedDates = 'http://localhost:3000/getLockedDates';

  _url_getAppointmentRows = 'http://localhost:3000/getAppointmentRows';
  _url_getBaysDetails = 'http://localhost:3000/getBaysDetails';
  _url_postConfirmation = 'http://localhost:3000/postConfirmation';
  _url_getOwnerdetails = 'http://localhost:3000/getOwnerdetails';
  _url_postaddNewVehicle = 'http://localhost:3000/postaddNewVehicle';
  _url_postChooseFile = 'http://localhost:3000/postChooseFile';
  _url_send_appointment_confirmation_email = 'http://localhost:3000/send_appointment_confirmation_email';
  _url_postConfirmation_manual= 'http://localhost:3000/postConfirmation_manual';
  

  constructor(private _http:HttpClient){ }

  enroll(fromBookTestArray: Array<string>) {
    
    return this._http.post<any>(this._url,fromBookTestArray);
  }


  getVehicleDetails(userIdfromSession: number){

    var param = new HttpParams();

    // Begin assigning parameters
    param = param.append('userId', userIdfromSession );
    

    return this._http.get<any>(this._url_getVehicleName, {params:param});
  }

  
  getServiceStationsByHomeTown(userIdfromSession: number){

    var param = new HttpParams();

    param = param.append('userId', userIdfromSession );


    return this._http.get<any>(this._url_getServiceStationsByHomeTown, {params: param});
  }

  getServiceStationsAll(userIdfromSession: number,home_town:string){

    var param = new HttpParams();

    param = param.append('userId', userIdfromSession );
    param = param.append('home_town', home_town );

    return this._http.get<any>(this._url_getServiceStationsAll, {params: param});
  }

  getAvailableServices(ServiceIdFromTs: number){

    var param = new HttpParams();

    param = param.append('serviceId', ServiceIdFromTs );

    return this._http.get<any>(this._url_getServicesOfServiceStation, {params:param});
  }

  getLockedDates(ServiceIdFromTs: number){

    var param = new HttpParams();

    param = param.append('serviceId', ServiceIdFromTs );
    // param = param.append('service_Duration', serviceDuration );


    return this._http.get<any>(this._url_getLockedDates, {params:param});
  }

  getAppointmentRows(ServiceIdFromTs: number){
    
    var param = new HttpParams();

    param = param.append('serviceId', ServiceIdFromTs );

    return this._http.get<any>(this._url_getAppointmentRows, {params:param});

  }


  getBaysDetails(ServiceIdFromTs: number){
    
    var param = new HttpParams();

    param = param.append('serviceId', ServiceIdFromTs );

    return this._http.get<any>(this._url_getBaysDetails, {params:param});

  }

  set_confirm_appointment(final_arr:any){
    
    console.log(final_arr);
    return this._http.post<any>(this._url_postConfirmation, final_arr);
    
  }
  
  set_confirm_appointment_manual(final_arr:any){
    return this._http.post<any>(this._url_postConfirmation_manual, final_arr);
  }

  getOwnerdetails(userID:number){

    var param = new HttpParams();
    param = param.append('userID', userID );
    return this._http.get<any>(this._url_getOwnerdetails,{params:param});
  }

  postaddNewVehicle(final_arr:any){

    console.log(final_arr);
    return this._http.post<any>(this._url_postaddNewVehicle, final_arr);
    
  }

  postChooseFile(file:FormData){
  
    console.log(file);
    return this._http.post<any>(this._url_postChooseFile, file);

  }
  
   // file from event.target.files[0]
   uploadFile(url: string, file: File): Observable<HttpEvent<any>> {

    let formData = new FormData();
    formData.append('upload', file);

    let params = new HttpParams();

    const options = {
      params: params,
      reportProgress: true,
    };

    const req = new HttpRequest('POST', url, formData, options);
    return this._http.request(req);
  }

  send_appointment_confirmation_email(email_arr:any){
    return this._http.post<any>(this._url_send_appointment_confirmation_email, email_arr);
  }


}



