import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentenceComponent } from './sentence/sentence.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SentenceDirective } from './sentence/sentence.directive';

@NgModule({
  declarations: [SentenceComponent, SentenceDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    SentenceComponent,
    SentenceDirective
  ]
})
export class RenderModule { }
