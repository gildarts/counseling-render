import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import alldata from '../example';
import { QueryFormComponent } from '../../render';

@Component({
  selector: 'app-query-test',
  templateUrl: './query-test.component.html',
  styleUrls: ['./query-test.component.css']
})
export class QueryTestComponent implements OnInit {

  fulldata = alldata;

  fulldataGroup: FormControl[] = [];

  _disabled = false;

  _debug = false;

  _show_all = false;

  _count = 0;

  constructor() { }

  @ViewChildren('query') query: QueryList<QueryFormComponent>;

  ngOnInit() {

    for (const subject of this.fulldata) {
      for (const group of subject.QuestionGroup) {
        for (const query of group.QuestionQuery) {
          this.fulldataGroup.push(new FormControl(query.QuestionText));
          this._count += query.QuestionText
            .map(v => v.Options.length)
            .reduce((p, c) => p + c);
        }
      }
    }

  }

  toggleDisabled() {
    this._disabled = !this._disabled;
  }

  toggleDebug() {
    this._debug = !this._debug;
  }

  resetValues() {
    for (const q of this.query.toArray()) {
      q.resetValues();
    }
  }
}
