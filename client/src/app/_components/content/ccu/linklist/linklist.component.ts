import { Component, OnInit } from '@angular/core';
import { CCUInterfaceLinks } from 'src/app/_interface/ccu/interfacelinks';
import { DataService } from 'src/app/_service/data.service';
import { MenuService } from 'src/app/_service/menuservice';
import { NetworkService } from 'src/app/_service/network.service';
import { SidebarService } from 'src/app/_service/uicomponent.service';

@Component({
  selector: 'app-linklist',
  templateUrl: './linklist.component.html',
  styleUrls: ['./linklist.component.sass']
})
export class CCULinklistComponent implements OnInit {

  public linkList: CCUInterfaceLinks[];
  public apiHost: string;
  public loading: boolean;
  constructor(
    private dataService: DataService,
    private networkService: NetworkService,
    private sidebarService: SidebarService,
    private menuItemService: MenuService
  ) {

    this.apiHost = this.networkService.apiHost;
  }

  sortTable(column: string): void {

  }

  selectLink(device: any, sender: string, receiver: string): void {
    this.menuItemService.selectMenuItem('linkeditor', { device, sender, receiver });
  }

  removeLink(sender: string, receiver: string): void {

  }

  showDevice(device: any): void {
    this.sidebarService.openSideBar('DEVICE', 'Device: ' + device.name, device, true);
  }

  filterInternalLinks(input: CCUInterfaceLinks[]): void {
    this.linkList = [];
    Object.keys(input).forEach(interfaceId => {
      const list = input[interfaceId];
      // first filter internal links
      this.linkList[interfaceId] = list.filter(link => {
        return link.SENDER !== link.RECEIVER;
      });
      // 2nd add the channelz
      this.linkList[interfaceId].forEach(link => {
        this.dataService.deviceProvider.lookupDevicesForLink(link);
      });
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.dataService.deviceProvider.subscribeToDirectLinkList().subscribe((linkList: CCUInterfaceLinks[]) => {
      console.log('got new Links .. processing', linkList);
      this.filterInternalLinks(linkList);
    });

    this.dataService.deviceProvider.updateDirectLinks().then(() => {
      this.loading = false;
    });
  }

}
