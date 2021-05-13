import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/_service/data.service';

@Component({
  selector: 'app-variable',
  templateUrl: './variable.component.html'
})
export class SideBarVariableComponent implements OnInit {

  @Input() data: any;
  @Input() onSave: EventEmitter<object>;
  public variableData: any;


  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.variableData = JSON.parse(JSON.stringify(this.data)); // make a copy

    this.onSave.subscribe(() => {
      // copy back the attributes
      console.log(this.variableData);
      this.data.name = this.variableData.name;
    });

  }

}
