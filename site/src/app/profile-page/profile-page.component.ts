import { Component, OnInit } from '@angular/core'
import { ApiHelperService } from '../api-helper.service'
import { CookieHelperService } from '../cookie-helper.service'
import { BehaviorSubject } from 'rxjs'
import { EventManager } from '@angular/platform-browser'
import { LocationService } from '../location.service'
import { MetricPipe } from '../metric.pipe'

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  providers: [
    ApiHelperService,
    CookieHelperService,
    LocationService
  ]
})
export class ProfilePageComponent implements OnInit {
  userData: any
  message: string

  chosenMechanicVehicle: any
  mechanicVehicles: any
  mechanicOrders: any
  mechanicOrderList: any
  mechanicActiveOrder: any
  vehicles:any
  orders: any

  auth_key: string
  location: any

  isDriver: boolean
  isMechanic: boolean

  isProfile: boolean
  isVehicle: boolean
  isOrders: boolean
  isMechVehicle: boolean
  isAcceptedOrders: boolean
  isOrderList: boolean
  isActiveOrder: boolean
  
  hasActiveOrder: boolean
  hasOrderList: boolean


  setAllToFalse(){
    this.isProfile = false
    this.isVehicle = false
    this.isOrders = false
    this.isMechVehicle = false
    this.isAcceptedOrders = false
    this.isOrderList = false
    this.isActiveOrder = false
  }

  setAcceptedOrdersTrue(){
    this.setAllToFalse()
    this.isAcceptedOrders = true
  }

  setActiveOrderTrue(){
    this.setAllToFalse()
    this.isActiveOrder = true
  }

    
  setDriverTrue(){
    this.isMechanic = false
    this.isDriver = true
  }

  setMechanicTrue(){
    this.isDriver = false
    this.isMechanic = true
  }

  setMechVehicleTrue()
  {
    this.setAllToFalse()
    this.isMechVehicle = true
  }

  getDistance(coords1, coords2){
    console.log('c1: '+coords1)
    console.log('c2: '+coords2)
    console.log(coords2)
    const R = 6371e3; // metres
    const φ1 = coords1.lat * Math.PI/180; // φ, λ in radians
    const φ2 = coords2.lat * Math.PI/180;
    const Δφ = (coords2.lat-coords1.lat) * Math.PI/180;
    const Δλ = (coords2.lng-coords1.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
  }

  setProfileTrue(){
    this.setAllToFalse()
    this.isProfile = true
  }

  setVehicleTrue(){
    this.setAllToFalse()
    this.isVehicle = true
  }

  setOrdersTrue(){
    this.setAllToFalse()
    this.isOrders = true
  }

  setOrderListTrue(){
    this.setAllToFalse()
    this.isOrderList = true
  }

  createDriverVehicle(){
    this._apiHelper.createDriverVehicle(JSON.stringify({
      model: '-',
      numbers: '-'
    }), this.auth_key)
  }

  deleteDriverVehicle(id){
    this._apiHelper.deleteDriverVehicle(id, this.auth_key)
  }

  deleteMechanicVehicle(id){
    
    this._apiHelper.deleteMechanicVehicle(id, this.auth_key)
    
  }

  showMobileSubmenu() {
    
  }

  acceptOrder(id, vehicle_id){
    this._apiHelper.acceptOrder(id, vehicle_id, this.auth_key)
    this.setActiveOrderTrue()
    this._apiHelper.getActiveOrder(this.auth_key).subscribe( data => {
      this.mechanicActiveOrder = data
    })
  }

  prepareCoords(coords: string){
    const splited = coords.split(',')
    return {lat: splited[1], lng: splited[0]}
  }

  createMechanicVehicle(){
    this._apiHelper.createMechanicVehicle(JSON.stringify({
      model: '',
      numbers: ''
    }),this.auth_key)
    
  }

  saveMechanicVehicles(){
    for(let i = 0; i < this.mechanicVehicles.length; i++){
      this._apiHelper.updateMechanicVehicle(this.mechanicVehicles[i].id, JSON.stringify({
        model: this.mechanicVehicles[i].model,
        numbers: this.mechanicVehicles[i].numbers
      }), this.auth_key)
    }
  }

  doneOrder(){
    this._apiHelper.doneOrder(this.auth_key)
    // console.log(123)
    this.hasActiveOrder = false
    this.setOrderListTrue()
  }

  saveProfileChanges(){
    this._apiHelper.updateUser(JSON.stringify(
      {
        firstname: this.userData.firstname,
        lastname: this.userData.lastname,
        email: this.userData.email,
        phone: this.userData.phone
      }
    ), this.auth_key).subscribe(data => console.log('Successfully changed'))
    for(let i = 0; i < this.vehicles.length; i++){
      this._apiHelper.updateDriverVehicle(this.vehicles[i].id, JSON.stringify({
        model: this.vehicles[i].model,
        numbers: this.vehicles[i].numbers
      }), this.auth_key)
    }
  }
  

  constructor(
    private _apiHelper: ApiHelperService,
    private _cookieService: CookieHelperService,
    private _locationService: LocationService
    ) { }

    

  ngOnInit(): void {
    this.chosenMechanicVehicle = []
    this.hasActiveOrder = false
      this.auth_key = this._cookieService.getCookie('auth_key')
     this._apiHelper.getUserByAuthKey(this.auth_key).subscribe(data => 
      { this.userData = data })
    this._apiHelper.getDriverVehicles(this.auth_key).subscribe(data => 
      {
        this.vehicles = data
      })
      this._apiHelper.getOrdersByAkey(this.auth_key).subscribe(data => {
        this.orders = data
      })
      this.setOrdersTrue()
      this.setDriverTrue()
      setTimeout(() => {
        if(this.userData.paid == 1){
          this.location = this._locationService.getPosition()
          this._apiHelper.getMechanicVehicles(this.auth_key).subscribe(data => {
            this.mechanicVehicles = data
          })
          this._apiHelper.getAcceptedOrders(this.auth_key).subscribe(data => {
            this.mechanicOrders = data
          })
          this._apiHelper.getOrderList(this.auth_key).subscribe(data => {
            this.mechanicOrderList = data
          })
          this._apiHelper.getActiveOrder(this.auth_key).subscribe(data => {
            this.mechanicActiveOrder = data
          })
        }
      }, 1000)
      
  }

}
