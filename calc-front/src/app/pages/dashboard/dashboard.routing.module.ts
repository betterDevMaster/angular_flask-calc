import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashBoardBaseComponent } from './dashboard.base.component';
import { DashBoardIndexComponent } from './index/dashboard.index.component';


const routes: Routes = [
  {
    path: '',
    component: DashBoardBaseComponent,
    children: [ 
      {
        path: '',
        redirectTo : 'index',
        pathMatch : 'full'
      },
      {

        path : 'index',
        component : DashBoardIndexComponent
    }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashBoardRoutingModule {
}
