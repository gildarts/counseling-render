import { Directive, StaticProvider, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, ControlContainer } from '@angular/forms';
import { QueryFormComponent } from './query-form.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const QUERYFORM_VALIDATOR: StaticProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => QueryFormValidatorDirective),
  multi: true
};

@Directive({
  selector: 'test[app-query-form][ngModel],test[app-query-form][formControl],test[app-query-form][formControlName]',
  providers: [ QUERYFORM_VALIDATOR]
})
export class QueryFormValidatorDirective implements OnInit, OnDestroy, Validator {

  private _bag = new Subject<void>();
  private _onChange: () => void;

  constructor(
    private component: QueryFormComponent
  ) {
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

    if (control.valid) {
      return null;
    } else {
      return {query_form: '有缺失。'};
    }
  }

  registerOnValidatorChange?(fn: () => void): void {
    this._onChange = fn;
  }
}
