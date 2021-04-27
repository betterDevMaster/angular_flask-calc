import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as echarts from 'echarts';
import icDelete from '@iconify/icons-ic/delete';
import { StressCalcRes, StressBasis, StressCalculatorService } from 'src/app/_services/stress-calculator/stress-calc.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ConcatSource } from 'webpack-sources';
import { User, UserEmpty } from "src/static-data/contents";
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import icCalc from '@iconify/icons-fa-solid/calculator';
import theme from 'src/@vex/utils/tailwindcss';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
import { LangService } from 'src/app/utils/services/language/language.service';
export class NewStress {
  constructor(
  )
  {
    this.interest = -2;
    
  }
  id: number;
  interest: number;
  start: any;
  end: string;
  remarks: string;
  rates: any;
  high: number;
  low: number;
}

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss'],
  animations: [
    scaleIn400ms,
    fadeInRight400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ]
})
export class LoanDetailsComponent implements OnInit {
  theme = theme;
  icCalc = icCalc;
  icDelete = icDelete;
  userId = 1;
  user: User;
  stressCurrentData = new StressCalcRes();
  stressBasisData = new StressBasis();
  stressReqData: StressCalcRes[] = [];
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  interestPercentages: number[] = [];
  linBarchartOptions;
  linBarchartOptions1;
  pieChartOptions;
  oldScenarios = [];
  interestStep = 0.5;
  repayStep = 200;
  interestData: number[] = [];
  horizonYears: number[] = [];
  interestMax = 2.5;
  repaymentMax = 1400;
  interestMin = 2.5;
  repaymentMin = 1400;
  // stressRemarks: boolean;
  repayData: number[] = [];
  
  // horizon: 35;
  // remainingHorizon = 14;
  // lendingRate = 0.575;
  // currentRepayment = 1317.69;

  constructor(
    private objStressCalcService: StressCalculatorService,
    public objBack: BackService,
    public objAuth: AuthService,
    private objNotify: NotificationService,
    public objLang: LangService


    ) {
    for (let index = -2; index < 6; index += 0.1) {
      this.interestPercentages.push(parseFloat(index.toFixed(1)))
    }
  }
  

  ngOnInit(): void {
    // init chart
    // this.initChart();
    this.user=this.objAuth.isLoggedIn?this.objAuth.user:UserEmpty;
    this.setRepaymentHistoryOptions();
    this.setRepaymentPieOptions();
    this.getScenarios(this.user.id);    
  }
  initChart(){

    // initialize chart
    // this.interestMax = this.setMaxY(this.lendingRate, this.interestStep);
    // this.repaymentMax = this.setMaxY(this.currentRepayment, this.repayStep);

    // intialize interest rates and repayment rates
    // let tempYear = this.currentYear;
    // for(let i=0; i<=this.remainingHorizon; i++){
    //   this.horizonYears.push(tempYear);
    //   this.interestData.push(this.lendingRate);
    //   this.repayData.push(this.currentRepayment);
    //   tempYear++;
    // }
  }

  getScenarios(userId){
    try {
      this.objBack.fetchScenarios(userId)
        .pipe(
          finalize(() => {
          }))
        .subscribe((apiResponse) => {
          this.objAuth.isProcessing = false;
          this.stressBasisData = {
            'remainingsp': apiResponse.remainingsp,
            'remaininghorizon': apiResponse.remaininghorizon,
            'lendingrate': apiResponse.lendingrate,
            'sp': apiResponse.sp,
            'horizon': apiResponse.horizon,
            'repaymentregular': apiResponse.repaymentregular.toFixed(2)
          }
          // --- check if the user calculated before
          if(apiResponse.oldScenarios.length > 0){
            apiResponse.oldScenarios.forEach(scenario => {
              this.stressReqData.push({
                id: scenario.id,
                userId: scenario.userId,
                startDate: scenario.startDate,
                endDate: scenario.endDate,
                interest: scenario.interest,
                rates: JSON.parse(scenario.rates),
                high: scenario.high,
                low: scenario.low,
                totalAddition: scenario.totalAddition,
                annuity: scenario.annuity,
                remarks: `€ ${scenario.high} - € ${scenario.low}`,
              });
            });
            // --- set first scenario as current data
            this.stressCurrentData = this.stressReqData[0];
          }
          else{
            let rates = [];
            for(let i=0; i<=this.stressBasisData.remaininghorizon; i++){
              rates.push(this.stressBasisData.repaymentregular);
            }
            this.stressCurrentData = {
              id: 0,
              userId: this.user.id,
              startDate: '2021-01-01',
              endDate: '2025-01-01',
              interest: this.stressBasisData.lendingrate,
              rates: rates,
              high: apiResponse.repaymentregular,
              low: apiResponse.repaymentregular,
              totalAddition: 0,
              annuity: 0,
              remarks: ``
            }
          }
          // --- update chart
          this.setRepaymentSimulationOptions(this.stressCurrentData);
        });
    }
    catch (err) {
      this.objAuth.isProcessing = false;
    }
  }

