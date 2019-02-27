import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { SentenceTestComponent } from './sentence-test/sentence-test.component';
import { QueryTestComponent } from './query-test/query-test.component';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';
import { CoordinatorTestComponent } from './coordinator-test/coordinator-test.component';
import { LargeAmountComponent } from './large-amount/large-amount.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'sentence', component: SentenceTestComponent },
  { path: 'query', component: QueryTestComponent },
  { path: 'reactive', component: ReactiveFormComponent },
  { path: 'coordinator', component: CoordinatorTestComponent },
  { path: 'large_amount', component: LargeAmountComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResearchRoutingModule { }
