import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientEditPage } from './recipient-edit.page';

describe('RecipientEditPage', () => {
  let component: RecipientEditPage;
  let fixture: ComponentFixture<RecipientEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipientEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipientEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
