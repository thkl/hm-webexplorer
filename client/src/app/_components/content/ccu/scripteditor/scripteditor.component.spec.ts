import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScripteditorComponent } from './scripteditor.component';

describe('ScripteditorComponent', () => {
  let component: ScripteditorComponent;
  let fixture: ComponentFixture<ScripteditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScripteditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScripteditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
