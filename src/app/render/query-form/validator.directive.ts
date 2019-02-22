import { Directive, StaticProvider, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, FormArray, FormGroup, FormControl } from '@angular/forms';
import { QueryFormComponent } from './query-form.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Question, Option } from './model';

export const QUERYFORM_VALIDATOR: StaticProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => QueryFormValidatorDirective),
  multi: true
};

@Directive({
  selector: '[app-query-form][ngModel],[app-query-form][formControl],[app-query-form][formControlName]',
  providers: [ QUERYFORM_VALIDATOR]
})
export class QueryFormValidatorDirective implements OnInit, OnDestroy, Validator {

  private _bag = new Subject<void>();
  private _onChange: () => void;

  constructor(
    private component: QueryFormComponent
  ) {
  }

  private get required() {
    return true;
  }

  ngOnInit(): void {
    this.component._questionGroup.valueChanges.pipe(
      takeUntil(this._bag)
    ).subscribe(v => {
      if (this._onChange) { this._onChange(); }
    });
  }

  ngOnDestroy(): void {
    this._bag.next();
    this._bag.complete();
  }

  validate(control: AbstractControl): ValidationErrors {

    if (!this.required) { return null; }
    if (this.component._disabled) { return null; }

    const questions = this.component._questionGroup.get("questions") as FormArray;

    const errors: any = {};

    // 檢查每一個問題。
    for (const qg of questions.controls as FormGroup[]) {
      // each Question FormGroup
      const q = qg.value as Question;

      if (q.Type === "單選") {
        this.validSingleSelect(qg, errors);
      } else if (q.Type === "填答") {
        console.log('skip');
      } else if (q.Type === "複選") {
        console.log('skip');
      }
    }

    if (Object.getOwnPropertyNames(errors).length > 0) {
      return errors;
    } else {
      return null;
    }
  }

  private validSingleSelect(qg: FormGroup, errors: any) {
    const ogs = this.getOptionsControl(qg);
    const q = qg.value as Question;
    let qValid = false;
    let oMsg = null;

    for (const og of ogs) {
      const o = og.value as Option;
      qValid = qValid || o.AnswerChecked;

      if (o.AnswerChecked) {
        const matrix = og.get("AnswerMatrix") as FormControl;
        if (!matrix.valid) {
          oMsg = "已選擇的項目空格需要填值。";
        }
      }
    }

    if (!qValid) {
      errors[q.QuestionCode] = "單選必填題目需要選擇一個項目。";
    }

    if (oMsg && qValid) {
      errors[q.QuestionCode] = oMsg;
    }

    return errors;
  }

  private getOptionsControl(qg: FormGroup) {
    // Options 是一個 FormArray，他的 controls 屬性才是 FormGroup[]。
    return (qg.get("Options") as FormArray).controls as FormGroup[];
  }

  registerOnValidatorChange?(fn: () => void): void {
    this._onChange = fn;
  }
}
