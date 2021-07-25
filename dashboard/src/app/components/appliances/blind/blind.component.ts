import { Component, OnInit } from '@angular/core';
import { Blind } from 'src/app/implementation/device/BlindDevice';
import { Item } from 'src/app/interface/item';
import { ApplicationService } from 'src/app/service/application.service';
import { NetworkService } from 'src/app/service/network.service';
import { ApplianceComponent } from '../appliance/appliance.component';
import { NGXLogger } from "ngx-logger";

@Component({
  selector: 'app-blind-component',
  templateUrl: './blind.component.html',
  styleUrls: ['./../appliance/appliance.component.sass', './blind.component.sass']
})
export class BlindComponent extends ApplianceComponent {

  public device: Blind;
  public dpStop: string;

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
    this.dpStop = `${this.item.ifname}.${this.item.device}:${this.item.channel}.STOP`

    this.item.currentRawState = String(parseFloat(this.device.getRawState(this.dpn)) * 100);


    this.item.visualStateChanged.subscribe(newState => {
      if (newState === Item.visualStateNormal) { // Reset the ItemString
        this.item.stateDescription = this.device.getDeviceStateDescription(this.dpn, '')
      }
    })
  }

  setState(newState: any) {
    if (this.device instanceof Blind) {
      let d = this.device as Blind;
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

        if (this.device instanceof Blind) {
          let d = this.device as Blind;

          if (d.isWorking === true) { // Stop it
            d.stop(this.dpStop);
          } else {
            if ((d.getLevel(this.dpn) === 0)) {
              d.setLevel(this.dpn, 100);
            } else {
              d.setLevel(this.dpn, 0);
            }
          }
        }
    }
  }

  formatLabel(value: number) {
    return value + ' %';
  }

  setBlindLevel(event: any) {
    if (this.device instanceof Blind) {
      let d = this.device as Blind;
      d.setLevel(this.dpn, event.value);
    }
  }

  presetSliderLevel(event: any) {
    this.item.stateDescription = this.device.getDeviceStateDescription(this.dpn, '') + this.device.formatNumber(' --> %d %', event.value)
  }

  getItemStateDescription(changedDP: string): string {
    if (changedDP === this.device.isWorkingDp) {
      let wrk = this.device.getRawState(this.device.isWorkingDp)
      if (this.device.isTrue(wrk) === false) {
        this.item.currentRawState = String(parseFloat(this.device.getRawState(this.dpn)) * 100);
      }
    }
    return this.device.getDeviceStateDescription(this.dpn, '')
  }

  openControl(event: any): void {
    super.openControl(event)
  }
}
