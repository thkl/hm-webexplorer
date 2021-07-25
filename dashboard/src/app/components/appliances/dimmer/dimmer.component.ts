import { Component, Input, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { DimmerDevice } from 'src/app/implementation/device/DimmerDevice';
import { Item } from 'src/app/interface/item';
import { ApplicationService } from 'src/app/service/application.service';
import { NetworkService } from 'src/app/service/network.service';
import { ApplianceComponent } from '../appliance/appliance.component';

@Component({
  selector: 'app-dimmer-component',
  templateUrl: './dimmer.component.html',
  styleUrls: ['./../appliance/appliance.component.sass', './dimmer.component.sass']
})
export class DimmerComponent extends ApplianceComponent {

  public device: DimmerDevice;

  constructor(
    networkService: NetworkService,
    applicationService: ApplicationService,
    logger: NGXLogger
  ) {
    super(networkService, applicationService, logger)
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.dpn = `${this.item.ifname}.${this.item.device}:${this.item.channel}.LEVEL`

    this.device.isWorkingDp = `${this.item.ifname}.${this.item.device}:${this.item.channel}.WORKING`

    this.item.currentRawState = String(parseFloat(this.device.getRawState(this.dpn)) * 100);


    this.item.visualStateChanged.subscribe(newState => {
      if (newState === Item.visualStateNormal) { // Reset the ItemString
        this.item.stateDescription = this.device.getDeviceStateDescription(this.dpn, '')
      }
    })
  }

  setState(newState: any) {
    console.log('set new dimmer value %s', newState);
    if (this.device instanceof DimmerDevice) {
      let d = this.device as DimmerDevice;
      d.setLevel(this.dpn,
        parseFloat(newState)
      )
    }
  }
  datapointHasChanged(dpname: string): void {
    if ((dpname === this.dpn) && (this.device.isWorking === false)) {
      this.item.currentRawState = String(parseFloat(this.device.getRawState(this.dpn)) * 100);
    }
  }


  click(event: any): void {

    switch (this.visualStateID()) {
      case Item.visualStateMaximized:
        super.click(event)
        break
      case Item.visualStateNormal:

        if (this.device instanceof DimmerDevice) {
          let d = this.device as DimmerDevice;


          if ((d.getLevel(this.dpn) === 0)) {
            d.setLevel(this.dpn, 100);
          } else {
            d.setLevel(this.dpn, 0);
          }
        }
    }
  }


  formatLabel(value: number) {
    return value + ' %';
  }

  setDimmerLevel(event: any) {
    if (this.device instanceof DimmerDevice) {
      let d = this.device as DimmerDevice;
      d.setLevel(this.dpn, event.value);
    }
  }

  presetSliderLevel(event: any) {
    this.item.stateDescription = this.device.getDeviceStateDescription(this.dpn, '') + this.device.formatNumber(' --> %d %', parseInt(event.value))
  }


  getItemStateDescription(): string {
    return this.device.getDeviceStateDescription(this.dpn, '')
  }

  openControl(event: any): void {
    super.openControl(event)
  }

}
