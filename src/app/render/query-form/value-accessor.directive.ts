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

  private _onChange: any;
  private _onTouched: any;

  constructor(
    private component: QueryFormComponent
  ) {
  }

  ngOnInit(): void {
    this.component.dataChange.pipe(
      takeUntil(this._bag)
    ).subscribe(v => {
      this._onChange(v);
    });
  }

  ngOnDestroy(): void {
    this._bag.next();
    this._bag.complete();
  }

  writeValue(obj: any): void {
    this.component.dataSource = obj;
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
