import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyslogComponent } from './syslog.component';

describe('SyslogComponent', () => {
  let component: SyslogComponent;
  let fixture: ComponentFixture<SyslogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyslogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyslogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
