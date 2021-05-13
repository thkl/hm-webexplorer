import { Component, ComponentFactoryResolver, OnInit, Input, ViewChild, ViewContainerRef, EventEmitter } from '@angular/core';
import { SidebarService } from '../../_service/uicomponent.service';
import { SideBar } from '../../_interface/Sidebar';
import { SidebarItem } from 'src/app/_interface/SideBarItem';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})

export class SidebarComponent implements OnInit, SideBar {
  @Input() data: any;
  @Input() title: string;
  @Input() isEditable: boolean;
  @Input() onSave: EventEmitter<object>;
  @Input() onDelete: EventEmitter<object>;

  @ViewChild('sidebarHost', { read: ViewContainerRef }) public sidebarHost: ViewContainerRef;

  private sideBarItem: SidebarItem;
  private objectType: string;

  constructor(
    public sideBarService: SidebarService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }


  ngOnInit(): void {
    this.sideBarService.sideBarChanged.subscribe(data => {
      this.title = data.title;
      this.isEditable = data.isEditable;
      this.objectType = data.type;
      this.loadComponent(data.apiHost, data.type);
    });
  }

  sidebar_close(): void {
    this.sideBarService.closeSideBar();
  }

  saveData(): void {
    console.log('save');
    this.sideBarItem.onSave.emit();
    this.sideBarService.saveObject(this.objectType, this.sideBarItem.data).then(() => {
      console.log('closing sidebar')
      this.sidebar_close();
    });
  }

  loadComponent(apiHost: string, type: string): void {
    this.sideBarItem = this.sideBarService.getComponent(type);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.sideBarItem.component);

    const viewContainerRef = this.sidebarHost;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<SideBar>(componentFactory);
    componentRef.instance.data = this.sideBarItem.data;
    componentRef.instance.onSave = this.sideBarItem.onSave;
    componentRef.instance.onDelete = this.sideBarItem.onDelete;
  }


}
