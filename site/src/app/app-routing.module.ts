import { NgModule } from '@angular/core'
import { CommonModule, registerLocaleData } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { MatFormFieldModule } from '@angular/material/form-field'; 
import {MatInputModule} from '@angular/material/input'; 
import {MatSelectModule} from '@angular/material/select'; 
import {MatButtonModule} from '@angular/material/button'; 
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list'; 
import {MatButtonToggleModule} from '@angular/material/button-toggle'; 

import { NavigatorComponent } from './navigator/navigator.component'

import { IndexPageComponent } from './index-page/index-page.component'
import { ErrorPageComponent } from './error-page/error-page.component'
import { AboutPageComponent } from './about-page/about-page.component'
import { AuthorizationPageComponent } from './authorization-page/authorization-page.component'
import { FooterComponent } from './footer/footer.component'
import { RegistrationPageComponent } from './registration-page/registration-page.component'
import { ProfilePageComponent } from './profile-page/profile-page.component'
import { CreateOrderPageComponent } from './create-order-page/create-order-page.component'
import { MetricPipe } from './metric.pipe';

const routes: Routes = [
  {path: '', component: IndexPageComponent},
  {path: 'about', component: AboutPageComponent},
  {path: 'authorization', component: AuthorizationPageComponent},
  {path: 'registration', component: RegistrationPageComponent},
  {path: 'profile', component: ProfilePageComponent},
  {path: 'new-order', component: CreateOrderPageComponent},
  {path: '**', component: ErrorPageComponent}
]

@NgModule({
  declarations: [
    IndexPageComponent,
    ErrorPageComponent,
    AboutPageComponent,
    AuthorizationPageComponent,
    NavigatorComponent,
    FooterComponent,
    RegistrationPageComponent,
    ProfilePageComponent,
    CreateOrderPageComponent,
    MetricPipe
  ],
  imports: [
    RouterModule.forRoot(routes),
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    MatDividerModule,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonToggleModule
  ],
  exports: [
    NavigatorComponent
  ]
})
export class AppRoutingModule { }
