import { Component, Input, OnInit } from '@angular/core';
import { GenericDevice } from 'src/app/implementation/Generic';
import { Item } from 'src/app/interface/item';
import { ApplicationService } from 'src/app/service/application.service';

@Component({
  selector: 'app-headeritem',
  templateUrl: './headeritem.component.html',
  styleUrls: ['./headeritem.component.sass']
})
export class HeaderitemComponent implements OnInit {

  @Input() item: Item;

  public device: GenericDevice;


  constructor(
    private applicationService: ApplicationService
  ) {

  }

  ngOnInit(): void {
    let dId = this.item.getDevice();
    this.device = this.applicationService.deviceWithAddress(dId);
    if (this.device) {
      this.device.changed.subscribe((dpC) => {
        const dp = this.item.getDatapoint()
        if (dp) {
          this.item.stateDescription = this.device.getDeviceStateDescription(dp, this.item.template)
        } else {
          this.item.stateDescription = 'n/a'
        }
      })
      this.device.updateStates();
    } else {
      console.log('Device with id %s not found', dId)
    }
    console.log(this.device)
  }

}
