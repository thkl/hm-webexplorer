import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrameditorComponent } from './programeditor.component';

describe('ProgrameditorComponent', () => {
  let component: ProgrameditorComponent;
  let fixture: ComponentFixture<ProgrameditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgrameditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrameditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
