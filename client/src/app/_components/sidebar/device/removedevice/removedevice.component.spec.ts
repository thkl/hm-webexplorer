import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovedeviceComponent } from './removedevice.component';

describe('RemovedeviceComponent', () => {
  let component: RemovedeviceComponent;
  let fixture: ComponentFixture<RemovedeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemovedeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovedeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
