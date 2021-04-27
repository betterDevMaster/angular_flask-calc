import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanDetailsComponent } from './index/loan-details.component';
import { LoanDetailsBaseComponent } from './loan-details.base.component';

const routes: Routes = [
  {
    path: '',
    component: LoanDetailsBaseComponent,
    children: [ {
        path : 'details',
        component : LoanDetailsComponent
    }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanDetailsRoutingModule {
}
