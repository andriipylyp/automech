import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private messageSource = new BehaviorSubject<boolean>(true)
  currentMessage = this.messageSource.asObservable()

  constructor() { }

  changeLoginState(state){
    this.messageSource.next(state)
  }
}
