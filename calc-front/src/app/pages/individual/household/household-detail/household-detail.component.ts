import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { finalize } from 'rxjs/operators';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import { User } from 'src/static-data/contents';
import { Location } from '@angular/common';
import icInfo from '@iconify/icons-ic/twotone-info';


@Component({
  selector: 'app-household-detail',
  templateUrl: './household-detail.component.html',
  styleUrls: ['./household-detail.component.scss']
})
export class HouseholdDetailComponent implements OnInit {
  @Input() user: User;
  icInfo = icInfo;
  public isProcessing: boolean;
  public isCalculating: boolean;
  public inputCount: number;
  public martial_status: string;
  public householdHeadings = [
    {name: 'income', title: 'Income/Earnings'}, 
    {name: 'insurances', title: 'Insurances'},
    {name: 'expenses', title: 'Expenses'},
    {name: 'other_expenses', title: 'Other expenses'},
    {name: 'mobility', title: 'Mobility'},
    {name: 'existing_assets', title: 'Existing assets'}
  ];
  public householdOutputHeadings = [
    {name: 'sum_income', title: 'Sum income'}, 
    {name: 'sum_expenses', title: 'Sum expenses'},
    {name: 'freely_available', title: 'Freely availabel income'},
    {name: 'sum_other', title: 'Other assets'}
  ];
  public householdOutputs = {
    sum_income: null,
    sum_expenses: null,
    freely_available: null,
    sum_other: null
  }
  public sum_income = null;
  public sum_expenses = null;
  public freely_available = null;
  public sum_other = null;
  public householdInputs = {
    user_id: 0,
    martial_single: false,
    income: [
      {name: 'net', title: 'Net income/net earnings', val:[null, null]}, 
      {name: 'other', title: 'Other income', val:[null, null]},
      {name: 'family', title: 'Family allowances', val:[null, null]},
    ], 
    expenses: [
      {name: 'living_costs', title: 'Living costs', val:[null, null]}, 
      {name: 'service_changes', title: 'Service changes', val:[null, null]},
      {name: 'energy', title: 'Energy(Electricity, power, gas etc...)', val:[null, null]},
      {name: 'tv_radio', title: 'TV, radio', val:[null, null]},
      {name: 'streaming', title: 'Streaming, subscriptions,...', val:[null, null]},
      {name: 'phone', title: 'Phone', val:[null, null]},
      {name: 'internet', title: 'Internet', val:[null, null]}
    ],
    mobility: [
      {name: 'motor_rate', title: 'Motor vehicle leasing rate', val:[null, null]}, 
      {name: 'motor_taxes', title: 'Motor vehicel inisurance inc. taxes', val:[null, null]},
      {name: 'fuel', title: 'Fuel', val:[null, null]},
      {name: 'maintenance', title: 'Maintenance/repair', val:[null, null]},
      {name: 'public_transportation', title: 'Public transportation', val:[null, null]}
    ], 
    insurances: [
      {name: 'life', title: 'Life insurance', val:[null, null]},
      {name: 'household', title: 'Household insurance', val:[null, null]},
      {name: 'accident', title: 'Accident insurance', val:[null, null]},
      {name: 'health', title: 'Health insurance', val:[null, null]}, 
      {name: 'own-occupation', title: 'Own-occupation disability insurance', val:[null, null]}
    ], 
    other_expenses: [
      {name: 'existing', title: 'Existing obligation/loan', val:[null, null]},
      {name: 'recreational', title: 'Recreational expenses', val:[null, null]},
      {name: 'vacation', title: 'Vacation/Holiday', val:[null, null]},
      {name: 'other_household', title: 'Other household expenses', val:[null, null]}, 
      {name: 'other_expenses', title: 'Other expenses', val:[null, null]},
      {name: 'others_1', title: 'Others', val:[null, null]}
    ], 
    existing_assets: [
      {name: 'saving', title: 'Savings bank account', val:[null, null]},
      {name: 'building', title: 'Building loan contract', val:[null, null]},
      {name: 'variable', title: 'Variable universal life insurance', val:[null, null]},
      {name: 'investment', title: 'Investmentfunds', val:[null, null]},
      {name: 'real_estate', title: 'Real estate', val:[null, null]},
    ]
  };
  constructor(
    public objAuth: AuthService,
    public objBack: BackService,
    public objLang: LangService,
    private objNotify: NotificationService,
    public location: Location
  ) { 
    
  }
  ngOnInit() {
    this.initData();
  }
  isEnable(){
    if(!this.objBack.individualStatus.individual){
      this.objNotify.warning('Please check potential on Personal data page.');
      this.location.back();
      return false;
    }
    return true;
  }
  initData(){
    this.inputCount = 0;
    this.isCalculating = true;
    this.objBack.fetchIndividualHousehold(this.user['id'])
      .pipe(
        finalize(() => {
        }))
      .subscribe((apiResponse) => {
        this.isCalculating = false;
        this.martial_status = apiResponse.martial_status;
        if(apiResponse.inputs.length > 0){
          let tempObj = apiResponse.inputs[0];
          for(let key in tempObj)
            this.householdInputs[key] = JSON.parse(tempObj[key]);
          tempObj = apiResponse.household_outputs;
          for(let key in this.householdOutputs)
            this.householdOutputs[key] = tempObj[key];  
        }
        this.householdInputs['martial_single'] = this.martial_status == 'martial_single'?true:false;
      }); 
  }
  initializeSum(){
    this.sum_income = 0;
    this.sum_expenses = 0;
    this.freely_available = 0;
    this.sum_other = 0;
  }
  calSum(){
    let inputCount = ++this.inputCount;
    setTimeout(() => this.calSumEnabled(inputCount),100);
  }
  async calSumEnabled(inputCount: number){
    if(inputCount == this.inputCount){
      console.log('calculation is done');
      this.isCalculating = true;
      try {
        this.objBack.calcHousehold(this.householdInputs)
          .pipe()
          .subscribe((apiResponse) => {
            if(apiResponse.status == 'success'){
              let tempObj = apiResponse;
              for(let key in this.householdOutputs)
                this.householdOutputs[key] = tempObj[key];  
            }
            this.isCalculating = false;
          },
          error => {
            console.log('invalid')
            this.isCalculating = false;
          });
      }
      catch (err) {
        this.isCalculating = false;
      }
    }
  }
  inputChanged(event){
    this.calSum();
  }
  validateHousehold(){
    return true;
  }
  saveInputs(){
    this.objAuth.isProcessing = true;
    this.objAuth.isProcessText = "Saving";
    if(this.validateHousehold()){
      this.householdInputs.user_id = this.user['id'];
      try {
        this.objBack.saveHousehold(this.householdInputs)
          .pipe()
          .subscribe((apiResponse) => {
            if(apiResponse.status == 'success'){
              this.objNotify.success('Saved successfully!');
              this.objBack.individualStatus.household = true;
            }
            else if(apiResponse.status == 'error'){
              this.objNotify.error('Failed saving!');
            }
            this.objAuth.isProcessing = false;
          },
          error => {
            console.log('invalid')
            this.objAuth.isProcessing = false;
          });
      }
      catch (err) {
        this.objAuth.isProcessing = false;
      }
    }
  }
}
