/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SonosComponent } from './sonos.component';

describe('SonosComponent', () => {
  let component: SonosComponent;
  let fixture: ComponentFixture<SonosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SonosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
