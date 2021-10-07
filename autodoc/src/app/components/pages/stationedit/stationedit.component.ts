import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface DialogData{
  animal: 'panda' | 'unicorn' | 'lion';
}


@Component({
  selector: 'app-stationedit',
  templateUrl: './stationedit.component.html',
  styleUrls: ['./stationedit.component.css']
})
export class StationeditComponent implements OnInit {
  email = new FormControl('abc_station@gmail.com', [Validators.required, Validators.email]);
  telephone = new FormControl('(011) 234-1234', [Validators.required])
  fname = new FormControl('Nuwin', [Validators.required]);
  lname = new FormControl('Kalpadeepa', [Validators.required])
  addline1 = new FormControl('No.12/7 A', [Validators.required]);
  addline2 = new FormControl('High Level Road', [Validators.required])
  district = new FormControl('Colombo', [Validators.required])
  

  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(Changepassword, {
      data: {
        animal: 'panda'
      }
    });
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }


  ngOnInit(): void {
  }

}
@Component({
  selector: 'changepassword',
  templateUrl: 'changepassword.html',
})
export class Changepassword implements OnInit {

  oldPassword = new FormControl('', [Validators.required])
  newPassword = new FormControl('', [Validators.required])
  reNewPassword = new FormControl('', [Validators.required])

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  getErrorMessage() {
    if (this.newPassword.hasError('required')) {
      return 'You must enter a Password';
    }

    return this.newPassword.hasError('email') ? 'Not a valid Password' : '';
  }


  ngOnInit(): void {
  }

}