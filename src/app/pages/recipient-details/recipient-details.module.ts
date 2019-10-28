import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { RecipientDetailsPage } from "./recipient-details.page";

const routes: Routes = [
  {
    path: "",
    component: RecipientDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RecipientDetailsPage]
})
export class RecipientDetailsPageModule {}
