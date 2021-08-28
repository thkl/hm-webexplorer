import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Item } from 'src/app/interface/item';
import { ApplicationService } from 'src/app/service/application.service';
import { NetworkService } from 'src/app/service/network.service';
import { NGXLogger } from "ngx-logger";
import { GenericDevice } from 'src/app/implementation/Generic';
import { Subscription } from 'rxjs';
import { SubSink } from 'subsink';


@Component({
  selector: 'app-appliance',
  templateUrl: './appliance.component.html',
  styleUrls: ['./appliance.component.sass']
})
export class ApplianceComponent implements OnInit, OnDestroy {

  @Input() deviceaddress: string;
  @Input() item: Item;

  public device: GenericDevice;
  private usedDataPoints: string[] = [];
  private dataPointName: string;
  private subscriptions = new SubSink();

  constructor(
    private networkService: NetworkService,
    private applicationService: ApplicationService,
    private logger: NGXLogger
  ) {
    this.device = applicationService.deviceWithAddress(this.deviceaddress);
    this.logger.debug('Setup device %s', this.device)
  }

  set dpn(dpn: string) {
    this.dataPointName = dpn;
    this.markDpInUse(this.dataPointName)
  }

  get dpn(): string {
    return this.dataPointName;
  }

  getLogger(): NGXLogger {
    return this.logger;
  }

  getNetworkService(): NetworkService {
    return this.networkService;
  }

  getApplicationService(): ApplicationService {
    return this.applicationService;
  }


  getItemStateDescription(changedDP: string): string {
    if (this.dpn !== undefined) {
      return this.device.getDeviceStateDescription(this.dpn, this.item.template || '')
    }
    return 'n/a';
  }

  datapointHasChanged(dpname: string): void {

  }

  markDpInUse(name: string): void {
    this.logger.debug('adding Dp %s', name);
    this.usedDataPoints.push(name);
  }

  ngOnInit(): void {
    console.log('ApplianceComponent ngOnInit %s', this.item.id)
    this.device = this.applicationService.deviceWithAddress(this.item.device);

    if (this.device !== undefined) {
      this.initializeDeviceComponent();
    }

  }

  private checkDeviceHasChannelAndDatapoint() {
    return ((this.item.ifname !== undefined) && (this.item.channel !== undefined) && (this.device.defaultDatapoint !== undefined));
  }

  private initializeDeviceComponent() {

    console.log('Device found');
    if (this.checkDeviceHasChannelAndDatapoint()) {
      this.dpn = `${this.item.ifname}.${this.item.device}:${this.item.channel}.${this.device.defaultDatapoint}`;
    }
    const dp = this.item.getDatapoint();
    if (dp) {
      this.markDpInUse(dp);
    }

    this.subscriptions.add(this.device.changed.subscribe((changedDP) => {
      this.handleDatapointChange(changedDP, dp);
    }));

    this.device.updateStates();
  }

  private handleDatapointChange(changedDP: any, dp: any) {
    console.log('Device Changed %s', changedDP);
    if ((dp) && (dp === changedDP)) {
      console.log('Main StateDescription changed');
      let sdp = this.device.getDatapointByName(dp);
      if (sdp !== undefined) {
        this.item.stateDescription = this.device.getDeviceStateDescription(dp, this.item.template);
      }
    } else {
      console.log('changing internal state description %s', changedDP);
      this.item.stateDescription = this.getItemStateDescription(changedDP);
    }
    this.datapointHasChanged(changedDP);
  }

  setState(newState: any) {

  }

  visualStateID(): number {
    return this.item.visualStateID;
  }

  click(event: any): void {
    this.getApplicationService().maximize(this.item.id, false)
  }

  openControl(event: any): void {
    this.getApplicationService().maximize(this.item.id, true)
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
