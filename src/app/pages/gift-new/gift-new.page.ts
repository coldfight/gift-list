import { Component, OnInit, Input } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { GiftService } from "../../services/gift.service";
import { Recipient } from "../../interfaces/recipient.interface";

@Component({
  selector: "gift-new",
  templateUrl: "./gift-new.page.html",
  styleUrls: ["./gift-new.page.scss"]
})
export class GiftNewPage implements OnInit {
  @Input() recipient: Recipient;
  form: FormGroup;

  validationMessages = {
    name: [{ type: "required", message: "Gift name is required" }],
    price: [{ type: "min", message: "Not a valid price" }]
  };

  constructor(
    public formBuilder: FormBuilder,
    private _giftService: GiftService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      price: new FormControl("", Validators.compose([Validators.min(0)]))
    });
    console.log(this.form);
  }

  onSubmit() {}
}
