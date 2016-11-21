/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DengonComponent } from './dengon.component';

describe('DengonComponent', () => {
  let component: DengonComponent;
  let fixture: ComponentFixture<DengonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DengonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DengonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
