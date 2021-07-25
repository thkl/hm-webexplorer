import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Program } from 'src/app/implementation/program';
import { ApplicationService } from 'src/app/service/application.service';
import { NetworkService } from 'src/app/service/network.service';
import { ApplianceComponent } from '../appliance/appliance.component';

@Component({
  selector: 'app-program-component',
  templateUrl: './program.component.html',
  styleUrls: ['./../appliance/appliance.component.sass', './program.component.sass']
})

export class ProgramComponent extends ApplianceComponent {

  public device: Program;

  constructor(
    networkService: NetworkService,
    applicationService: ApplicationService,
    logger: NGXLogger
  ) {
    super(networkService, applicationService, logger)
  }

  ngOnInit(): void {
    super.ngOnInit();
  }


  click(event: any): void {
    super.click(event);
    if (this.device instanceof Program) {
      let d = this.device as Program;
      d.executeProgram(this.item.getDatapoint())
    }
  }

  openControl(event: any): void {
    // there is no control to open
  }

  getItemStateDescription(): string {
    return this.device.getDeviceStateDescription(this.dpn, '')
  }

}
