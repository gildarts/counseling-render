import { Directive, OnInit, HostListener, Optional, Input, OnDestroy, ElementRef } from '@angular/core';
import { ControlContainer, FormArray } from '@angular/forms';
import { RadioGroupDirective } from './radio-group.directive';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: 'input[appRadio]'
})
export class RadioDirective implements OnInit, OnDestroy {

  private _bag = new Subject<void>();

  constructor(
    private radio: ControlContainer, // 只能用在 FormGroup、FormArray。
    private group: RadioGroupDirective,
    private elm: ElementRef<HTMLInputElement>
  ) { }

  @Input() appRadio: string;

  @HostListener('click') click() {
    const { control } = this.group;
    const optionsForm = control.get("Options") as FormArray;

    // 先把所有「AnswerChecked」值更新為 false。
    for (const ctl of optionsForm.controls) {
      const falseValue: any = {};
      falseValue[this.appRadio] = false;
      ctl.patchValue(falseValue);
    }

    // 再把自已的「AnswerChecked」值更新為 true。
    const trueValue: any = {};
    trueValue[this.appRadio] = true;
    this.radio.control.patchValue(trueValue);
  }

  ngOnInit(): void {
    this.radio.control.valueChanges.pipe(
      takeUntil(this._bag)
    )
    .subscribe( v => {
      if (!this.radio.disabled) {
        const val = v[this.appRadio];
        this.elm.nativeElement.checked = val;
      }
    });
  }

  ngOnDestroy(): void {
    this._bag.next();
    this._bag.complete();
  }
}
