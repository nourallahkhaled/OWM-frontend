import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ConsumptionComponent } from './components/consumption/consumption.component';
import { LandingComponent } from './components/landing/landing.component';
import { HomeComponent } from './components/home/home.component';
import { LeakageComponent } from './components/leakage/leakage.component';
import { BillsComponent } from './components/bills/bills.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UsersTableComponent } from './components/admin-view/users-table/users-table.component';
import { EditUserFormComponent } from './components/admin-view/Forms/edit-user-form/edit-user-form.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';

const routes: Routes = [
  {path:'landing', component: LandingComponent},
  {path:'', redirectTo:'landing', pathMatch:'full'},
  // {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path:'about', component: AboutUsComponent},
  {path:'consumption', component: ConsumptionComponent},
  {path:'home', component: HomeComponent},
  {path:'bills', component: BillsComponent},
  {path:'leakage', component: LeakageComponent},
  {path:'profile', component: ProfileComponent},
  {path:'users', component: UsersTableComponent },
  {path:'users/edit/:id', component: EditUserFormComponent },
  {path:'admins/add', component: EditUserFormComponent },
  {path:'contact-us', component: ContactComponent },
  {path:'terms-conditions', component: TermsConditionsComponent },
  {path:'privacy-policy', component: PrivacyPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
