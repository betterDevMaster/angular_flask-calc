import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
// import { ContentDetailComponent } from './content-detail.component';
// const routes: Routes = [
//   {
//       path     : '**',
//       component: ContentDetailComponent
//   }
// ];
@NgModule({
  // declarations: [ContentDetailComponent],
  imports: [
    // RouterModule.forChild(routes),
    SharedModule
  ]
})
export class ContentModule { }
