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

    const cookieExists: boolean = this.cookieService.check('hmw-connectionList');
    if (cookieExists === true) {
      this.connectionList = JSON.parse(this.cookieService.get('hmw-connectionList'));
    } else {
      this.connectionList = [];
      this.connectionList.push('http://localhost');
      this.cookieService.set('hmw-connectionList', JSON.stringify(this.connectionList));
    }

  }

  addNewSystem(): void {
    console.log(this.newSystem)
    if (this.newSystem) {
      this.connectionList.push(this.newSystem);
      this.selectedSystem = this.newSystem;
      this.cookieService.set('hmw-connectionList', JSON.stringify(this.connectionList));
    }
  }

  doConnect() {
    this.cookieService.set('hmw-currentConnection', this.selectedSystem);
    this.dataService.setupCurrentConnection();
  }
}
