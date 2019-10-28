import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftNewPage } from './gift-new.page';

describe('GiftNewPage', () => {
  let component: GiftNewPage;
  let fixture: ComponentFixture<GiftNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftNewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
