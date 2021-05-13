import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-interface',
  template: '<table style="width:100%">\
              <tr>\
                <td>Objekt ID</td>\
                <td>{{data.id}}</td>\
              </tr>\
              <tr>\
                <td>Interface name</td>\
                <td>{{data.name}}</td>\
              </tr>\
              <tr>\
                <td>Info</td>\
                <td>{{data.info}}</td>\
              </tr>\
              <tr>\
                <td>RPC Url</td>\
                <td>{{data.url}}</td>\
              </tr>\
            </table>'
})

export class SideBarInterfaceComponent implements OnInit {
  public apiHost: string;
  @Input() data: any;
  constructor() { }

  ngOnInit(): void {
  }

}
