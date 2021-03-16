import { Component, OnInit } from '@angular/core';
import { LocationService } from '../location.service'
import { FormGroup, FormBuilder } from '@angular/forms';
import { CookieHelperService } from '../cookie-helper.service';
import { ApiHelperService } from '../api-helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-order-page',
  templateUrl: './create-order-page.component.html',
  styleUrls: ['./create-order-page.component.scss'],
  providers: [ApiHelperService, CookieHelperService]
})
export class CreateOrderPageComponent implements OnInit {

  auth_key: string
  vehicles: any

  form: FormGroup

  location: any

  constructor(
    private locationService: LocationService,
    private fb: FormBuilder,
    private _cookieService: CookieHelperService,
    private _apiHelper: ApiHelperService,
    private _router: Router
    ) { }

  createOrder(){
    if(this.form.value.vehicleSelect != -1){
      const vehicle = this.vehicles.find(obj => obj.id == this.form.value.vehicleSelect)
      this._apiHelper.createOrder(JSON.stringify({
        location: this.location.longtitude+','+this.location.latitude,
        vehicle: vehicle.model,
        vehicle_number: vehicle.numbers,
        description: this.form.value.description
      }), this.auth_key)
    }
    else{
      this._apiHelper.createOrder(JSON.stringify({
        location: this.location.longtitude+','+this.location.latitude,
        vehicle: this.form.value.vehicleModel,
        vehicle_number: this.form.value.vehicleNumbers,
        description: this.form.value.description
      }), this.auth_key)
    }
    this._router.navigate(['profile'])
  }

  ngOnInit(): void {
    this.auth_key = this._cookieService.getCookie('auth_key')
    this._apiHelper.getDriverVehicles(this.auth_key).subscribe(data => {
      this.vehicles = data
    })
    this.locationService.getPosition().then(pos => {
      this.location = {
        longtitude: pos.lng,
        latitude: pos.lat
      }
    })
    this.form = this.fb.group({
      description: '',
      vehicleSelect: [''],
      vehicleModel: '',
      vehicleNumbers: ''
    })
  }

}
