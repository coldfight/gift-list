import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RecipientDetailsPage } from "./recipient-details.page";

describe("RecipientDetailsPage", () => {
  let component: RecipientDetailsPage;
  let fixture: ComponentFixture<RecipientDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecipientDetailsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipientDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
