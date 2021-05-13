import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CCUChannel } from 'src/app/_interface/ccu/channel';
import { DataService } from 'src/app/_service/data.service';

@Component({
  selector: 'app-channelchooser',
  templateUrl: './channelchooser.component.html',
  styleUrls: ['./channelchooser.component.sass']
})
export class ChannelchooserComponent implements OnInit {

  public channelList: CCUChannel[];
  public tmpChannelList: CCUChannel[];
  public showVirtual = false;
  public cnFilter: string;
  public apihost: string;

  @Input() public isWritable: boolean;
  @Input() public isEventable: boolean;
  @Input() public isReadable: boolean;
  @Input() public isVirtual: boolean;
  @Input() public recentKey: string;

  @Output() onChoose: EventEmitter<any> = new EventEmitter();

  constructor(
    public dataService: DataService
  ) {
    this.apihost = this.dataService.networkService.apiHost;
  }


  public filterList(): void {
    const fltr = this.cnFilter;
    this.channelList = this.dataService.deviceProvider.filterChannelList(this.tmpChannelList, {
      isWritable: this.isWritable,
      isEventable: this.isEventable,
      isReadable: this.isReadable,
      fltr: fltr,
      isVirtual: this.showVirtual
    });
  }

  toggleVirtualChannelz(): void {
    this.filterList();
  }

  setChannel(channel): void {
    if (this.onChoose) {
      this.onChoose.emit(channel);
    }
    if (this.recentKey) {
      this.dataService.uiProvider.addRecentlyUsedObject(this.recentKey, channel);
    }
  }

  recentlyUsed(): CCUChannel[] {
    let lst = this.dataService.uiProvider.recentlyUsed(this.recentKey);
    if (lst === undefined) {
      lst = [];
    }
    return lst;
  }

  ngOnInit(): void {
    this.tmpChannelList = [];
    let devList = this.dataService.deviceProvider.deviceList;
    devList.forEach(device => {
      device.channels.forEach(channel => {
        this.tmpChannelList.push(channel);
      })
    })
    this.showVirtual = this.isVirtual
    this.filterList() // 

  }

}
