import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Key } from 'src/app/implementation/device/KeyDevice';
import { ApplicationService } from 'src/app/service/application.service';
import { NetworkService } from 'src/app/service/network.service';
import { ApplianceComponent } from '../appliance/appliance.component';

@Component({
  selector: 'app-key-component',
  templateUrl: './key.component.html',
  styleUrls: ['./../appliance/appliance.component.sass', './key.component.sass']
})
export class KeyComponent extends ApplianceComponent {

  public device: Key;

  constructor(
    networkService: NetworkService,
    applicationService: ApplicationService,
    logger: NGXLogger
  ) {
    super(networkService, applicationService, logger)
  }

  ngOnInit(): void {
    super.ngOnInit();
    const dp = this.item.getDatapoint();
    this.device.addDatapoint(dp, dp);
  }


  click(event: any): void {
    super.click(event);
    console.log('cl')
    if (this.device instanceof Key) {
      console.log('ick')
      let d = this.device as Key;
      d.pressKey(this.item.getDatapoint())
    }
  }

  openControl(event: any): void {
    // there is no control to open
  }

  getItemStateDescription(): string {
    return this.device.getDeviceStateDescription(this.dpn, '')
  }

}
