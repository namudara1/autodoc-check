import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: string;
  symbol: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Body Wash', weight: 'cleaning', symbol: 500},
  {position: 2, name: 'Body Wash', weight: 'cleaning', symbol: 500},
  {position: 3, name: 'Body Wash', weight: 'cleaning', symbol: 500},
  {position: 4, name: 'Body Wash', weight:'cleaning', symbol: 500},
  {position: 5, name: 'Body Wash', weight: 'cleaning', symbol: 500},
  {position: 6, name: 'Body Wash', weight: 'cleaning', symbol: 500},
  {position: 7, name: 'Body Wash', weight:'cleaning', symbol: 500},
  {position: 8, name: 'Body Wash', weight: 'cleaning', symbol: 500},
  {position: 9, name: 'Body Wash', weight: 'cleaning', symbol: 500},
  {position: 10, name: 'Body Wash', weight: 'cleaning', symbol: 500},
];

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
  displayedColumns: string[] = ['demo-position', 'demo-name', 'demo-weight', 'demo-symbol','demo-cancel'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
