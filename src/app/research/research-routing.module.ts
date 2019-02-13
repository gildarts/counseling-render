import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { SentenceTestComponent } from './sentence-test/sentence-test.component';

const routes: Routes = [
  {path: '', component: IndexComponent},
  { path: 'sentence', component: SentenceTestComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResearchRoutingModule { }
