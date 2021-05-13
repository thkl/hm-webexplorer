import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesettingsComponent } from './devicesettings.component';

describe('DevicesettingsComponent', () => {
  let component: DevicesettingsComponent;
  let fixture: ComponentFixture<DevicesettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevicesettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
