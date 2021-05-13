import { Component, OnInit, Input } from '@angular/core';
import { CCUVariable } from 'src/app/_interface/ccu/variable';
import { DataService } from 'src/app/_service/data.service';
import { SidebarService } from 'src/app/_service/uicomponent.service';

@Component({
  selector: 'app-variable',
  templateUrl: './variable.component.html'
})
export class VariableComponent implements OnInit {

  public apihost: string;
  @Input() variableList: CCUVariable[]; // this is the filtered list which will be displayd


  constructor(
    public sidebarService: SidebarService,
    public dataService: DataService
  ) { }


  public _toggleSidebar(variable: CCUVariable): void {
    this.sidebarService.openSideBar('VARIABLE', 'Variable: ' + variable.name, variable, true);
  }



  removeFilter(): void {
    this.variableList = this.dataService.variableProvider.variableList;
  }
  public setFilter(event: any): void {
    const fltr = event.target.value;
    this.variableList = this.dataService.variableProvider.variableList.filter((variable => {
      return (variable.name.toLowerCase().indexOf(fltr.toLowerCase()) > -1);
    }));
  }

  ngOnInit(): void {
    this.variableList = this.dataService.variableProvider.variableList
    this.dataService.variableProvider.subscribeToVariableList().subscribe(newVariableList => {
      this.variableList = newVariableList;
    });
  }

  trackbyVariable(ccuvariable: { id: any; }): any {
    return ccuvariable.id;
  }
}
