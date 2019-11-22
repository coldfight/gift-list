import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { RecipientEditPage } from "./recipient-edit.page";
import { SharedModule } from "../../shared.module";

const routes: Routes = [
  {
    path: "",
    component: RecipientEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [RecipientEditPage]
})
export class RecipientEditPageModule {}
