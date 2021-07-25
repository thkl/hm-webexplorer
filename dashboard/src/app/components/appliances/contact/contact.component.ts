import { Component, Input, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ContactDevice } from 'src/app/implementation/device/ContactDevice';
import { ApplicationService } from 'src/app/service/application.service';
import { NetworkService } from 'src/app/service/network.service';
import { ApplianceComponent } from '../appliance/appliance.component';



@Component({
  selector: 'app-contact-component',
  templateUrl: './contact.component.html',
  styleUrls: ['./../appliance/appliance.component.sass', './contact.component.sass']
})
export class ContactComponent extends ApplianceComponent {

  public device: ContactDevice;

  constructor(
    networkService: NetworkService,
    applicationService: ApplicationService,
    logger: NGXLogger
  ) {
    super(networkService, applicationService, logger)
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.dpn = this.item.getControlDatapointName('state');
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
