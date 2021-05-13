import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkeditorComponent } from './linkeditor.component';

describe('LinkeditorComponent', () => {
  let component: LinkeditorComponent;
  let fixture: ComponentFixture<LinkeditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkeditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
