import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { SignupPage } from "./signup";
import { SignupPageRoutingModule } from "./signup-routing.module";
import { ErrorBlockComponent } from "../../components/error-block/error-block.component";
import { SharedModule } from "../../shared.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SignupPageRoutingModule,
    SharedModule
  ],
  declarations: [SignupPage]
})
export class SignUpModule {}
