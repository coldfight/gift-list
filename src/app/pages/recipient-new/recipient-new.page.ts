import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { RecipientService } from "../../services/recipient.service";

@Component({
  selector: "recipient-new",
  templateUrl: "./recipient-new.page.html",
  styleUrls: ["./recipient-new.page.scss"]
})
export class RecipientNewPage implements OnInit {
  form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private _navController: NavController,
    private _recipientService: RecipientService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      spendLimit: new FormControl("", Validators.compose([Validators.min(0)]))
    });
  }

  onSubmit(data) {
    // // once we submit this form, we might need to redirect back to the gift page
    // this._recipientService
    //   .addRecipient(data.name, data.spendLimit)
    //   .subscribe(() => {
    //     this._navController.pop();
    //     this.form.reset();
    //   });
  }
}
