import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { SentenceService } from '../dissector.service';
import { TokenData } from '../sentence-dissector';
import { FormBuilder, FormArray, } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/*
example:
<app-sentence
  [disabled]="isDisabled" // 設定 input 的 disabled 狀態。
  [required]="isRequired" // 設定 input 的 required 設定，如果為 true 則所有 input 都需要有值。
  [(ngModel)]="martix"  // 相容 angular 內鍵的 ngModel 用法。
  [text]="sentence"   // 設定 text pattern，例：「請輸入你的名字%TEXT2%」。
  #sentence></app-sentence>

  {{sentence.value}} // 使用 data binding 取得最終純文字，例：「請輸入你的名字聯邦銀行」。
*/

/**
 * 支援 Angular Form 的 ngModel、FormControl 功能。
 */
@Component({
  selector: 'app-sentence',
  templateUrl: './sentence.component.html',
  styleUrls: ['./sentence.component.css']
})
export class SentenceComponent implements OnInit, OnDestroy {

  // 用於 component destroy 時 release 資源。
  _bag = new Subject<void>();

  _text: string; // 飛水：天使（%TEXT3%）、聖天馬（%TEXT1%）、吸血蝙蝠（%RTEXT2%）、龍蝦巨獸（%TEXT%）
  _martix: string[]; // ['', '雪莉、安潔莉娜', '', '露娜', '', '索妮亞', '', '安潔莉娜']

  _tokenGroup = this.fb.group({inputs: new FormArray([])});

  _required = false; // 是否所有欄位都是必填狀態。
  _disabled = false; // 是否停用所有 input。

  constructor(
    private srv: SentenceService, // 用於解析 text 用的服務。
    private fb: FormBuilder // angular 動態表單機制。
  ) { }

  @Input() set text(val: string) {
    if (this._text !== val) {
      // 需要 setTimeout 是因為 angular 內部機制衝突，目前這是暫解。
      setTimeout(() => this.apply(val, this._martix)); // 重新產生畫面。
    }

    this._text = val;
  }

  // 這個屬性也有可能透過 value accessor directive 寫入。
  @Input() set martix(val: string[]) {
    if ((this._martix || []).join() !== (val || []).join() ) {
      // 需要 setTimeout 是因為 angular 內部機制衝突，目前這是暫解。
      setTimeout(() => this.apply(this._text, val)); // 重新產生畫面。
    }

    this._martix = val;
  }

  /**
   * martix 變更時。
   */
  @Output() martixChange = new EventEmitter<string[]>();

  // 用於任何 input 被 touch 引發，通知外部程式已被 touch。
  _martixTouched = new EventEmitter<void>();

  /**
   * 取得最後產出的文字。
   */
  public get value() {
    const val = this._tokenGroup.value.inputs as TokenData[];
    return this.srv.join(val);
  }

  /** 判斷是否填寫完整，若%RTEXT%項目留空=false */
  public get completed() {
    const tokens = this._tokenGroup.value.inputs as TokenData[];

    for (const token of tokens) {
      if (token.type === 'keyword' && !!!token.value) {
        return false;
      }
    }

    return true;
  }

  public _setRequired(required: boolean) {
    // 內部所有產生出來的 input 都會 binding 這個屬性。
    this._required = required;
  }

  // 用於 value accessor directive 呼叫，啟用或停用所有 input。
  public _setDisabledState(isDisabled: boolean) {
    this._disabled = isDisabled;
    this.setDisabled(this._disabled);
  }

  // input blur 事件呼叫，引發事件通知 value accessor directive 此 control 已被 touch。
  _touched() {
    this._martixTouched.emit();
  }

  /**
   * 取得 martix 裡面每一元素所代表的相關資訊。
   */
  _getTokenControls() {
    const arr = this._tokenGroup.get("inputs") as FormArray;
    return arr.controls;
  }

  // 產生畫面時取得相應的樣式(寬度)。
  _getStyle(data: TokenData) {

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
      const tokens = this.srv.apply(text, martix);
      const controls = tokens.map(v => this.fb.group(v));

      this._tokenGroup.setControl("inputs", this.fb.array(controls));
    } else {
      this.resetValues();
    }

    this.setDisabled(this._disabled);
  }

  private setDisabled(disabled: boolean) {
    for (const ctl of this._getTokenControls()) {

      if (disabled) {
        ctl.disable();
      } else {
        ctl.enable();
      }

    }
  }

  private resetValues() {
    const { inputs } = this._tokenGroup.controls;

    for (const ctl of (inputs as FormArray).controls) {
      ctl.patchValue({ value: '' });
    }
  }
}
