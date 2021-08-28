import { Component, OnDestroy, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Application } from 'src/app/interface/application';
import { ApplicationService } from 'src/app/service/application.service';
import { Subscription } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public application: Application;
  private now: Date = new Date();
  public strDate: string;
  public strTime: string;

  private subscriptions = new SubSink();
  private clockTimer: number;

  public weatherIcon: string = '';
  public weatherMessage: string = '...';
  constructor(
    private appService: ApplicationService
  ) { }

  updateClock(): void {
    this.now = new Date();
    this.strDate = formatDate(this.now, 'dd.MM.yyyy', 'en-US');
    this.strTime = formatDate(this.now, 'HH:mm', 'en-US')
  }

  reload(): void {
    location.reload()
  }

  ngOnInit(): void {
    this.subscriptions.add(this.appService.initApplication().subscribe(application => {
      this.application = application;
      if (this.application.weather !== undefined) {
        this.subscribeToWeatherChanges();
      }
    }));

    this.application = this.appService.getApplication();

    this.clockTimer = setInterval(() => {
      this.updateClock();
    }, 30000)

    this.updateClock();
  }

  private subscribeToWeatherChanges() {
    this.subscriptions.add(this.application.weather.visualStateChanged.subscribe((msg) => {
      this.weatherIcon = msg.icon;
      this.weatherMessage = msg.message;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    clearInterval(this.clockTimer);
  }

  closeControls(): void {
    // close all controls
    this.appService.maximize('', false)
  }
}
