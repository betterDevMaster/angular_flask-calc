import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { CountriesComponent, DialogCountry } from './countries.component';
const routes: Routes = [
  {
      path     : '**',  
      component: CountriesComponent
  }
];

@NgModule({
  declarations: [CountriesComponent, DialogCountry],
  entryComponents: [CountriesComponent, DialogCountry],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class CountriesModule { }
