import { Component, OnInit } from '@angular/core';
import { Application } from 'src/app/interface/application';
import { ApplicationService } from 'src/app/service/application.service';
import { NetworkService } from 'src/app/service/network.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  public application: Application;
  private updateInterval: number;
  constructor(
    private applicationService: ApplicationService,
    private networkService: NetworkService
  ) { }

  ngOnInit(): void {
    this.applicationService.initApplication().subscribe(application => {
      this.application = application;
    })
  }



}
