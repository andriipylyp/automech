import { Component } from '@angular/core'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent {
  public title = 123
  constructor() {
    // apiHelper.createUser(JSON.stringify({
    //   firstname: 'newuser',
    //   lastname: 'newuserlast',
    //   email: 'test@test.test',
    //   password: 'asdasd',
    //   phone: '+232332'
    // })).subscribe(data => this.getDataFromObs(data))
    // apiHelper.updateOrder(JSON.stringify({
    //   location: 'newLoc',
    //   description: 'newDesc',
    //   vehicle: 'newVeh',
    //   vehicle_number: 'newVehNum'
    // }),1, 'QNHMwSXwmnznTy7U5zFM9LamqkHn7HCncezPyVzAmECrJGgD3nbyhQ6JvA5CwPDP24EbEjk3q6HX8g8qtNYupBwwp88FX8XXKwe5').subscribe(data => console.log(data))
    // const req = apiHelper.getAllOrders('OMuM0XS6Z4YET5YmahBSTjJN1py29UeyZyJh8kaG5TdFWwvV18OJ3kJlgshpSZZtwACrRBJcDYN8JNuA0Chxp2').subscribe( data => this.getDataFromObs(data))
    // req.unsubscribe()
  }
   

}
