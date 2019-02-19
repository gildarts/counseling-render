import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentenceComponent } from './sentence/sentence.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SentenceValueAccessorDirective } from './sentence/value-accessor.directive';
import { SentenceValidatorDirective } from './sentence/validator.directive';
import { QueryFormComponent } from './query-form/query-form.component';
import { RadioGroupDirective } from './query-form/radio-group.directive';
import { RadioDirective } from './query-form/radio.directive';
import { QueryFormValueAccessorDirective } from './query-form/value-accessor.directive';

@NgModule({
  declarations: [
    SentenceComponent,
    SentenceValueAccessorDirective,
    SentenceValidatorDirective,
    QueryFormComponent,
    RadioGroupDirective,
    RadioDirective,
    QueryFormValueAccessorDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    SentenceComponent,
    SentenceValueAccessorDirective,
    SentenceValidatorDirective,
    QueryFormComponent,
    QueryFormValueAccessorDirective,
  ]
})
export class RenderModule { }
