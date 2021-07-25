import { Component } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { SonosDevice } from 'src/app/implementation/device/SonosDevice';
import { ApplicationService } from 'src/app/service/application.service';
import { NetworkService } from 'src/app/service/network.service';
import { ApplianceComponent } from '../appliance/appliance.component';

@Component({
  selector: 'app-sonos-component',
  templateUrl: './sonos.component.html',
  styleUrls: ['./sonos.component.sass']
})
export class SonosComponent extends ApplianceComponent {


  public device: SonosDevice;
  public isOn: boolean;
  public artworkurl: string;

  private dpStatus: string;
  private dpPlay: string;
  private dpPause: string;
  private dpArtWork: string;
  private dpNext: string;

  constructor(
    networkService: NetworkService,
    applicationService: ApplicationService,
    logger: NGXLogger
  ) {
    super(networkService, applicationService, logger)
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.item.controls) {
      this.dpn = this.item.getControlDatapointName('track');
      this.dpStatus = this.item.getControlDatapointName('state');
      if (this.dpStatus) {
        this.markDpInUse(this.dpStatus);
      } else {
        this.getLogger().warn('StatusDP not found')
      }
      this.dpPause = this.item.getControlDatapointName('pause');
      this.dpPlay = this.item.getControlDatapointName('play');
      this.dpNext = this.item.getControlDatapointName('next');

      this.dpArtWork = this.item.getControlDatapointName('artwork');
      if (this.dpArtWork !== undefined) {
        this.markDpInUse(this.dpArtWork)
      } else {
        this.getLogger().warn('ArtWorkDP not found')
      }

      this.artworkurl = this.device.lastArtwork
    } else {
      this.getLogger().warn('Controls not found')
    }
  }

  click(event: any): void {
    this.getLogger().debug('Sonos Click')
    event.stopPropagation();
  }

  getItemStateDescription(changedDP: string): string {
    if (changedDP === this.dpStatus) {
      const tmpDp = this.device.getDatapoint(this.dpStatus);
      if (tmpDp) {
        this.isOn = (tmpDp.curValue === 'PLAYING');
      }
    }

    if (changedDP === this.dpArtWork) {
      this.getLogger().debug('Updating Artwork')
      const tmpADp = this.device.getDatapoint(this.dpArtWork)
      if ((tmpADp) && (tmpADp.curValue) && (tmpADp.curValue !== "")) {
        this.artworkurl = tmpADp.curValue
        this.device.lastArtwork = this.artworkurl
      }
    }
    return this.device.getDeviceStateDescription(this.dpn, '')
  }

  playPause(): void {
    if (this.dpStatus) {
      const tmpDp = this.device.getDatapoint(this.dpStatus);
      if (tmpDp) {
        this.isOn = (tmpDp.curValue === 'PLAYING');
        if (this.isOn === true) {
          const tmpPause = this.device.getDatapoint(this.dpPause);
          if (tmpPause) {
            tmpPause.curValue = 1;
            this.device.setDatapoint(tmpPause)
          }
        } else {
          const tmpPlay = this.device.getDatapoint(this.dpPlay);
          if (tmpPlay) {
            tmpPlay.curValue = 1;
            this.device.setDatapoint(tmpPlay)
          }
        }
      }
    }
  }

  next(): void {
    if (this.dpNext) {
      const tmpDp = this.device.getDatapoint(this.dpNext);
      if (tmpDp) {
        tmpDp.curValue = 1;
        this.device.setDatapoint(tmpDp);
      }
    }
  }

  openControl(event: any): void {
    super.openControl(event)
  }

}
