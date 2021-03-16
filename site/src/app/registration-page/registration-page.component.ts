import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { ApiHelperService } from '../api-helper.service'
import { CookieHelperService } from '../cookie-helper.service'
import { DataService } from '../data.service'

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss'],
  providers: [
    ApiHelperService,
    CookieHelperService
  ]
})
export class RegistrationPageComponent implements OnInit {
  isDisabled: boolean
  constructor(
    private api_helper: ApiHelperService, 
    private router: Router,
    private _cookieService: CookieHelperService,
    private data: DataService
  ) { }

  ngOnInit(): void {
    this.isDisabled = true
    if(this._cookieService.getCookie('auth_key')){
      this.router.navigate(['profile'])
    }
  }
  checkIfEqual(){
    if(this.passwordField && this.repeatField && this.passwordField === this.repeatField){
      if(this.message !== ''){
        this.message = ''
    }
      return true
    }
    else if(this.passwordField && this.repeatField){
      this.message = 'Пароль та повторний пароль не збігаються'
    }
    else
    {
      if(this.message !== ''){
          this.message = ''
      }
      return false
    }
  }
  firstnameField: string
  lastnameField: string
  emailField: string
  passwordField: string
  repeatField: string
  phoneField: string
  message: string
  checkIfAllFilled(){
    // console.log({
    //   a: this.firstnameField, 
    //   b: this.lastnameField, 
    //   c: this.emailField,
    //   d: this.passwordField,
    //   g: this.repeatField,
    //   e: this.phoneField
    // })
    if(this.firstnameField 
      && this.lastnameField 
      && this.emailField
      && this.passwordField
      && this.repeatField
      && this.phoneField
      && this.checkIfEqual()
      )
      {
        this.isDisabled = false
      }
      else{
        this.isDisabled = true
      }
  }

  onSubmit(event: any){
    this.api_helper.createUser(JSON.stringify({
      firstname: event.target.firstname.value,
      lastname: event.target.lastname.value,
      email: event.target.email.value,
      password: event.target.password.value,
      phone: event.target.phone.value
    })).subscribe(data => {
      if(data.auth_key){
        this.message = 'Вас зареєстровано'
        this._cookieService.setCookie('auth_key', data.auth_key, 7)
        this.data.changeLoginState(true)
        this.router.navigate(['profile'])
      }
    },
    error => {
      if(error){
        this.message = 'Упс, щось трапилось зле'
      }
    })
  }

}
