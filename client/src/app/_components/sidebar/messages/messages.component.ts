import { Component, Input, OnInit } from '@angular/core';
import { CCUServicemessage } from 'src/app/_interface/ccu/servicemessage';
import { DataService } from 'src/app/_service/data.service';
import { NetworkService } from 'src/app/_service/network.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.sass']
})
export class CCUMessagesComponent implements OnInit {

  @Input() data: any;
  public listData: CCUServicemessage[];
  constructor(
    private dataService: DataService,
    private networkService: NetworkService
  ) { }

  _confirmMessage(messageid: number): void {
    this.networkService.deleteRequest(`service/${String(messageid)}`).then(() => {
      this.dataService.updateServiceMessages();
    });
  }

  ngOnInit(): void {
    console.log(this.data.type);
    switch (this.data.type) {
      case 'SERVICE':
        this.listData = this.dataService.serviceMessages;
        this.dataService.subscribeToServiceMessageList().subscribe((newList) => {
          this.listData = newList;
        });
        break;
    }
  }

}
