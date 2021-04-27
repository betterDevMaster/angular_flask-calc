import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module'
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { LoanDetailsBaseComponent } from './loan-details.base.component';
import { LoanDetailsComponent } from './index/loan-details.component';
import { LoanDetailsRoutingModule } from './loan-details.routing.module';
// import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { StressCalculatorService } from 'src/app/_services/stress-calculator/stress-calc.service';

export function chartModule(): any {
  return import('echarts');
}

@NgModule({
  declarations: [LoanDetailsBaseComponent,LoanDetailsComponent],
  imports: [
    SharedModule,
    LoanDetailsRoutingModule,
    FlexLayoutModule,
    MatIconModule,
    NgxEchartsModule.forRoot({
      echarts: chartModule
  }),
    IconModule,
  ],
  providers: [StressCalculatorService]
})
export class LoanDetailsModule {
}
