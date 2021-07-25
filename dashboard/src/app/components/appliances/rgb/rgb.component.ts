import { Component } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RGBDevice } from 'src/app/implementation/device/RgbDevice';
import { ApplicationService } from 'src/app/service/application.service';
import { NetworkService } from 'src/app/service/network.service';
import { DimmerComponent } from '../dimmer/dimmer.component';

@Component({
  selector: 'app-rgb-component',
  templateUrl: './rgb.component.html',
  styleUrls: ['./../appliance/appliance.component.sass', './rgb.component.sass']
})
export class RgbComponent extends DimmerComponent {

  public colorTable: any[];

  constructor(
    networkService: NetworkService,
    applicationService: ApplicationService,
    logger: NGXLogger
  ) {
    super(networkService, applicationService, logger)

    this.colorTable = [
      { r: 255, g: 255, b: 255 },
      { r: 240, g: 244, b: 195 },
      { r: 255, g: 224, b: 178 },
      { r: 187, g: 222, b: 251 },
      { r: 255, g: 167, b: 38 },
      { r: 77, g: 182, b: 172 }
    ]

  }

  ngOnInit(): void {
    super.ngOnInit();
  }


  datapointHasChanged(dpname: string): void {
    super.datapointHasChanged(dpname);
    if (dpname === this.item.getControlDatapointName('color')) {
      let strRgb = this.device.getRawState(this.item.getControlDatapointName('color'));
      console.log('color %s', strRgb);
    }
  }


  tabClick(event: any): void {
    console.log('Tab')
  }

  setColor(newColor: any): void {
    console.log('Set new color %s', JSON.stringify(newColor));
    let dpn = this.item.getControlDatapointName('color');
    if (dpn) {
      console.log('DP Found %s', dpn)
      if (this.device instanceof RGBDevice) {
        let d = this.device as RGBDevice;
        let cString = `rgb(${newColor.r},${newColor.g},${newColor.b})`
        console.log('Set Color %s to %s', dpn, cString)
        d.setColor(dpn, cString)
      } else {
        console.log(this.device.constructor.name)
      }
    }
  }

  openControl(event: any): void {
    let dp = this.device.getRawState(this.item.getControlDatapointName('color'));
    console.log('Color is %s', dp);
    super.openControl(event)
  }
  /*
    rgbToHex(rgb:string): string {
  
  
  
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
  */

  handleChangeComplete(event: any) {
    if (event.color.rgb) {
      this.setColor(event.color.rgb);
    }
  }

  getColor(newColor: any): string {
    return `rgb(${newColor.r},${newColor.g},${newColor.b})`
  }

  click(event: any): void {
    if ((event.target.attributes.role) && (event.target.attributes.role.nodeValue === 'close')) {
      super.click(event);
    }
  }

}
