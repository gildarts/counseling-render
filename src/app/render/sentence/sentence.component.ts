import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { SentenceService } from '../dissector.service';
import { TokenData, SentenceDissector } from '../sentence-dissector';
import { FormBuilder, FormArray, Validators, } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isEqual } from 'lodash';

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
export class SentenceComponent implements OnInit, OnDestroy, OnChanges {

  // 用於 component destroy 時 release 資源。
  private _bag = new Subject<void>();

  _tokenGroup = this.fb.group({inputs: new FormArray([])});
  _required = false; // 是否所有欄位都是必填狀態。

  // private _text: string; // 飛水：天使（%TEXT3%）、聖天馬（%TEXT1%）、吸血蝙蝠（%RTEXT2%）、龍蝦巨獸（%TEXT%）
  // private _martix: string[]; // ['', '雪莉、安潔莉娜', '', '露娜', '', '索妮亞', '', '安潔莉娜']

  public _disabled = false; // 是否停用所有 input。
  private _dissector: SentenceDissector;
  private _ui_dirty = false; // 代表畫面需要更新。
  // private _tokens: TokenData[] = [];

  constructor(
    private srv: SentenceService, // 用於解析 text 用的服務。
    private fb: FormBuilder // angular 動態表單機制。
  ) { }

  @Input() text: string;

  // 這個屬性也有可能透過 value accessor directive 寫入。
  @Input() martix: string[];

  /**
   * martix 變更時。
   */
  @Output() martixChange = new EventEmitter<string[]>();

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

  // 用於任何 input 被 touch 引發，通知外部程式已被 touch。
  _martixTouched = new EventEmitter<void>();

  public applyRequireConf(required: boolean) {
    // 內部所有產生出來的 input 都會 binding 這個屬性。
    this._required = required;
    this.setUIDirty();
    this.applyChanges();
  }

  // 用於 value accessor directive 呼叫，啟用或停用所有 input。
  public _setDisabledState(isDisabled: boolean) {
    this._disabled = isDisabled;
    this.setDisabled(this._disabled);
  }

  public setUIDirty() {
    this._ui_dirty = true;
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
    return (arr || { controls: [] }).controls;
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
      .subscribe(v => {
        // 變更 disable 狀態時，會引發此事件，我不確定是 bug 還是本來就這樣，但會造成怪怪現像。
        if (!this._tokenGroup.disabled) {
          const { inputs }: { inputs: TokenData[] } = v;
          const newMartix = inputs.map(t => t.value);

          if (!isEqual(this.martix, newMartix)) {
            this.martix = newMartix;
            this.martixChange.emit(this.martix);
          }

        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.text) {
      const { previousValue, currentValue } = changes.text;

      if (previousValue !== currentValue) {
        if (!currentValue) {
          this._dissector = null;
        } else {
          this._dissector = this.srv.create(currentValue);
        }
        this.setUIDirty();
      }
    }

    if (changes.martix) {
      const { previousValue, currentValue } = changes.martix;

      if (!isEqual(previousValue, currentValue)) {
        if (!currentValue) {
          this.resetValues();
        } else {
          this.setUIDirty();
        }
      }
    }

    this.applyChanges();
  }

  applyChanges() {

    if (this._ui_dirty && this._dissector && this.martix) {
      const tokens = this._dissector.applyMartix(this.martix);
      const controls = tokens.map(v => {
        if (v.type === "keyword" && this._required) {
          const g = { ...v, value: [v.value, Validators.required] };
          return this.fb.group(g);
        } else {
          return this.fb.group(v);
        }
      });

      this._tokenGroup.setControl("inputs", this.fb.array(controls));

      this.setDisabled(this._disabled);
      this._ui_dirty = false;
    }

  }

  private setDisabled(disabled: boolean) {

    if (disabled) {
        this._tokenGroup.disable();
      } else {
        this._tokenGroup.enable();
      }
  }

  public resetValues() {
    const { inputs } = this._tokenGroup.controls;

    for (const ctl of ((inputs || { controls: [] }) as FormArray).controls) {
      ctl.patchValue({ value: '' });
    }
  }

  ngOnDestroy() {
    // 產生一個值使相關 Subscritpion 解除。
    this._bag.next();
    this._bag.complete();
  }
}
