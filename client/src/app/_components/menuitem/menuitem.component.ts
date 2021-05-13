import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from 'src/app/_service/menuservice';
import { MenuItem } from '../../_interface/menuitem';

@Component({
  selector: 'app-menuitem',
  templateUrl: './menuitem.component.html'
})

export class MenuitemComponent implements OnInit {


  @Input() menuitem: MenuItem;

  constructor(private menuItemservice: MenuService) { }

  selectItem(itemID: string): void {
    this.menuItemservice.selectMenuItem(itemID);
  }

  ngOnInit(): void {
  }

}
