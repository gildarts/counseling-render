import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResearchRoutingModule } from './research-routing.module';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../shared/shared.module';
import { SentenceTestComponent } from './sentence-test/sentence-test.component';
import { RenderModule } from '../render';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QueryTestComponent } from './query-test/query-test.component';

@NgModule({
  declarations: [IndexComponent, SentenceTestComponent, QueryTestComponent],
  imports: [
    CommonModule,
    ResearchRoutingModule,
    SharedModule,
    RenderModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ResearchModule { }
