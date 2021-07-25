import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotaryComponent } from './rotary.component';

describe('RotaryComponent', () => {
  let component: RotaryComponent;
  let fixture: ComponentFixture<RotaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RotaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RotaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
