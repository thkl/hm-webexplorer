import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicepropertiesComponent } from './deviceproperties.component';

describe('DevicepropertiesComponent', () => {
  let component: DevicepropertiesComponent;
  let fixture: ComponentFixture<DevicepropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevicepropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicepropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
