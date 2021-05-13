import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from 'node_modules.nosync/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.sass']
})
export class DialogConfirmComponent implements OnInit {

  public dialogTitle: string;
  public dialogClass: string;
  public dialogMessage: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
