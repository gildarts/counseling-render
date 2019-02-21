import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { NgControl, ControlContainer } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** 負責處理 AnswerMartix 變更時，將 radio、checkbox 勾選。 */
@Directive({
  selector: 'input[appAutoCheck]'
})
export class AutoCheckDirective implements OnInit, OnDestroy {

  private _bag = new Subject<void>();

  constructor(
    private optionGroup: ControlContainer,
    private elm: ElementRef<HTMLInputElement>
  ) { }

  ngOnInit(): void {
    const { control } = this.optionGroup;

    // 只處理 AnswerMartix 變更才進行 checked。
    control.get("AnswerMatrix").valueChanges.pipe(
      takeUntil(this._bag)
    ).subscribe(v => {
      // 沒有 checked 才執行 click 事件。
      if (!this.elm.nativeElement.checked) {
        // 這會使 question 引發第二次事件
        // 一次是「AnswerMartix」引起，一次是「AnswerChecked」引起。
        this.elm.nativeElement.click();
      }
    });
  }

  ngOnDestroy(): void {
    this._bag.next();
    this._bag.complete();
  }
}
