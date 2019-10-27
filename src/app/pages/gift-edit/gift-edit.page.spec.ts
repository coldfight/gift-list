import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftEditPage } from './gift-edit.page';

describe('GiftEditPage', () => {
  let component: GiftEditPage;
  let fixture: ComponentFixture<GiftEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
