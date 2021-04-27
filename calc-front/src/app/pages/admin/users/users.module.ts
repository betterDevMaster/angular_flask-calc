import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module'
import { UsersComponent } from './users.component';



const routes: Routes = [
  {
      path        : 'overview/:id',
      // loadChildren: './profile/profile.module#ProfileModule'
      loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      data: {
        toolbarShadowEnabled: true
      }
  },
  {
      path     : '**',
      component: UsersComponent
  }
];
@NgModule({
  declarations: [
    UsersComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class UsersModule { }
