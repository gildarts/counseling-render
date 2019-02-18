import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentenceComponent } from './sentence/sentence.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SentenceValueAccessorDirective } from './sentence/value-accessor.directive';
import { SentenceValidatorDirective } from './sentence/validator.directive';
import { QueryFormComponent } from './query-form/query-form.component';

@NgModule({
  declarations: [SentenceComponent,
    SentenceValueAccessorDirective,
    SentenceValidatorDirective,
    QueryFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    SentenceComponent,
    QueryFormComponent,
    SentenceValueAccessorDirective,
    SentenceValidatorDirective,
  ]
})
export class RenderModule { }
