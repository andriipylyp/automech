import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class ApiHelperService {
  private apiUrl = 'http://localhost:3000'
  private Akey = 'QNHMwSXwmnznTy7U5zFM9LamqkHn7HCncezPyVzAmECrJGgD3nbyhQ6JvA5CwPDP24EbEjk3q6HX8g8qtNYupBwwp88FX8XXKwe5'
  constructor(private http: HttpClient) { }
  userData: BehaviorSubject<any> = new BehaviorSubject<any>({})
  vehicleData: BehaviorSubject<any> = new BehaviorSubject<any>({})
  ordersData: BehaviorSubject<any> = new BehaviorSubject<any>({})
  mechanicVehicleData: BehaviorSubject<any> = new BehaviorSubject<any>({})
  accetedOrdersData: BehaviorSubject<any> = new BehaviorSubject<any>({})
  mechanicOrderListData: BehaviorSubject<any> = new BehaviorSubject<any>({})
  mechanicActiveOrder: BehaviorSubject<any> = new BehaviorSubject<any>({})
  
  public getAllUsers(){
     return this.http.get(this.apiUrl+'/api/user/all', {headers: {Akey: this.Akey}})
  }
  public getUserByAuthKey(akey:string){
      this.http.get(this.apiUrl+'/api/user/', {headers: {Akey: akey}}).subscribe(data => {this.userData.next(data)})
      return this.userData.asObservable()
  }
  public createUser(user:string){
    return this.http.post<any>(this.apiUrl+'/api/user', user, {headers: {'Content-Type': 'application/json', Akey: this.Akey}})
  }
  public deleteUser(id:string, akey:string){
    return this.http.delete<any>(this.apiUrl+'/api/user/'+id, {headers: {Akey: akey}})
  }
  public updateUser(user:string, akey:string){
    this.http.put<any>(this.apiUrl+'/api/user/', user, {headers: {'Content-Type': 'application/json', Akey: akey}}).subscribe()
    return this.userData.asObservable()
  }
  public getAllOrders(akey:string){
    return this.http.get(this.apiUrl+'/api/order/all', {headers: {Akey: akey}})
  }
  public getOrderById(id:number, akey:string){
    return this.http.get(this.apiUrl+'/api/order/'+id, {headers: {Akey: akey}})
  }

  public getOrdersByAkey(akey){
    this.http.get(this.apiUrl+'/api/orders', {headers: {Akey: akey}}).subscribe(data => {this.ordersData.next(data)})
    return this.ordersData.asObservable()
  }

  public updateOrder(order:string, id:number, akey:string){
    return this.http.put<any>(this.apiUrl+'/api/order/'+id, order, {headers: {'Content-Type': 'application/json', Akey: akey}})
  }
  public deleteOrder(id:number, akey:string){
    return this.http.delete<any>(this.apiUrl+'/api/order/'+id, {headers: {Akey: akey}})
  }
  public createOrder(order:string, akey:string){
   this.http.post<any>(this.apiUrl+'/api/order', order, {headers: {'Content-Type': 'application/json', Akey: akey}}).subscribe()
  }
  public loginUser(auth_data){
    return this.http.post<any>(this.apiUrl+'/api/authentification', auth_data, {headers: {'Content-Type': 'application/json'}})
  }
  public getDriverVehicles(akey: string){
    this.http.get(this.apiUrl+'/api/vehicle/driver', {headers: {Akey: akey}}).subscribe(data => {this.vehicleData.next(data)})
    return this.vehicleData.asObservable()
  }
  public createDriverVehicle(vehicle, akey){
    this.http.post<any>(this.apiUrl+'/api/vehicle/driver', vehicle, {headers: {'Content-Type': 'application/json', Akey: akey }}).subscribe(() => {
      this.getDriverVehicles(akey)
    })
    
  }
  public updateDriverVehicle(id, vehicle, akey){
     this.http.put<any>(this.apiUrl+'/api/vehicle/driver/'+id, vehicle, {headers: {'Content-Type': 'application/json', Akey: akey}}).subscribe(() => {
      this.getDriverVehicles(akey)
     })
  }

  public deleteDriverVehicle(id, akey){
    this.http.delete<any>(this.apiUrl+'/api/vehicle/driver/'+id, {headers: {Akey: akey}}).subscribe(() => {
      this.getDriverVehicles(akey)
    })
    
  }
  public getMechanicVehicles(akey){
    this.http.get(this.apiUrl+'/api/vehicle/mechanic', {headers: {Akey: akey}}).subscribe(data => {
      this.mechanicVehicleData.next(data)
    })
    return this.mechanicVehicleData.asObservable()
  }
  public createMechanicVehicle(vehicle, akey){
    this.http.post<any>(this.apiUrl+'/api/vehicle/mechanic', vehicle, {headers: {'Content-Type': 'application/json', Akey: akey }}).subscribe(() => {
      this.getMechanicVehicles(akey)
    })
    
  }
  public updateMechanicVehicle(id, vehicle, akey){
    this.http.put<any>(this.apiUrl+'/api/vehicle/mechanic/'+id, vehicle, {headers: {'Content-Type': 'application/json', Akey: akey}}).subscribe(() => {
      this.getMechanicVehicles(akey)
    })
    
  }
  public deleteMechanicVehicle(id, akey){
    this.http.delete<any>(this.apiUrl+'/api/vehicle/mechanic/'+id, {headers: {Akey: akey}}).subscribe(() => {
      this.getMechanicVehicles(akey)
    })
    
  }
  public getAcceptedOrders(akey){
    this.http.get(this.apiUrl+'/api/orders/accepted/history', {headers: {Akey: akey}}).subscribe(data => {
      if(data[0])
      {
        this.accetedOrdersData.next(data)
      }
      else{
        this.accetedOrdersData.next([{message: 'No orders found'}])
      }
    })
    return this.accetedOrdersData.asObservable()
  }
  public getOrderList(akey){
    this.http.get(this.apiUrl+'/api/orders/non-accepted', {headers: {Akey: akey}}).subscribe(data => {
      if(data[0])
      {
        this.mechanicOrderListData.next(data)
      }
      else{
        this.mechanicOrderListData.next([{message: 'No orders found'}])
      }
    })
    return this.mechanicOrderListData.asObservable()
  }

  public acceptOrder(id, vehicle_id, akey){
    this.http.get(this.apiUrl+'/api/order/accept/'+id+'/'+vehicle_id, {headers: {Akey: akey}}).subscribe(() => {
      this.getAcceptedOrders(akey)
      this.getOrderList(akey)
      this.getActiveOrder(akey)
    })
    
  }

  public getActiveOrder(akey){
    this.http.get(this.apiUrl+'/api/orders/accepted', {headers: {Akey: akey}}).subscribe( data => {
      if(data)
      {
        this.mechanicActiveOrder.next(data)
      }
      else{
        this.mechanicActiveOrder.next({message: 'No orders found'})
      }
    })
    return this.mechanicActiveOrder.asObservable()
  }

  public doneOrder(akey){
    this.http.get(this.apiUrl+'/api/order/done', {headers: {Akey: akey}}).subscribe(() => {
      this.getActiveOrder(akey)
      this.getAcceptedOrders(akey)
    })
    
  }
}
