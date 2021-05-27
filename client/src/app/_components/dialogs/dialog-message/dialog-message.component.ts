import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dialog-message',
  templateUrl: './dialog-message.component.html',
  styleUrls: ['./dialog-message.component.sass']
})
export class DialogMessageComponent implements OnInit {

  public dialogTitle: string;
  public dialogClass: string;
  public dialogMessage: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
