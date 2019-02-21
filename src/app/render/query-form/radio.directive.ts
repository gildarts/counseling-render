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

  /** 對應要更新的欄位名稱。 */
  @Input() appRadio: string;

  @Input() optionCode: string;

  @HostListener('click') click() {
    const { formGroup: control } = this.group;
    const question = control.value;

    for (const option of question.Options) {
      if (option["OptionCode"] === this.optionCode) {
        option[this.appRadio] = true;
      } else {
        option[this.appRadio] = false;
      }
    }
    control.patchValue(question);
  }

  ngOnInit(): void {

    // 第一次設值。
    this.setChecked(this.radio.control.value);

    this.radio.control.valueChanges.pipe(
      takeUntil(this._bag)
    )
      .subscribe(v => {
        this.setChecked(v); // 值有變化時。
      });
  }

  ngOnDestroy(): void {
    this._bag.next();
    this._bag.complete();
  }

  setChecked(option: any) {
    const val = option[this.appRadio];
    this.elm.nativeElement.checked = val;
  }
}
