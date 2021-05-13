import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelchooserComponent } from './channelchooser.component';

describe('ChannelchooserComponent', () => {
  let component: ChannelchooserComponent;
  let fixture: ComponentFixture<ChannelchooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelchooserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelchooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
