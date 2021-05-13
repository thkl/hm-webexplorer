import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CCUDirectlink } from 'src/app/_interface/ccu/directlink';
import { DataService } from 'src/app/_service/data.service';
import { MenuService } from 'src/app/_service/menuservice';
import { MasterComponent } from './uicomponents';

@Component({
  selector: 'app-linkeditor',
  templateUrl: './linkeditor.component.html',
  styleUrls: ['./linkeditor.component.sass']
})
export class LinkeditorComponent implements OnInit {

  @Input() data: any;

  @ViewChildren('linkproperty') viewChildren: QueryList<any>;


  public selectedLink: CCUDirectlink;
  private deviceData: any;
  constructor(
    private dataService: DataService,
    private menuItemService: MenuService
  ) {
  }

  closeEditor(): void {
    this.menuItemService.selectMenuItem('automation', { selectedTab: 'link' });
  }

  linkOptions(key: string, category: string): string[] {
    const linkOptions = this.dataService.deviceProvider.getLinkOptions(key, category);
    return Object.keys(linkOptions);
  }

  linkOptionValues(key: string, category: string, value: string): any {
    const linkOptions = this.dataService.deviceProvider.getLinkOptions(key, category);
    return linkOptions[value];
  }

  saveLink(): void {
    // Loop thru all Editors and call the saveParameter Function (they will generate data from individual fields)
    const details: MasterComponent[] = this.viewChildren.toArray();
    details.forEach(detailComponent => {
      if ((detailComponent.saveParameter) && (typeof detailComponent.saveParameter === 'function')) {
        detailComponent.saveParameter();
      }
    });
  }

  ngOnInit(): void {
    const device = this.data.device;
    this.dataService.deviceProvider.getLinksForDevice(device).then(links => {
      if (links) {
        links.forEach(link => {
          if ((link.SENDER === this.data.sender) && (link.RECEIVER === this.data.receiver)) {
            this.selectedLink = link;

            this.selectedLink.cSender = this.dataService.deviceProvider.channelWithAddress(link.SENDER);
            this.selectedLink.cReceiver = this.dataService.deviceProvider.channelWithAddress(link.RECEIVER);

            console.log(link);
          }
        });
      }
    });
  }
}

