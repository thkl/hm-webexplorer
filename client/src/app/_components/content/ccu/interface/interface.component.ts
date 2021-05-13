import { Component, OnInit, Input } from '@angular/core';
import { SidebarService } from 'src/app/_service/uicomponent.service';
import { CCUInterface } from 'src/app/_interface/ccu/interface';
import { DataService } from 'src/app/_service/data.service';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html'
})
export class InterfaceComponent implements OnInit {

  @Input() interfaceList: CCUInterface[];

  constructor(
    private dataService: DataService,
    public sidebarService: SidebarService
  ) {
  }

  public _toggleSidebar(hardwareInterface): void {
    this.sidebarService.openSideBar('INTERFACE', 'Interface: ' + hardwareInterface.name, hardwareInterface, false);
  }

  ngOnInit(): void {
    this.interfaceList = this.dataService.interfaceList;
    this.dataService.subscribeToInterfaceList().subscribe((newList) => {
      this.interfaceList = newList;
    }, (error) => { console.log(error); });
  }

  trackbyInterface(ccuInterface: { id: any; }): void {
    return ccuInterface.id;
  }
}
