import { Component, AfterViewInit, ViewContainerRef, Input, ComponentFactoryResolver, ViewChild, Type } from '@angular/core';
import { SidebarService } from 'src/app/_service/uicomponent.service';
import { DeviceComponent } from 'src/app/_components/content/ccu/device/device.component';
import { InterfaceComponent } from 'src/app/_components/content/ccu/interface/interface.component';
import { RoomComponent } from '../ccu/room/room.component';
import { VariableComponent } from '../ccu/variable/variable.component';
import { LinkeditorComponent } from '../ccu/linkeditor/linkeditor.component';
import { Content } from 'src/app/_interface/content';
import { MenuService } from 'src/app/_service/menuservice';
import { CCUAutomationComponent } from '../ccu/automation/automation.component';
import { ProgrameditorComponent } from '../ccu/programeditor/programeditor.component';
import { FunctionComponent } from '../ccu/function/function.component';


@Component({
  selector: 'app-container',
  template: '<div class="row"><div class="col-12"><div #hostContainer></div> </div></div>'
})

export class ContainerComponent implements AfterViewInit, Content {

  @ViewChild('hostContainer', { read: ViewContainerRef }) public container: ViewContainerRef;
  @Input() data: any;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private menuItemService: MenuService,
    private sidebarService: SidebarService
  ) { }


  ngAfterViewInit(): void {
    this.loadComponent(DeviceComponent);
    this.menuItemService.menuItemSelected.subscribe(item => {
      console.log(item);
      const page = item.page;
      switch (page) {
        case 'interfaces':
          this.loadComponent(InterfaceComponent);
          break;
        case 'devices':
          this.loadComponent(DeviceComponent);
          break;
        case 'rooms':
          this.loadComponent(RoomComponent);
          break;
        case 'variables':
          this.loadComponent(VariableComponent);
          break;
        case 'linkeditor':
          this.loadComponent(LinkeditorComponent, item.data);
          break;
        case 'programeditor':
          this.loadComponent(ProgrameditorComponent, item.data);
          break;
        case 'automation':
          this.loadComponent(CCUAutomationComponent, item.data);
          break;
        case 'functions':
          this.loadComponent(FunctionComponent);
        default:
          break;
      }
    });
  }

  loadComponent(component: Type<any>, data?: any): void {
    this.sidebarService.closeSideBar();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.container;
    viewContainerRef.clear();
    const cmpref = viewContainerRef.createComponent<Content>(componentFactory);
    cmpref.instance.data = data;
  }

}
