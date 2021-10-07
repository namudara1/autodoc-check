import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './components/pages/booking/booking.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { EditownerComponent } from './components/pages/editowner/editowner.component';
import { StationeditComponent } from './components/pages/stationedit/stationedit.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SchedulebookComponent } from './components/pages/schedulebook/schedulebook.component';
import { StationprofileComponent } from './components/pages/stationprofile/stationprofile.component';
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
import { Login } from './components/header/header.component';
import { NotificationsComponent } from './components/pages/notifications/notifications.component';

// import { Home } from './pages/home';

const routes: Routes = [
  { path: 'booking', component: BookingComponent },
  { path: '', component: HomeComponent },
  { path: 'stationedit', component: StationeditComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'editowner/:owner_id', component: EditownerComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'schedulebook', component: SchedulebookComponent},
  { path: 'stationprofile', component: StationprofileComponent},
  { path: 'changepassword', component: Changepassword},
  { path: 'changepassowner', component: Changepassowner },
  { path: 'services', component: ServicesComponent},
  { path: 'about', component: AboutComponent},
  { path: 'employeedetails', component: EmployeedetailsComponent},
  { path: 'inventory', component: InventoryComponent},
  { path: 'addinventory', component: AddInventoryComponent},
  { path: 'addcarbooking', component: AddCarBookingComponent},
  { path: 'addvehicleedit', component: AddVehicleEditComponent},
  { path: 'billing', component: BillingComponent},
  { path: 'adminpanel', component: AdminpanelComponent},
  { path: 'adminpanel', component: Servicerequestview},
  { path: 'profile', component: Ratingpopup},
  { path: 'schedulebook', component: TimeslotComponent},
  { path: 'login', component: Login},
  { path: 'notifications', component: NotificationsComponent},



]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[]
})
export class AppRoutingModule { }
