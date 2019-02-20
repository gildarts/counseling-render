import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Question, Option } from './model';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-query-form]',
  templateUrl: './query-form.component.html',
  styleUrls: ['./query-form.component.css'],
  exportAs: 'appQueryForm'
})
export class QueryFormComponent implements OnInit, OnDestroy {

  private _bag = new Subject<void>();

  _questionGroup = this.fb.group({"questions": new FormArray([])});

  _data: Question[];

  constructor(
    private fb: FormBuilder
  ) { }

  @Input() set dataSource(val: Question[]) {

    this._data = val;
    const questionArray = this._data.map(quest => {

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

  get dataSource() {
    return this._data;
  }

  @Output() dataChange = new EventEmitter<Question[]>(true);

  @Input() debug: boolean;

  ngOnInit() {
    this._questionGroup.valueChanges.pipe(
      takeUntil(this._bag)
    ).subscribe( v => {
      if (!this._questionGroup.disabled) {
        // 傳入的是陣列，但是 reactive form 機制關系，新增了 questions。
        this._data = v.questions;
        this.dataChange.emit(this._data);
      }
    });
  }

  ngOnDestroy(): void {
    this._bag.next();
    this._bag.complete();
  }

  getQuestionsControl() {
    const ctl = this._questionGroup.get("questions") as FormArray;
    return (ctl || {controls: []}).controls as FormGroup[];
  }

  getOptionsControl(q: FormGroup) {
    const ctl = q.get("Options") as FormArray;
    return (ctl || { controls: [] }).controls;
  }

  get _disabled() {
    return this._questionGroup.disabled;
  }

  // 這裡只是為了在 html 中有 intellscense.
  c_option(o: FormGroup): Option {
    return o.value;
  }

  c_question(q: FormGroup): Question {
    return q.value;
  }

  setDisabledState(isDisabled: boolean) {
      if (isDisabled) {
        this._questionGroup.disable();
      } else {
        this._questionGroup.enable();
      }
  }
}
