/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VisualRecoComponent } from './visual-reco.component';

describe('VisualRecoComponent', () => {
  let component: VisualRecoComponent;
  let fixture: ComponentFixture<VisualRecoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualRecoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualRecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