  setRepaymentSimulationOptions(stressData: any): void {
    let tempYear = this.currentYear;
    let startYear = Number(stressData.startDate.split('-')[0]);
    let endYear = Number(stressData.endDate.split('-')[0]);
    // --- set yAxis max
    let interestHigh = this.stressBasisData.lendingrate;
    let interestLow = this.stressBasisData.lendingrate;
    let repaymentHigh = this.stressBasisData.repaymentregular;
    let repaymentLow = this.stressBasisData.repaymentregular;
    let totaladdition = 0;
    for(let i=0; i<this.stressReqData.length; i++){
      repaymentHigh = repaymentHigh<this.stressReqData[i].high?this.stressReqData[i].high:repaymentHigh;
      repaymentLow = repaymentLow>this.stressReqData[i].low?this.stressReqData[i].low:repaymentLow;
      interestHigh = interestHigh<this.stressReqData[i].interest?this.stressReqData[i].interest:interestHigh;
      interestLow = interestLow>this.stressReqData[i].interest?this.stressReqData[i].interest:interestLow;
      totaladdition += this.stressReqData[i].totalAddition;
    }
    this.stressCurrentData.totalAddition = Number(totaladdition.toFixed(2));
    this.interestMax = this.setMaxY(interestHigh, this.interestStep);
    this.repaymentMax = this.setMaxY(repaymentHigh, this.repayStep);
    this.interestMin = this.setMinY(interestLow, this.interestStep);
    this.repaymentMin = this.setMinY(repaymentLow, this.repayStep);

    this.horizonYears = [];
    this.interestData = [];
    // --- set interst rate array
    for(let i=0; i<this.stressBasisData.remaininghorizon; i++){
      this.horizonYears.push(tempYear);
      if(tempYear>=startYear && tempYear<endYear)
        this.interestData.push(stressData.interest);
      else
        this.interestData.push(this.stressBasisData.lendingrate);
      tempYear++;
    }

    // collect rates
    let rates = [];
    for(let i=0; i<this.stressBasisData.remaininghorizon;i++){
      rates[i] = this.stressBasisData.repaymentregular;
    }
    for(let i=0; i<this.stressReqData.length; i++){
      let startYearTemp = Number(this.stressReqData[i].startDate.split('-')[0]);
      let endYearTemp = Number(this.stressReqData[i].endDate.split('-')[0]);
      let startYearOffset = startYearTemp - this.currentYear;
      let endYearOffset = endYearTemp - this.currentYear;
      for(let j=startYearOffset;j<endYearOffset;j++){
        this.interestData[j] = this.stressReqData[i].interest;
        rates[j] = this.stressReqData[i].rates[j];
      }
    }
    // get total addtion

    this.linBarchartOptions1 = {
      title: {
        text: 'Interest Rate Change - Repayment Rate Simulation',
        left: 'center',

        textStyle: {
          color: '#fff',
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          },
          textStyle: {
            color: 'red'
          }
        }
      },
      legend: {
        bottom: 10,
        left: 'center',
        data: ['Repayment rate', 'Lending rate'],
        textStyle: {
          color: 'white',
        }
      },
      grid: {
        backgroundColor: 'hsl(11deg 1% 15% / 90%)',
        show: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.horizonYears,
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            textStyle: {
              color: "white"
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Lending rate',
          color: 'red',
          min: this.interestMin,
          max: this.interestMax,
          interval: 0.5,
          axisLabel: {
            formatter: '{value}%',
            textStyle: {
              color: "white"
            }
          },
          nameTextStyle: {
            color: '#fff',
          },
        },
        {
          type: 'value',
          name: 'Repayment rate',
          splitLine: {
            show: false
          },
          min: this.repaymentMax,
          max: this.repaymentMax,
          interval: 200,
          axisLabel: {
            formatter: '€{value}',
            textStyle: {
              color: "white"
            }
          },
          nameTextStyle: {
            color: '#fff',
          }
        }
      ],
      series: [
        {
          name: 'Lending rate',
          type: 'line',
          yAxisIndex: 0,
          data: this.interestData
        },
        {
          name: 'Repayment rate',
          type: 'bar',
          barWidth: '20%',
          yAxisIndex: 1,
          itemStyle: { color: '#f5811f'},
          data: rates
        }
      ]
    };
  }
  
  clearChart(): void {
    this.repayData = []; // orange bar
    this.interestData = []; // blue line
  }

  
  checkValidStress(f, t, c)
  {
    var dateFrom = f;
    var dateTo = t;
    var dateCheck = c;

    var d1 = dateFrom.split("-");
    var d2 = dateTo.split("-");
    var c = dateCheck.split("-");

    var from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
    var to   = new Date(d2[0], parseInt(d2[1])-1, d2[2]);
    var check = new Date(c[0], parseInt(c[1])-1, c[2]);

    return (check >= from && check <= to)
  }
  gfg_Run(from, to, check) {
    const D1 = new Date(from);
    const D2 = new Date(to);
    const D3 = new Date(check);

    if (D3.getTime() <= D2.getTime()
      && D3.getTime() >= D1.getTime()) {
      return true;
    } else {
      return false;
    }
  }

  stressCalculate(index: number): void {
    this.stressReqData[index].remarks = null;
    let calcIndex = this.stressReqData[index];
    let startYear = Number(calcIndex.startDate.split('-')[0]);
    let endYear = Number(calcIndex.endDate.split('-')[0]);
    let tempYear = this.currentYear;

    // exception
    if(startYear >= endYear)
    {
      calcIndex.remarks = "Error.";
      this.objNotify.error('End year should be bigger than start year!');
      return;
    }
    for(let i=0;i<this.stressReqData.length;i++){
      let startYearBefore = Number(this.stressReqData[i].startDate.split('-')[0]);
      let endYearBefore = Number(this.stressReqData[i].endDate.split('-')[0]);
      if(calcIndex.id != this.stressReqData[i].id && ((startYear >= startYearBefore && startYear < endYearBefore)|| (startYear < startYearBefore && endYear > startYearBefore))){
        calcIndex.remarks = "Stress Scenarios are duplicated.";
      this.objNotify.error("You can't set two stress scenarios on the same time! Please change start and end.");

        return;
      }
    }
    // clear chart
    this.clearChart();

    // set interst rate array
    for(let i=0; i<=this.stressBasisData.remaininghorizon; i++){
      if(tempYear>=startYear && tempYear<=endYear)
        this.interestData.push(calcIndex.interest);
      else
        this.interestData.push(this.stressBasisData.lendingrate);
      tempYear++;
    }

    this.objBack.calcStressScenario(calcIndex)
      .subscribe((resp) => {
        // set max interest and repayment rate
        this.interestMax = this.setMaxY(calcIndex.interest, this.interestStep);
        this.repaymentMax = this.setMaxY(resp.high, this.repayStep);
        // get repayment rates array
        this.repayData = resp.rates;
        this.stressCurrentData = {
          id: resp.scenario_id,
          userId: this.user.id,
          startDate: calcIndex.startDate,
          endDate: calcIndex.endDate,
          interest: calcIndex.interest,
          rates: resp.rates,
          high: resp.high,
          low: resp.low,
          totalAddition: resp.totaladdition,
          annuity: resp.annuity,
          remarks: `€ ${resp.high} - € ${resp.low}`
        }
        this.stressReqData[index] = this.stressCurrentData;
        // update chart
        this.setRepaymentSimulationOptions(this.stressCurrentData);
        // calcIndex.remarks = `€ ${resp.high} - € ${resp.low}`;
      });
  }
  setMaxY(rate, step){
    return Math.floor(rate/step + 2)*step;
  }
  setMinY(rate, step){
    return Math.floor(rate/step - 2)*step;
  }
  removeByIndex(index: number): void {
    if(this.stressReqData[index].id == 0){
      this.stressReqData.splice(index, 1);
    }else{
      this.objBack.deleteStressScenario(this.stressReqData[index].id)
        .subscribe((resp) => {
          // set max interest and repayment rate
          this.stressReqData.splice(index, 1);
          // update chart
          if(this.stressReqData.length > 0){
            this.stressCurrentData = this.stressReqData[index-1];
          }
          else{
            let rates = [];
            for(let i=0; i<=this.stressBasisData.remaininghorizon; i++){
              rates.push(this.stressBasisData.repaymentregular);
            }
            this.stressCurrentData = {
              id: 0,
              userId: this.user.id,
              startDate: '2021-01-01',
              endDate: '2025-01-01',
              interest: this.stressBasisData.lendingrate,
              rates: rates,
              high: this.stressBasisData.repaymentregular,
              low: this.stressBasisData.repaymentregular,
              totalAddition: 0,
              annuity: 0,
              remarks: ``
            }
          }
          this.setRepaymentSimulationOptions(this.stressCurrentData);
        });
    }
    
  }

  appendStress(): void {
    if (this.stressReqData.length < 5) {
      this.stressReqData.push({
        id: 0,
        userId: this.user.id,
        interest: 2,
        startDate: '2024-01-01',
        endDate: '2027-01-01',
        remarks: null,
        rates: [],
        high: 0,
        low: 0,
        totalAddition: 0,
        annuity: 0
      });
    }
  }

  trackById(index: number): number {
    return index
  }

  


  setRepaymentPieOptions(): void {
    this.pieChartOptions = {
      title: {
        text: 'Repayment Rate',
        left: 'center',
        textStyle: {
          color: '#fff',
        }
      },
      tooltip: {
        trigger: 'item',
      },
      grid: {

        backgroundColor: 'hsl(11deg 1% 15% / 90%)',
        show: true

      },
      legend: {
        bottom: 10,
        left: 'center',
        data: ['Repaid', 'Outstanding'],
        textStyle: {
          color: 'white',
        }
      },
      series: [
        {
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          selectedMode: 'single',

          data: [

            { value: 1035, name: 'Repaid', itemStyle: { color: '#f5811f' }, },
            { value: 50, name: 'Outstanding' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  setRepaymentHistoryOptions(): void {
    this.linBarchartOptions = {
      title: {
        text: 'Repayment History',
        left: 'center',

        textStyle: {
          color: '#fff',
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          },
          textStyle: {
            color: 'red'
          }
        }
      },
      legend: {
        bottom: 10,
        left: 'center',
        data: ['Repayment rate', 'Lending rate'],
        textStyle: {
          color: 'white',
        }
      },
      grid: {

        backgroundColor: 'hsl(11deg 1% 15% / 90%)',
        show: true

      },
      xAxis: [
        {
          type: 'category',
          data: ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'],
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            textStyle: {
              color: "white"
            }
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Lending rate',
          color: 'red',
          min: 0,
          max: 1,
          interval: 0.2,
          axisLabel: {
            formatter: '{value}%',
            textStyle: {
              color: "white"
            }
          },
          nameTextStyle: {
            color: '#fff',
          }
        },
        {
          type: 'value',
          name: 'Repayment rate',
          min: 0,
          max: 600,
          interval: 100,
          splitLine:{
            show:false
          },
          axisLabel: {
            formatter: '€{value}',
            textStyle: {
              color: "white"
            }
          },
          nameTextStyle: {
            color: '#fff',
          }
        }
      ],
      series: [
        {
          name: 'Lending rate',
          type: 'line',
          yAxisIndex: 0,
          data: [0.57, 0.57, 0.57, 0.45, 0.45, 0.45, 0.57, 0.57, 0.57, 0.57]
        },
        {
          name: 'Repayment rate',
          type: 'bar',
          yAxisIndex: 1,
          barWidth: '20%',
          itemStyle: { color: '#f5811f' },
          data: [520, 520, 520, 430, 430, 430, 520, 520, 520, 520]
        }
      ]
    };
  }

}
