import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RotaryDevice } from 'src/app/implementation/device/RotaryDevice';
import { ApplicationService } from 'src/app/service/application.service';
import { NetworkService } from 'src/app/service/network.service';
import { ApplianceComponent } from '../appliance/appliance.component';

@Component({
  selector: 'app-rotary-component',
  templateUrl: './rotary.component.html',
  styleUrls: ['./../appliance/appliance.component.sass', './rotary.component.sass']
})
export class RotaryComponent extends ApplianceComponent {

  public device: RotaryDevice;

  constructor(
    networkService: NetworkService,
    applicationService: ApplicationService,
    logger: NGXLogger
  ) {
    super(networkService, applicationService, logger)
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.dpn = this.item.getDatapoint();
  }

  setState(newState: any) {

  }

  click(event: any): void {

  }

  openControl(event: any): void {
    // do nothing there are no controls
  }

  getItemStateDescription(): string {
    return this.device.getDeviceStateDescription(this.dpn, this.item.template)
  }

}
