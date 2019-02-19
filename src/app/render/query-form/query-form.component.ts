import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Question, Option } from './model';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-query-form]',
  templateUrl: './query-form.component.html',
  styleUrls: ['./query-form.component.css']
})
export class QueryFormComponent implements OnInit, OnDestroy {

  private _bag = new Subject<void>();

  protected _questionGroup = this.fb.group({});

  protected _data: any;

  constructor(
    private fb: FormBuilder
  ) { }

  @Input() set data(val: Question[]) {

    const questionArray = val.map(quest => {

      const optionArray = quest.Options.map(opt => {
        return this.fb.group({
          ...opt,
          "AnswerMatrix": new FormControl(opt.AnswerMatrix),
        });
      });

      return this.fb.group({
        ...quest,
        "Options": new FormArray(optionArray)
      });
    });

    this._questionGroup.setControl("questions", new FormArray(questionArray));

  }

  @Input() debug: boolean;

  ngOnInit() {
    this._data = this._questionGroup.value;
    this._questionGroup.valueChanges.pipe(
      takeUntil(this._bag)
    ).subscribe( v => {
      this._data = v;
    });
  }

  ngOnDestroy(): void {
    this._bag.next();
    this._bag.complete();
  }

  protected getQuestionsControl() {
    const ctl = this._questionGroup.get("questions") as FormArray;
    return (ctl || {controls: []}).controls;
  }

  protected getOptionsControl(q: FormGroup) {
    const ctl = q.get("Options") as FormArray;
    return (ctl || { controls: [] }).controls;
  }

  // 這裡只是為了在 html 中有 intellscense.
  protected c_option(o: FormGroup): Option {
    return o.value;
  }

  protected c_question(q: FormGroup): Question {
    return q.value;
  }
}
