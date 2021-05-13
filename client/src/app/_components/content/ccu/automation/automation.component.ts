import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.sass']
})
export class CCUAutomationComponent implements OnInit {

  @Input() data: any;
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

}
