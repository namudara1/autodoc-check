import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  service: string;
  position: number;
  vehicleNo: string;
  bay: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, service: 'Full service', bay: 1, vehicleNo: 'WP HH 6460'},
  {position: 2, service: 'Full service', bay: 4, vehicleNo: 'WP JR 6460'},
  {position: 3, service: 'Custom service', bay: 2, vehicleNo: 'WP CAR 6460'},
  {position: 4, service: 'Full service', bay: 1, vehicleNo: 'WP CAB 6460'},
  {position: 5, service: 'Full service', bay: 6, vehicleNo: 'WP CBI 6460'},
  {position: 6, service: 'Custom service', bay: 2, vehicleNo: 'WP MY 6460'},
  {position: 7, service: 'Full service', bay: 3, vehicleNo: 'WP DAD 6460'},
  {position: 8, service: 'Custom service', bay: 4, vehicleNo: 'WP CAT 6460'},
  {position: 9, service: 'Full service', bay: 3, vehicleNo: 'WP CBI 6460'},
  {position: 10, service: 'Full service', bay: 1, vehicleNo: 'WP CAQ 6460'},

];


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['position', 'service', 'bay', 'vehicleNo'];
  dataSource = ELEMENT_DATA;

  panelOpenState = false;

  constructor() { 
  }

  ngOnInit(): void {
  }

}
