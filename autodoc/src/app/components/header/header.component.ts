import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  opened = false; 
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(Login);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
  }

}
@Component({
  selector: 'login',
  templateUrl: 'login.html',
  styleUrls: ['login.css']
})
export class Login {}