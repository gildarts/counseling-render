import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResearchRoutingModule } from './research-routing.module';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../shared/shared.module';
import { SentenceTestComponent } from './sentence-test/sentence-test.component';
import { RenderModule } from '../render';

@NgModule({
  declarations: [IndexComponent, SentenceTestComponent],
  imports: [
    CommonModule,
    ResearchRoutingModule,
    SharedModule,
    RenderModule
  ]
})
export class ResearchModule { }
