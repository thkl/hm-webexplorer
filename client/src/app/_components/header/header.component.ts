import { Component, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/_service/network.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  constructor(
    private networkService: NetworkService
  ) { }

  ngOnInit(): void {
  }

  selectSystem(): void {
    this.networkService.deleteConnection();
  }
}
