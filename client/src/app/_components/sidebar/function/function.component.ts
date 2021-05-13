import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { CCUFunction } from 'src/app/_interface/ccu/ccufunction';
import { DataService } from 'src/app/_service/data.service';
import { ModalService } from 'src/app/_service/modal_dialog_service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.sass']
})
export class SideBarFunctionComponent implements OnInit {

  @Input() data: any;
  @Input() onSave: EventEmitter<object>;
  @Input() onDelete: EventEmitter<object>;

  public ccuFunction: CCUFunction;
  public apihost: string;
  private channelsToAdd: number[];
  private channelsToRemove: number[];

  constructor(
    private dataService: DataService,
    private modalService: ModalService
  ) {
    this.apihost = this.dataService.networkService.apiHost;
  }

  ngOnInit(): void {
    this.ccuFunction = JSON.parse(JSON.stringify(this.data)); // make a copy
    // localize the name
    this.channelsToAdd = [];
    this.channelsToRemove = [];

    this.ccuFunction.name = this.dataService.localizationService.parameterLocalization(this.ccuFunction.name, 'REGA');

    this.onSave.subscribe(() => {
      // Save the function Data
      this.data.name = this.ccuFunction.name;
      this.data.description = this.ccuFunction.description || '';
      // check if we have channels to change
      this.channelsToAdd.forEach(channelId => {
        this.dataService.deviceProvider.addFunctionToChannel(channelId, this.ccuFunction.id)
      })

      this.channelsToRemove.forEach(channelId => {
        this.dataService.deviceProvider.removeFunctionFromChannel(channelId, this.ccuFunction.id)
      })
    })

  }


  rebuidChannelObjects() {
    this.ccuFunction.channelObjects = [];
    this.ccuFunction.channels.forEach(channelID => {
      const chnl = this.dataService.deviceProvider.channelWithId(channelID);
      if (chnl) {
        this.ccuFunction.channelObjects.push(chnl);
      }
    });
  }

  removeChannel(channelid: number): void {
    this.channelsToRemove.push(channelid);
    this.ccuFunction.channels = this.ccuFunction.channels.filter(channel => {
      return channel !== channelid;
    })
    this.rebuidChannelObjects();
  }

  openChannelChooser(content) {

    const modalRef = this.modalService.custom(content, { size: 'lg', backdrop: true, windowClass: 'frontMost modal-info' })
      .pipe(
        take(1) // take() manages unsubscription for us
      ).subscribe(result => {
        if (result) {
          let cid = result['id'];
          this.channelsToAdd.push(cid);
          this.ccuFunction.channels.push(cid);
          this.rebuidChannelObjects();
        }
      })


  }

  deleteFunction(functionId: number) {

    this.modalService.confirm('Remove the Function ?', 'danger', 'Are u sure, that you want to remove this function ?').pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
      if (result === true) {
        this.dataService.functionProvider.removeFunction(functionId).then(() => {
          console.log('Function removed')
          this.onDelete.emit(null);
        });
      }
    });

  }


  trackChannels(index: number, element: any) {
    return element ? element.id : null
  }

}
