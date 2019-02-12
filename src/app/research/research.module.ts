import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResearchRoutingModule } from './research-routing.module';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    ResearchRoutingModule,
    SharedModule
  ]
})
export class ResearchModule { }
