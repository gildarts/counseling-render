import { Directive, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SentenceComponent } from './sentence.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export const SENTENCE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SentenceDirective),
  multi: true
};

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'app-sentence',
  providers: [SENTENCE_VALUE_ACCESSOR]
})
export class SentenceDirective implements OnInit, OnDestroy, ControlValueAccessor {

  private _bag = new Subject<void>();

  private _onChange: any;
  private _onTouched: any;

  constructor(
    private component: SentenceComponent
  ) { }

  ngOnInit(): void {
    this.component.martixChange
    .pipe(takeUntil(this._bag))
    .subscribe(v => {
      this._onChange(v);
    });

    this.component.martixTouched
    .pipe(takeUntil(this._bag))
    .subscribe(v => {
      this._onTouched();
    });
  }

  ngOnDestroy(): void {
    this._bag.next();
    this._bag.complete();
  }

  writeValue(obj: any): void {
    this.component.martix = obj;
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
