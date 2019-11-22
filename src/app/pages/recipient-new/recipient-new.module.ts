import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { RecipientNewPage } from "./recipient-new.page";
import { SharedModule } from "../../shared.module";

const routes: Routes = [
  {
    path: "",
    component: RecipientNewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [RecipientNewPage]
})
export class RecipientNewPageModule {}
