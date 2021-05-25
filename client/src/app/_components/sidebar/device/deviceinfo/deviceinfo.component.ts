import { Component, Input, OnInit } from '@angular/core';
import { CCUDevice } from 'src/app/_interface/ccu/device';
import { CCUConstants } from 'src/app/_provider/constants';
import { DataService } from 'src/app/_service/data.service';

@Component({
  selector: 'app-deviceinfo',
  templateUrl: './deviceinfo.component.html',
  styleUrls: ['./deviceinfo.component.sass']
})
export class SideBarDeviceinfoComponent implements OnInit {

  @Input() data: any;
  public device: CCUDevice;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.device = this.dataService.deviceProvider.deviceWithId(this.data.id);
    if (this.dataService.deviceProvider.hasEmptyStates(this.device) === true) {
      this.dataService.deviceProvider.fetchDeviceStates(this.device).then(() => {

      })
    }
  }

  strValueType(valuetype: number): string {
    return CCUConstants.strValueType(valuetype);
  }

  strValueSubType(valuesubtype: number): string {
    return CCUConstants.strValueSubType(valuesubtype);
  }

  strOperations(op: number): string {
    return CCUConstants.strOperations(op);
  }

  strDirection(dir: string): string {
    return CCUConstants.strDirection(parseInt(dir, 10));
  }

  strAES(aes: boolean): string {
    return CCUConstants.strAES(aes);
  }
}
