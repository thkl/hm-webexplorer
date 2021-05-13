import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { NetworkService } from 'src/app/_service/network.service';

@Component({
  selector: 'app-devicesettings',
  templateUrl: './devicesettings.component.html',
  styleUrls: ['./devicesettings.component.sass']
})
export class SideBarDevicesettingsComponent implements OnInit {

  constructor(
    private networkService: NetworkService
  ) {

  }

  @Input() data: any;

  setDirty(): void {
    // set a flag that the user changed something in the settings
    this.data.paramsetIsDirty = true;
  }



  ngOnInit(): void {
    if (this.data.paramsets === undefined) {
      // first fetch the MASTER Paramsets
      this.data.paramsets = {};
      const pskey = 'paramset';
      const ctkey = 'controls';
      this.networkService.getJsonData(`${pskey}/${this.data.serial}`).then(pset => {
        this.data.paramsets[0] = pset[pskey];
      });
      this.data.channels.forEach(channel => {
        this.networkService.getJsonData(`${pskey}/${this.data.serial}/${channel.channelIndex}`).then(pset => {
          const ctrl = pset[ctkey];
          const cpset = pset[pskey];
          Object.keys(cpset).forEach(parameter => {
            const ctrlElement = ctrl[parameter];
            if (ctrlElement) {
              const ctrlElementKey = 'control_element';
              cpset[parameter][ctrlElementKey] = ctrlElement;
            }
          });
          this.data.paramsets[channel.channelIndex] = cpset;
        });
      });
    }
  }

}
