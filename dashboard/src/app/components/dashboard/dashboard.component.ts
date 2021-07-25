import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Application } from 'src/app/interface/application';
import { ApplicationService } from 'src/app/service/application.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  public application: Application;
  private now: Date = new Date();
  public strDate: string
  public strTime: string

  public weatherIcon: string = '';
  public weatherMessage: string = '...';
  constructor(
    private appService: ApplicationService
  ) {

    this.appService.initApplication().subscribe(application => {
      this.application = application;

      this.application.weather.visualStateChanged.subscribe((msg) => {
        this.weatherIcon = msg.icon;
        this.weatherMessage = msg.message;
      })

    })

    this.application = this.appService.getApplication();

    setInterval(() => {
      this.updateClock();
    }, 30000)



    this.updateClock();
  }

  updateClock(): void {
    this.now = new Date();
    this.strDate = formatDate(this.now, 'dd.MM.yyyy', 'en-US');
    this.strTime = formatDate(this.now, 'HH:mm', 'en-US')
  }

  reload(): void {
    location.reload()
  }

  ngOnInit(): void {
  }

  closeControls(): void {
    // close all controls
    this.appService.maximize('', false)
  }
}
