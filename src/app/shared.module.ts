import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { ErrorBlockComponent } from "./components/error-block/error-block.component";
import { CommonModule } from "@angular/common";
import { BoughtGiftPipe } from "./filters/bought-gift.pipe";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  declarations: [ErrorBlockComponent, BoughtGiftPipe],
  exports: [ErrorBlockComponent, BoughtGiftPipe]
})
export class SharedModule {}
