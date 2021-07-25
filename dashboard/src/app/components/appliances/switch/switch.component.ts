import { Component } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { SwitchDevice } from 'src/app/implementation/device/SwitchDevice';
import { ApplicationService } from 'src/app/service/application.service';
import { NetworkService } from 'src/app/service/network.service';
import { ApplianceComponent } from '../appliance/appliance.component';

@Component({
  selector: 'app-switch-component',
  templateUrl: './switch.component.html',
  styleUrls: ['./../appliance/appliance.component.sass', './switch.component.sass']
})
export class SwitchComponent extends ApplianceComponent {

  public device: SwitchDevice;

  constructor(
    networkService: NetworkService,
    applicationService: ApplicationService,
    logger: NGXLogger
  ) {
    super(networkService, applicationService, logger)
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.dpn = `${this.item.ifname}.${this.item.device}:${this.item.channel}.STATE`;
  }

  setState(newState: any) {

  }

  click(event: any): void {
    super.click(event);
    if (this.device instanceof SwitchDevice) {
      let d = this.device as SwitchDevice;

      if ((d.getOnState(this.dpn) === true)) {
        d.setOn(this.dpn, false);
      } else {
        d.setOn(this.dpn, true);
      }
    }
  }

  openControl(event: any): void {
    // do nothing there are no controls
  }

  getItemStateDescription(): string {
    return this.device.getDeviceStateDescription(this.dpn, '')
  }

}
