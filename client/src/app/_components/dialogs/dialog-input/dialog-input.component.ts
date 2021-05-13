import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from 'node_modules.nosync/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dialog-input',
  templateUrl: './dialog-input.component.html',
  styleUrls: ['./dialog-input.component.sass']
})
export class DialogInputComponent implements OnInit {

  public dialogTitle: string;
  public dialogClass: string;
  public dialogMessage: string;
  public input = new FormControl('', Validators.required);

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  set initialValue(value: string) {
    this.input.setValue(value);
  }
}
