import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module'
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { DashBoardRoutingModule } from './dashboard.routing.module';
import { DashBoardBaseComponent } from './dashboard.base.component';
import { DashBoardIndexComponent } from './index/dashboard.index.component';

@NgModule({
  declarations: [DashBoardBaseComponent,DashBoardIndexComponent],
  imports: [
    SharedModule,
    DashBoardRoutingModule,
    FlexLayoutModule,
    MatIconModule,
    IconModule,
  ]
})
export class DashBoardModule {
}
