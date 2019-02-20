import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit {

  protected name = new FormControl('zoe');

  protected _disabled = false;
  protected _required = false;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  toggleDisabled() {

    if (this._disabled) {
      this.name.enable();
    } else {
      this.name.disable();
    }

    this._disabled = !this._disabled;
  }

}
