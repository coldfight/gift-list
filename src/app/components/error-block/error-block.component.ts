import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-error-block",
  templateUrl: "./error-block.component.html",
  styleUrls: ["./error-block.component.scss"]
})
export class ErrorBlockComponent implements OnInit {
  @Input() errorMessage;

  constructor() {}

  ngOnInit() {}
}
