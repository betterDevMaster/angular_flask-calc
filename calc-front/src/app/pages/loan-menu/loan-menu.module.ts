import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module'
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { LoanMenuBaseComponent } from './loan-menu.base.component';
import { LoanMenuComponent } from './index/loan-menu.component';
import { LoanMenuRoutingModule } from './loan-menu.routing.module';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [LoanMenuBaseComponent,LoanMenuComponent],
  imports: [
    SharedModule,
    LoanMenuRoutingModule,
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    NgxEchartsModule.forRoot({
      echarts
    }),
    IconModule,
  ],
})
export class LoanMenuModule {
}
