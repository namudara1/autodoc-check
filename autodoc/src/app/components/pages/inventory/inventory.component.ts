import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData{
  animal: 'panda' | 'unicorn' | 'lion';
}

export interface PeriodicElement {
  name: string;
  position: number;
  availability: number;
  cost: number;
  price: number;
  id: string;
  category: string;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, id: 'INV0001', name: 'Havoline', availability: 100, category: 'Engine Oil', cost: 100, price: 150},
  {position: 2, id: 'INV0002', name: 'Havoline', availability: 100, category: 'Engine Oil', cost: 100, price: 150},
  {position: 3, id: 'INV0003', name: 'Havoline', availability: 100, category: 'Engine Oil', cost: 100, price: 150},
  {position: 4, id: 'INV0004', name: 'Havoline', availability: 100, category: 'Engine Oil', cost: 100, price: 150},
  {position: 5, id: 'INV0005', name: 'Havoline', availability: 100, category: 'Engine Oil', cost: 100, price: 150},
  {position: 6, id: 'INV0006', name: 'Havoline', availability: 100, category: 'Engine Oil', cost: 100, price: 150},
  {position: 7, id: 'INV0007', name: 'Havoline', availability: 100, category: 'Engine Oil', cost: 100, price: 150},
  {position: 8, id: 'INV0008', name: 'Havoline', availability: 100, category: 'Engine Oil', cost: 100, price: 150},
  {position: 9, id: 'INV0009', name: 'Havoline', availability: 100, category: 'Engine Oil', cost: 100, price: 150},
  {position: 10, id: 'INV0010', name: 'Havoline', availability: 100, category: 'Engine Oil', cost: 100, price: 150},
  {position: 11, id: 'INV0011', name: 'Havoline', availability: 100, category: 'Engine Oil', cost: 100, price: 150},
  {position: 12, id: 'INV0012', name: 'Havoline', availability: 100, category: 'Engine Oil', cost: 100, price: 150},
  {position: 13, id: 'INV0013', name: 'Havoline', availability: 100, category: 'Engine Oil', cost: 100, price: 150},
  
];

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  displayedColumns: string[] = ['position', 'id', 'availability', 'category', 'cost', 'price', 'edit', 'delete'];
  dataSource = ELEMENT_DATA;

  value = '';
  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(AddInventoryComponent, {
      data: {
        animal: 'panda'
      }
    });
  }

  ngOnInit(): void {
  }

}
@Component({
  selector: 'addinventory',
  templateUrl: 'addinventory.html',
})
export class AddInventoryComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}