import { Component, OnInit } from '@angular/core';
import { CCUAddon } from 'src/app/_interface/ccu/addon';
import { DataService } from 'src/app/_service/data.service';

@Component({
  selector: 'app-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.sass']
})
export class AddonsComponent implements OnInit {

  public addonList: CCUAddon[];

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.coreProvider.fetchAddons().then(addOnList => {
      this.addonList = addOnList
    })
  }

  canDoAction(addon: CCUAddon, action: string): boolean {
    return ((addon.operations !== undefined) && (addon.operations.indexOf(action) > -1));
  }

  restartAddon(addon: CCUAddon): void {
    this.dataService.coreProvider.restartAddon(addon)
  }

  uninstallAddon(addon: CCUAddon): void {

  }
}
