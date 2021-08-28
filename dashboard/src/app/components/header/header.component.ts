import { Component, OnDestroy, OnInit } from '@angular/core';
import { Application } from 'src/app/interface/application';
import { ApplicationService } from 'src/app/service/application.service';
import { NetworkService } from 'src/app/service/network.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public application: Application;
  private updateInterval: number;
  private subscriptions = new SubSink();

  constructor(
    private applicationService: ApplicationService,
    private networkService: NetworkService
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(this.applicationService.initApplication().subscribe(application => {
      this.application = application;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


}
