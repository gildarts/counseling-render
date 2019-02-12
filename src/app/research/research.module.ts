import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResearchRoutingModule } from './research-routing.module';
import { IndexComponent } from './index/index.component';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    ResearchRoutingModule
  ]
})
export class ResearchModule { }
