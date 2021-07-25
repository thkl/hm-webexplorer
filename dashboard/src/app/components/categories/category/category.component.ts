import { Component, Input, OnInit } from '@angular/core';
import { Application } from 'src/app/interface/application';
import { ApplicationService } from 'src/app/service/application.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.sass']
})
export class CategoryComponent implements OnInit {

  @Input() application: Application | undefined

  constructor(
    public appService: ApplicationService
  ) { }

  ngOnInit(): void {
  }

  switchPage(pageId: string) {
    this.appService.switchPage(pageId);
  }
}
