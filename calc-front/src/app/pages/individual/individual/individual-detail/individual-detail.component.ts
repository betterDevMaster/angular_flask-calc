import { Component, OnInit, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { Location } from '@angular/common';
import { ContentsProvider, User } from "src/static-data/contents";
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import icInfo from '@iconify/icons-ic/twotone-info';
@Component({
  selector: 'app-individual-detail',
  templateUrl: './individual-detail.component.html',
  styleUrls: ['./individual-detail.component.scss']
})
export class IndividualDetailComponent implements OnInit {
  @Input() user:User;
  icInfo = icInfo;
  constructor(
    public objAuth: AuthService,
    public objBack: BackService,
    public objLang: LangService,
    private location: Location,
    private objNotify: NotificationService
  ) { }
  public isLocalInputs = false;
  public individualHeaders = [];
  public contentNames = [];
  public contentHeaders: any;
  public contentElements: any;
  public contentOptions: any;
  public countryOptions = [];
  public basisInputs = {};
  public individualInputs = {
    user_id: 0,
    martial_status: ["martial_single", "martial_single"],
    age: [20, 22],
    net_income: [15000, 2000],
    highest_degree: ["highest_compulsory", "highest_compulsory"],
    field_work: ["field_banking", "field_banking"],
    job_position: ["job_employed", "job_employed"],
    kids: [0, 0],
    address: {'street': '', 'nr': '', 'zipcode': '', 'city': '', 'country': 0},
    own_funds: {'accepted': false, 'sum': 2000},
    guarantor: {'accepted': false, 'sum': 1000}
  }
  public generalMsg = '';
  public attractiveMsg = ''
  public isSingle: Boolean;
  public options = {};
  public address = {};
  public isResult: Boolean;
  public guarantorOptions = [{name: 'yes', value: true},{name: 'no', value: false}];
  public generalResult = {
    financing_not_enough: {
      outerStrokeColor: '#fca103',
      percent: '10'
    },
    criteria_ok_but: {
      outerStrokeColor: '#5c77ff',
      percent: '50'
    },
    financing_criteria_good: {
      outerStrokeColor: '#78C000',
      percent: '100'
    }
  }
  public attractiveResult = {
    financing_not_enough: {
      outerStrokeColor: '#fca103',
      percent: '10'
    },
    financing_attractive_sufficient: {
      outerStrokeColor: '#fca103',
      percent: '10'
    },
    financiing_attractive: {
      outerStrokeColor: '#5c77ff',
      percent: '50'
    },
    financing_attractive_very: {
      outerStrokeColor: '#78C000',
      percent: '100'
    }
  }
  ngOnInit() {
    this.isResult = false;
    this.isSingle = false;
    this.initData();
  }

  async initData() {
    if(this.isEnable()){
      let tempArr = [];
      this.contentNames = ContentsProvider.filter(name => name.page == 'individual');
      this.contentHeaders = this.contentNames.filter(name => name.level == 1);
      this.contentElements = this.contentNames.filter(name => name.level ==2);
      
      // get options of each input
      this.contentHeaders.forEach(header => {
        tempArr = this.contentElements.filter(name => name.parent_id == header.id);
        this.options[header.name] = tempArr; 
      });

      // Check if the user logged in
      if(this.objAuth.isLoggedIn)
        this.initNonPulbic();
      else
        this.initPublic();
    }
  }
  printIndividual(outputs){
    if(outputs.status == 'success'){
      this.isResult = true;
      this.generalMsg = outputs.general_result;
      this.attractiveMsg = outputs.attractive_result;  
      console.log('result');
      console.log(this.generalMsg);
      console.log(this.attractiveMsg);          
    }
    else if(outputs.status == 'error'){
      this.isResult = false;
      this.objNotify.error('Based on your entries is no calculation possible!');
    }
  }
  isEnable(){
    if((this.objAuth.isLoggedIn && !this.objBack.individualStatus['basis']) || (!this.objAuth.isLoggedIn && localStorage.getItem('localForIndi')==null)){
      this.objNotify.warning('Please analyse potential on Loan data page.');
      this.location.back();
      return false;
    }
    return true;
  }
  async initNonPulbic(){
    // this.objAuth.isProcessing = true;
    this.objAuth.isProcessText = '';
    this.individualInputs.user_id = this.user['id'];
    try {
      this.objBack.fetchIndividualIndividual(this.user['id'])
        .pipe(
          finalize(() => {
          }))
        .subscribe((apiResponse) => {
          this.objAuth.isProcessing = false;
          let tempObj;
          switch(apiResponse.status){
            case 'success':
              tempObj = apiResponse.individual_data;
              for(let key in tempObj){
                this.individualInputs[key] = tempObj[key];  
              }
              this.printIndividual(apiResponse.individual_outputs);
              break;
            case 'empty_inputs':
              tempObj = apiResponse.individual_data;
              for(let key in tempObj){
                this.individualInputs[key] = tempObj[key];  
              }
              break;
            case 'error':
              this.objNotify.error(apiResponse.msg);
              this.objAuth.goPage('/individual/basis');
              break;
          }
        });
    }
    catch (err) {
      this.objAuth.isProcessing = false;
    }
  }
  async initPublic(){
    // get pr from the local storage
    if(localStorage.getItem('localForIndi')==null){
      this.objNotify.warning('You need to calculate the payment rate on basis page.');
      this.location.back();
    }
    // fetch countries from db to insert all into the dropdown
    let promise2 = new Promise((resolve, reject) => {
      try {
        this.objBack.fetchCountries()
          .pipe(
            finalize(() => {
            }))
          .subscribe((apiResponse) => {
            this.objAuth.isProcessing = false;
            if (apiResponse.length > 0) {
              this.countryOptions = apiResponse;
              this.individualInputs.address['country'] = this.countryOptions[0].id;
              resolve('done');
            }
            else {
              this.countryOptions = [];
            }
          });
      }
      catch (err) {
        this.objAuth.isProcessing = false;
      }
    });
    let y = await promise2;
    this.individualInputs['pr'] = this.objAuth.getValueFromLocalStorage('pr');
    this.individualInputs['basis_data'] = JSON.parse(this.objAuth.getValueFromLocalStorage('localForIndi'));
    this.individualInputs.user_id = 0;
    // check if data exists in the local storage
    if(localStorage.getItem('individualInputs') != null){
      this.isLocalInputs = true;
      // get inputs and outputs from local storage if data exists
      let tempInputs = JSON.parse(this.objAuth.getValueFromLocalStorage('individualInputs'));
      for(let key in tempInputs)
        this.individualInputs[key] = tempInputs[key];
      this.calcIndividual();
    }
  }
  validateIndividual(){
    return true;
  }
  async calcIndividual(){
    this.objAuth.isProcessing = true;
    this.objAuth.isProcessText = 'Checking';
    if(this.validateIndividual()){
      // dummy date for test
      this.isResult = false;
      try {
        this.objBack.calcIndividual(this.individualInputs)
          .pipe()
          .subscribe((apiResponse) => {
            if(apiResponse.status == 'success'){
              this.isResult = true;
              this.isLocalInputs = true;
              this.printIndividual(apiResponse.individual_outputs)
              // save inputs, outputs into the local storage
              this.objAuth.setValueToLocalStorage('individualInputs', JSON.stringify(this.individualInputs));
              this.objBack.individualStatus.individual = true;
              this.objBack.triggerScrollTo('personal_result');
            }
            else if(apiResponse.status == 'error'){
              this.isResult = false;
              this.objBack.individualStatus.individual = false;                
              this.objNotify.error('Based on your entries is no calculation possible!');
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
  saveIndividual(){
    if(this.validateIndividual()){
      // dummy date for test
      this.isResult = false;
      try {
        this.objBack.saveIndividual(this.individualInputs)
          .pipe()
          .subscribe((apiResponse) => {
            if(apiResponse.status == 'success'){
              this.isResult = true;
              this.objNotify.success('Saved successfully!');
            }
            else if(apiResponse.status == 'error'){
              this.isResult = true;
              this.objNotify.error('Failed saving!');
            }
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
