import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlindComponent } from './blind.component';

describe('BlindComponent', () => {
  let component: BlindComponent;
  let fixture: ComponentFixture<BlindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlindComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
