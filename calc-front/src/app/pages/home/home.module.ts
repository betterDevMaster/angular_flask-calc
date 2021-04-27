import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module'
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    SharedModule,
    HomeRoutingModule,
    FlexLayoutModule,
    MatIconModule,
    IconModule,
  ]
})
export class HomeModule {
}
