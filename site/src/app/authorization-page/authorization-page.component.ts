import { Component, OnInit } from '@angular/core'
import { ApiHelperService } from '../api-helper.service'
import { Router } from '@angular/router'
import { CookieHelperService } from '../cookie-helper.service'
import { DataService } from '../data.service'

@Component({
  selector: 'app-authorization-page',
  templateUrl: './authorization-page.component.html',
  styleUrls: ['./authorization-page.component.scss'],
  providers: [
    ApiHelperService,
    CookieHelperService
  ]
})
export class AuthorizationPageComponent implements OnInit {
  isDisabled: boolean
  isLoggedV: boolean
  message: string
  emailField: string
  passwordField: string
  constructor(
    private api_helper: ApiHelperService,
    private router: Router,
    private _cookieService: CookieHelperService,
    private dataV: DataService
    ) { }
  checkIfAllFilled(){
    if(this.emailField && this.passwordField)
      {
        this.isDisabled = false
      }
      else{
        this.isDisabled = true
      }
  }
  onSubmit(event: any){
    event.preventDefault()
    console.log('submited')
    this.api_helper.loginUser(
        JSON.stringify({
          email: event.target.email.value, password: event.target.password.value
        })
      ).subscribe(
        data => {
          if(data.auth_key){
            this.message = 'Авторізація успішна'
            this._cookieService.setCookie('auth_key', data.auth_key, 7)
            this.dataV.changeLoginState(true)
            this.router.navigate(['profile'])
          }
        },
        error => {
          if(error){
            this.message = 'Неправильний логін або пароль'
          }
        }
        )
  }
  ngOnInit(): void {
    this.isDisabled = true
    if(this._cookieService.getCookie('auth_key')){
      this.router.navigate(['profile'])
    }
  }

}
