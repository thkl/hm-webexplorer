import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from 'src/app/_service/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  public connectionList: string[];
  public newSystem: string;
  public selectedSystem: string;
  constructor(
    private cookieService: CookieService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {



  }


}
