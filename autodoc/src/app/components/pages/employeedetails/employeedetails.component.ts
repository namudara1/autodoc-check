import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-employeedetails',
  templateUrl: './employeedetails.component.html',
  styleUrls: ['./employeedetails.component.css'],

  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EmployeedetailsComponent implements OnInit {
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['Position', 'ID', 'Name', 'Profession', 'Bay'];
  expandedElement: PeriodicElement | null;

  value = '';
  constructor() { 
    this.expandedElement = null;
    
  }
  
  ngOnInit(): void {
  }

}
export interface PeriodicElement {
  Name: string;
  Position: number;
  ID: string;
  Profession: string;
  Bay: number;
  // description: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    Position: 1,
    Name: 'Saman Silva',
    ID: 'EMP0001',
    Profession: 'Washer',
    Bay: 1,
  
  }, 
  {
    Position: 2,
    Name: 'Gayan Perera',
    ID: 'EMP0002',
    Profession: 'Engine Tuner',
    Bay: 1,
  
  }, 
  {
    Position: 3,
    Name: 'Saman Silva',
    ID: 'EMP0001',
    Profession: 'Washer',
    Bay: 1,
  
  }, 
  {
    Position: 4,
    Name: 'Saman Silva',
    ID: 'EMP0001',
    Profession: 'Washer',
    Bay: 1,
  
  }, 
  {
    Position: 5,
    Name: 'Saman Silva',
    ID: 'EMP0001',
    Profession: 'Washer',
    Bay: 1,
  
  }, 
  {
    Position: 6,
    Name: 'Saman Silva',
    ID: 'EMP0001',
    Profession: 'Washer',
    Bay: 1,
  
  }, 
  {
    Position: 7,
    Name: 'Saman Silva',
    ID: 'EMP0001',
    Profession: 'Washer',
    Bay: 1,
  
  }, 
  {
    Position: 8,
    Name: 'Saman Silva',
    ID: 'EMP0001',
    Profession: 'Washer',
    Bay: 1,
  
  }, 
  {
    Position: 9,
    Name: 'Saman Silva',
    ID: 'EMP0001',
    Profession: 'Washer',
    Bay: 1,
  
  }, 
  {
    Position: 10,
    Name: 'Saman Silva',
    ID: 'EMP0001',
    Profession: 'Washer',
    Bay: 1,
  
  }, 
  {
    Position: 11,
    Name: 'Saman Silva',
    ID: 'EMP0001',
    Profession: 'Washer',
    Bay: 1,
  
  }, 

];
