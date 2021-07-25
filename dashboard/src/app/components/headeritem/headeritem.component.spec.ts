import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderitemComponent } from './headeritem.component';

describe('HeaderitemComponent', () => {
  let component: HeaderitemComponent;
  let fixture: ComponentFixture<HeaderitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderitemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
