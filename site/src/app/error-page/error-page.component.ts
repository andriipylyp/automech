import { Component, OnInit } from '@angular/core';
import { ApiHelperService } from '../api-helper.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  constructor() { }
  
  ngOnInit(): void {
  }

}
