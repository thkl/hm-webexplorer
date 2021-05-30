import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_service/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  public searchTerm: string;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.dataService.uiProvider.doSearch(this.searchTerm);
  }

  doSearch(): void {
    this.dataService.uiProvider.doSearch(this.searchTerm);
  }
}
