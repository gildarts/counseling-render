import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit {

  name = new FormControl('zoe');

  _disabled = false;
  _required = false;
  _show = true;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.name.valueChanges.subscribe(v => {
      console.log(v);
    });
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
