import { Directive, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { QueryFormComponent } from './query-form.component';

export const QUERY_FORM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => QueryFormValueAccessorDirective),
  multi: true
};

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[app-query-form][ngModel],[app-query-form][formControl],[app-query-form][formControlName]',
  providers: [QUERY_FORM_VALUE_ACCESSOR]
})
export class QueryFormValueAccessorDirective implements OnInit, OnDestroy, ControlValueAccessor {

  private _bag = new Subject<void>();

  // 從 UI 來的變更，如果 UI 變更本來就會更新 form control 的值，且應該不需要此事件。
  private _onChange: any;
  // 暫時沒有用到。
  private _onTouched: any;

  constructor(
    private component: QueryFormComponent
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._bag.next();
    this._bag.complete();
  }

  writeValue(obj: any): void {
    this.component.dataSource = obj;
    this.component._initQuestionGroup();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.component.setDisabledState(isDisabled);
  }

}
