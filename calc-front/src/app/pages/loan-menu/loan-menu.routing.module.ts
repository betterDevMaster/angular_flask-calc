import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanDetailsBaseComponent } from '../loan-details/loan-details.base.component';
import { LoanMenuComponent } from './index/loan-menu.component';
import { LoanMenuBaseComponent } from './loan-menu.base.component';

const routes: Routes = [
  {
    path: '',
    component: LoanMenuBaseComponent,
    children: [ {
        path : 'index',
        component : LoanMenuComponent
    }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanMenuRoutingModule {
}
