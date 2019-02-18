import { Component, OnInit, Input } from '@angular/core';
import { Question, Option } from './model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-query-form]',
  templateUrl: './query-form.component.html',
  styleUrls: ['./query-form.component.css']
})
export class QueryFormComponent implements OnInit {

  constructor() { }

  @Input() data: Question[];

  ngOnInit() {
  }

  // 這裡只是為了在 html 中有 intellscense.
  c_option(o: any): Option {
    return o;
  }
}
