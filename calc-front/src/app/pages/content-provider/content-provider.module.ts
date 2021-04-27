import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { ContentProviderComponent } from './content-provider.component';
// import { ContentComponent } from './content/content.component';
const routes: Routes = [
  {
      path     : '**',
      component: ContentProviderComponent
  }
];
@NgModule({
  declarations: [ContentProviderComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class ContentProviderModule { }
