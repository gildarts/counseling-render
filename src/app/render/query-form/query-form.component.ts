import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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
export class QueryFormComponent implements OnInit, OnDestroy, OnChanges {

  private _bag = new Subject<void>();
  private _valueChangesRegistered = false;

  _questionGroup = this.fb.group({"questions": new FormArray([])});

  constructor(
    private fb: FormBuilder
  ) { }

  @Input() dataSource: Question[];

  @Output() dataSourceChange = new EventEmitter<Question[]>(true);

  @Input() debug: boolean;

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.dataSource) {
      this._initQuestionGroup();
    }
  }

  ngOnInit() {
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

  /** 依 dataSource 最新狀態產生畫面。 */
  _initQuestionGroup() {
    const data = this.dataSource;
    const questionArray = data.map(quest => {
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

    this._registerValueChanges();
  }

  /** 註冊 question group 的資料變更事件，並更新回 dataSource 屬性。 */
  _registerValueChanges() {
    if (this._valueChangesRegistered) { return; }

    this._questionGroup.valueChanges.pipe(
      takeUntil(this._bag)
    ).subscribe(v => {
      if (!this._questionGroup.disabled) {
        // 傳入的是陣列，但是 reactive form 機制關系，新增了 questions。
        this.dataSource = v.questions;
        this.dataSourceChange.emit(this.dataSource);
      }
    });
    this._valueChangesRegistered = true;
  }
}
