import { Component, OnInit } from '@angular/core'

import { CookieHelperService } from '../cookie-helper.service'
import { DataService } from '../data.service'

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
  providers: [
    CookieHelperService,
    DataService
  ]
})
export class NavigatorComponent implements OnInit {
  constructor(
    private _cookieService: CookieHelperService,
    private data: DataService
  ) { }
  isLoggedV: boolean
  private MobMenu: any
  private MobMenuCover: any
  ngOnInit(){
    this.data.currentMessage.subscribe(state => this.isLoggedV = state)
    this.isLogged()
    this.MobMenu = document.querySelector('.side-menu')
    this.MobMenuCover = document.querySelector('.cover')
    this.MobMenu.style.left = '-250px'
    this.MobMenuCover.style.visibility = 'hidden'
    this.MobMenuCover.style.opacity = '0'
  }
  
  ShowSideMenu(){
    if(this.MobMenu.style.left === '-250px'){
      this.MobMenu.style.left = '0'
      this.MobMenuCover.style.visibility = 'visible'
      this.MobMenuCover.style.opacity = '0.5'
    }
    else{
      this.MobMenu.style.left = '-250px'
      this.MobMenuCover.style.visibility = 'hidden'
      this.MobMenuCover.style.opacity = '0'
    }
  }
  deleleCookies(){
    this._cookieService.eraseCookie('auth_key')
    this.data.changeLoginState(false)
  }
  isLogged(){
    if(this._cookieService.getCookie('auth_key')){
      this.data.changeLoginState(true)
      
    }
    else{
      this.data.changeLoginState(false)
    }
  }

  mobileFunc(){
    this.ShowSideMenu()
    this.deleleCookies()
  }
  

}
