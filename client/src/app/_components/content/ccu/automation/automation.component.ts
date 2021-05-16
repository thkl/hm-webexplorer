import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ScripteditorComponent } from '../scripteditor/scripteditor.component';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.sass']
})
export class CCUAutomationComponent implements OnInit {

  @Input() data: any;
  @ViewChild(ScripteditorComponent) scriptEditor: ScripteditorComponent;

  public selectedTab: string;
  constructor() { }

  ngOnInit(): void {
    if ((this.data) && (this.data.selectedTab)) {
      this.selectedTab = this.data.selectedTab;
    }
    if (this.selectedTab === undefined) {
      this.selectedTab = 'link';
    }
  }

  refreshTab(): void {
    this.scriptEditor.refresh();
  }
}
