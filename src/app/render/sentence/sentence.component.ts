import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, NgZone } from '@angular/core';
import { SentenceService } from '../dissector.service';
import { TokenData } from '../sentence-dissector';
import { FormBuilder, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sentence',
  templateUrl: './sentence.component.html',
  styleUrls: ['./sentence.component.css']
})
export class SentenceComponent implements OnInit, OnDestroy {

  _bag = new Subject<void>(); // release resource usage.

  _text: string;
  _martix: string[];
  _tokens: TokenData[];

  _tokenGroup = this.fb.group({inputs: new FormArray([])});

  constructor(
    private srv: SentenceService,
    private fb: FormBuilder,
    private zone: NgZone
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

  @Output() martixChange = new EventEmitter<string[]>();

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
      'border-bottom-color': data.required ? 'red' : 'unset'
    };
  }

  ngOnInit() {
    this._tokenGroup.valueChanges
    .pipe(takeUntil(this._bag))
    .subscribe( v => {
      const { inputs }: { inputs: TokenData[] } = v;
      this._martix = inputs.map(t => t.value);
      this.martixChange.emit(this._martix);
    });
  }

  ngOnDestroy() {
    this._bag.next();
    this._bag.complete();
  }

  private apply(text: string, martix: string[]) {

    if (!!text && !!martix) {
      this._tokens = this.srv.apply(text, martix);

      const controls = this._tokens.map(v => this.fb.group(v));
      this._tokenGroup.setControl("inputs", this.fb.array(controls));
    }
  }
}
