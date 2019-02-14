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

  @Input() set required(value: boolean | string) {
    if (this._onChange) {
      this._onChange();
    }
  }

  @Input() set text(val: string) {
    if (this._onChange) {
      this._onChange();
    }
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.component.validate();
  }

  registerOnValidatorChange?(fn: () => void): void {
    this._onChange = fn;
  }
}
