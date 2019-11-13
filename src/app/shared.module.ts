import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { ErrorBlockComponent } from "./components/error-block/error-block.component";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  declarations: [ErrorBlockComponent],
  exports: [ErrorBlockComponent]
})
export class SharedModule {}
