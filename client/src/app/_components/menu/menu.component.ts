import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from 'src/app/_service/menuservice';
import { MenuItem } from '../../_interface/menuitem';
import { NetworkService } from '../../_service/network.service';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html'
})
export class MenuComponent implements OnInit {

  @Input() menuitems: MenuItem[];

  constructor(
    public networkService: NetworkService,
    private menuItemservice: MenuService
  ) {

  }

  ngOnInit(): void {
    this.menuitems = [];
    this.networkService.getJsonData('menu')
      .then(result => {
        console.log('ALL Data: ', result);
        const key = 'menu';
        this.menuitems = result[key];
      })
      .catch(error => {
        console.log('Error Getting Data: ', error);
      });
  }

  selectItem(itemID: string): void {
    this.menuItemservice.selectMenuItem(itemID);
  }

}
