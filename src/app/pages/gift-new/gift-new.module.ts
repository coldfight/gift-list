import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicSelectableModule } from "ionic-selectable";

import { IonicModule } from "@ionic/angular";

import { GiftNewPage } from "./gift-new.page";

const routes: Routes = [
  {
    path: "",
    component: GiftNewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicSelectableModule
  ],
  declarations: [GiftNewPage]
})
export class GiftNewPageModule {}
