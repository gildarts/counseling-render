import { Component, OnInit } from '@angular/core';
import data from '../example';
import { QOption } from 'src/app/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SentenceService } from 'src/app/render';

@Component({
  selector: 'app-large-amount',
  templateUrl: './large-amount.component.html',
  styleUrls: ['./large-amount.component.css']
})
export class LargeAmountComponent implements OnInit {

  dataSource = data;

  options: QOption[] = [];

  optionsControl: FormGroup[] = [];

  _show = false;

  _impl: 'old' | 'new' = 'old';

  constructor(
    private fb: FormBuilder,
    public dissector: SentenceService
  ) { }

  ngOnInit() {

    for (const subject of this.dataSource) {
      for (const group of subject.QuestionGroup) {
        for (const query of group.QuestionQuery) {
          for (const quest of query.QuestionText) {
            quest.Options.forEach(o => {
              (o as any).Type = quest.Type;
              o.AnswerMatrix = [];
              this.options.push(o);
            });
          }
        }
      }
    }

    this.optionsControl = this.options.map(o => this.fb.group(o));

  }

  $any(val: any) {
    return val as any;
  }

  test(val: string) {
    return this.dissector.test(val);
  }

  testSpeed() {
    const t1 = Date.now();
    const result: boolean[] = [];
    for (const o of this.options) {
      result.push(this.dissector.test(o.OptionText));
    }
    console.log(result);
    console.log(`period: ${Date.now() - t1}`);
  }
}
