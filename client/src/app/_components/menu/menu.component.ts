import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/_service/data.service';
import { MenuService } from 'src/app/_service/menuservice';
import { MenuItem } from '../../_interface/menuitem';
import { NetworkService } from '../../_service/network.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

  @Input() menuitems: MenuItem[];

  constructor(
    public dataService: DataService,
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
        let addonitem = this.menuitems.filter(item => {
          return (item.id === "addons");
        }).pop()

        if (addonitem === undefined) {
          addonitem = { id: 'addon', title: 'AddOns', icon: 'applications-settings', children: [] };
          this.menuitems.push(addonitem);
        }

        this.dataService.coreProvider.fetchAddons().then(addOnList => {

          if (addOnList.length > 0) {
            addOnList.forEach(addon => {
              if (addon.id !== "hm-explorer") { // skip myself
                if (addon.config) {
                  addonitem.children.push({ id: 'addon_' + addon.id, title: addon.name + ' ⎋', icon: 'options', url: addon.config })
                }
              }
            })
          }

          addonitem.children.push({ id: 'manageaddons', title: "Manage Addons", icon: 'grain' })
        })
      })

  }

  selectItem(item: MenuItem): void {
    this.menuItemservice.selectMenuItem(item);
  }

}
