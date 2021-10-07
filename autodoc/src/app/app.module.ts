import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';

import { MaterialModule } from './material.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';  
import { FlexLayoutModule } from '@angular/flex-layout';
import { BookingComponent } from './components/pages/booking/booking.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/pages/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StationeditComponent } from './components/pages/stationedit/stationedit.component';
import { SchedulebookComponent } from './components/pages/schedulebook/schedulebook.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { EditownerComponent } from './components/pages/editowner/editowner.component';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StationprofileComponent } from './components/pages/stationprofile/stationprofile.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { Changepassword } from './components/pages/stationedit/stationedit.component';
import { Changepassowner } from './components/pages/editowner/editowner.component';
import { ServicesComponent } from './components/pages/services/services.component';
import { AboutComponent } from './components/pages/about/about.component';
import { EmployeedetailsComponent } from './components/pages/employeedetails/employeedetails.component';
import { InventoryComponent } from './components/pages/inventory/inventory.component';
import { AddInventoryComponent } from './components/pages/inventory/inventory.component';
import { AddCarBookingComponent } from './components/pages/booking/booking.component';
import { AddVehicleEditComponent } from './components/pages/editowner/editowner.component';
import { BillingComponent } from './components/pages/billing/billing.component';
import { AdminpanelComponent } from './components/pages/adminpanel/adminpanel.component';
import { Servicerequestview } from './components/pages/adminpanel/adminpanel.component';
import { Ratingpopup } from './components/pages/profile/profile.component';
import { TimeslotComponent } from './components/pages/schedulebook/schedulebook.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ChartsModule } from 'ng2-charts';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Login } from './components/header/header.component';
import { NotificationsComponent } from './components/pages/notifications/notifications.component';
import { MatCheckboxModule } from '@angular/material/checkbox';






@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BookingComponent,
    FooterComponent,
    HomeComponent,
    DashboardComponent,
    StationeditComponent,
    SchedulebookComponent,
    ProfileComponent,
    EditownerComponent,
    StationprofileComponent,
    Changepassword,
    Changepassowner,
    ServicesComponent,
    AboutComponent,
    EmployeedetailsComponent,
    InventoryComponent,
    AddInventoryComponent,
    AddCarBookingComponent,
    AddVehicleEditComponent,
    BillingComponent,
    AdminpanelComponent,
    Servicerequestview,
    Ratingpopup,
    TimeslotComponent,
    Login,
    NotificationsComponent,
    
   
    
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    MatExpansionModule,
    MatMenuModule,
    MatTabsModule,
    NgxMaskModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTooltipModule,
    MatStepperModule,
    MatCardModule,
    Ng2SearchPipeModule,
    MatDatepickerModule,
     HttpClientModule,
     ChartsModule,
     MatDialogModule,
     MatCheckboxModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
