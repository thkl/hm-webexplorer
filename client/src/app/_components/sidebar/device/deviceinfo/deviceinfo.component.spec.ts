import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceinfoComponent } from './deviceinfo.component';

describe('DeviceinfoComponent', () => {
  let component: DeviceinfoComponent;
  let fixture: ComponentFixture<DeviceinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
