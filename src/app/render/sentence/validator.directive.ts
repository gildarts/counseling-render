import { Directive, StaticProvider, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { SentenceComponent } from './sentence.component';

export const SENTENCE_VALIDATOR: StaticProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SentenceValidatorDirective),
  multi: true
};

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'app-sentence[ngModel][required],app-sentence[formControl][required],app-sentence[formControlName][required]',
  providers: [SENTENCE_VALIDATOR]
})
export class SentenceValidatorDirective implements Validator {

  private _onChange: () => void;

  constructor(
    private component: SentenceComponent
  ) { }

  // 是否為必填(只要是必填所有欄位都要必填)。
  @Input() set required(value: boolean) {

    const req = value != null && value !== false && `${value}` !== 'false';
    this.component.applyRequireConf(req);

    if (this._onChange) {
      this._onChange();
    }
  }

  validate(control: AbstractControl): ValidationErrors {
    if (this.component._tokenGroup.valid) {
      return null;
    } else {
      return { martix: '所有空格都需要填值。' };
    }
  }

  registerOnValidatorChange?(fn: () => void): void {
    this._onChange = fn;
  }

}
