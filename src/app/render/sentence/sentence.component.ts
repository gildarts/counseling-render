import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { SentenceService } from '../dissector.service';
import { TokenData } from '../sentence-dissector';
import { FormBuilder, FormArray, } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * 支援 ngModel、FormControl 基本功能，但不支援 Valid、Touched 之類狀態處理。
 */
@Component({
  selector: 'app-sentence',
  templateUrl: './sentence.component.html',
  styleUrls: ['./sentence.component.css'],
  // providers: [SENTENCE_VALUE_ACCESSOR]
})
export class SentenceComponent implements OnInit, OnDestroy {

  // 用於 component destroy 時 release 資源。
  _bag = new Subject<void>();

  _text: string;
  _martix: string[];
  _tokens: TokenData[];

  _tokenGroup = this.fb.group({inputs: new FormArray([])});

  _required = false;

  constructor(
    private srv: SentenceService,
    private fb: FormBuilder
  ) { }

  @Input() set text(val: string) {
    if (this._text !== val) {
      setTimeout(() => this.apply(val, this._martix));
    }

    this._text = val;
  }

  @Input() set martix(val: string[]) {
    if ((this._martix || []).join() !== (val || []).join() ) {
      setTimeout(() => this.apply(this._text, val));
    }

    this._martix = val;

  }

  @Input() set required(value: boolean) {
    this._required = value != null && value !== false && `${value}` !== 'false';
  }

  /**
   * martix 變更時。
   */
  @Output() martixChange = new EventEmitter<string[]>();

  @Output() martixTouched = new EventEmitter<void>();

  public setDisabledState(isDisabled: boolean) {

  }

  public validate() {
    if (this._tokenGroup.valid) {
      return null;
    } else {
      return { sentence: false };
    }
  }

  touched() {
    this.martixTouched.emit();
  }

  /**
   * 取得 martix 裡面每一元素所代表的相關資訊。
   */
  getTokenControls() {
    const arr = this._tokenGroup.get("inputs") as FormArray;
    return arr.controls;
  }

  getStyle(data: TokenData) {

    const base = 100;
    let size = 1;

    if (data.size > 0) {
      size = data.size;
    }

    return {
      width: `${size * base}px`,
      // 在語法中暫不單獨支援 required 的設定。
      // 'border-bottom-color': data.required ? 'red' : 'unset'
    };
  }

  ngOnInit() {
    this._tokenGroup.valueChanges
    .pipe(takeUntil(this._bag)) // 元件 destroy 時 release 資源。
    .subscribe( v => {
      const { inputs }: { inputs: TokenData[] } = v;
      this._martix = inputs.map(t => t.value);
      this.martixChange.emit(this._martix);
    });
  }

  ngOnDestroy() {
    // 產生一個值使得相關 Subscritpion 解除。
    this._bag.next();
    this._bag.complete();
  }

  private apply(text: string, martix: string[]) {

    if (!!text && !!martix) {
      this._tokens = this.srv.apply(text, martix);

      const controls = this._tokens.map(v => this.fb.group(v));
      this._tokenGroup.setControl("inputs", this.fb.array(controls));
    } else {
      this.resetValues();
    }
  }

  private resetValues() {
    const { inputs } = this._tokenGroup.controls;

    for (const ctl of (inputs as FormArray).controls) {
      ctl.patchValue({ value: '' });
    }
  }
}
