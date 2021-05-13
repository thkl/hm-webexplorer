import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarDeviceAutomationComponent } from './deviceautomation.component';

describe('DevicelinksComponent', () => {
  let component: SideBarDeviceAutomationComponent;
  let fixture: ComponentFixture<SideBarDeviceAutomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SideBarDeviceAutomationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarDeviceAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
