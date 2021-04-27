import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import { ContentsProvider, User } from "src/static-data/contents";
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import { Basis } from 'src/static-data/contents';
import { MatGridList } from '@angular/material';
import icInfo from '@iconify/icons-ic/twotone-info';

@Component({
  selector: 'app-basis-detail',
  templateUrl: './basis-detail.component.html',
  styleUrls: ['./basis-detail.component.scss']
})

export class BasisDetailComponent implements OnInit {
  @Input() user: User;
  @ViewChild('grid', { static: false }) grid: MatGridList;
  gridByBreakpoint = {
    xl: 8,
    lg: 6,
    md: 4,
    sm: 2,
    xs: 1
  }
  dateSelected = new Date();
  icMoreVert = icMoreVert;
  icInfo = icInfo;
  displayedColumns: string[] = ['position', 'name', 'from', 'to'];
  // flag for processing
  public isLocalInputs = false;
  public isAdmin = false;
  public isProcessing: boolean;
  public contentNames: any;
  public contentHeaders: any;
  public contentElements: any;
  public contentOptions: any;
  // basis headers
  public basis_headers = ['purpose', 'type_property', 'purchasing', 'loan_amount', 'interest_variant', 'loan_term', 'employment_type', 'preferred_date'];
  public resultNames = ['payment_rate', 'borrowing_rate', 'effective_rate', 'total_payment'];
  public resultObj = {};
  public elementsObj  = {};
  public basisInputs:Basis = {
    user_id: 0,
    country_id: 0,
    employment_type: "employment_employee",
    interest_variant: "interest_accepted_variable",
    loan_amount: 400000,
    loan_term: 20,
    purchasing: 400000,
    purpose: "purpose_buy",
    type_property: "type_condo",
    preferred_date: new Date()
  };
  public basisOutputs = {
    borrowing_rate: {from: '', to: ''},
    effective_rate: {from: '', to: ''},
    payment_rate: {from: '', to: ''},
    total_payment: {from: '', to: ''},
    info: []
  };
  public isResult : Boolean;
  public info1 = "";
  public info2 = "";
  public info3 = "";
  public preferDate: any;
  constructor(
    public objAuth: AuthService,
    public objBack: BackService,
    public objLang: LangService,
    private objNotify: NotificationService
  ) { }
  
  ngOnInit() {
    this.initData();
  }

  async initData() {
    let options = [], temp = '';
    this.contentNames = ContentsProvider.filter(name => name.page == 'basis');
    this.contentHeaders = this.contentNames.filter(name => name.level == 1 && (name.variety == 'basis' || name.name == 'interest_variant'));
    this.contentHeaders = this.array_move(this.contentHeaders, 0, 4);
    this.contentElements = this.contentNames.filter(name => name.level ==2);
    this.contentOptions = this.contentNames.filter(name => name.level ==3);

    // Get options of each basis input
    this.contentHeaders.forEach(header => {
      switch(header.name){
        case 'interest_variant':
          options = this.contentElements.filter(name => name.parent_id == header.id);
          temp = this.contentOptions.filter(name => name.parent_id == 2)[0];
          options.unshift(temp);
          this.elementsObj[header.name] = options;
          break;
        case 'purpose':
        case 'type_property':
        case 'employment_type':
          options = this.contentElements.filter(name => name.parent_id == header.id);
          this.elementsObj[header.name] = options;
          break;
        default:
          this.elementsObj[header.name] = {min: 0, max: 0};
          break;
      }
    });
    
    // init results
    this.initResults();
    // Check if the user logged in
    if(this.objAuth.isLoggedIn){
      // this.objAuth.isProcessing = true;      
      this.basisInputs['user_id'] = this.user['id'];
      this.basisInputs['country_id'] = Number(this.user['user_country']);
      // check if data exists in the db
      let promise2 = new Promise((resolve, reject) => {
        try {
          this.objBack.fetchIndividualBasis(this.user['id'])
            .pipe(
              finalize(() => {
              }))
            .subscribe((apiResponse) => {
              this.objAuth.isProcessing = false;
              if(apiResponse.length > 0){
                let tempObj = apiResponse[0];
                for(let key in tempObj){
                  if(key == 'preferred_date')
                    this.basisInputs.preferred_date = new Date(tempObj['preferred_date']);
                  else
                    this.basisInputs[key] = tempObj[key];
                }
                this.showOutputs(apiResponse[1]);               
              }
              resolve('done');
            });
        }
        catch (err) {
          this.objAuth.isProcessing = false;
        }
      });
      let y = await promise2;
    }
    else{
      this.basisInputs['user_id'] = 0;
      this.basisInputs['country_id'] = 0;
      // check if data exists in the local storage
      if (localStorage.getItem("basisInputs") != null){
        this.isLocalInputs = true;
        // get inputs from local storage
        let tempInputs = JSON.parse(this.objAuth.getValueFromLocalStorage('basisInputs'));
        for(let key in tempInputs)
          this.basisInputs[key] = tempInputs[key];
        this.calcBasis();
      }      
    }
  }
  initResults() {
    this.resultNames.forEach(resultName => {
      this.basisOutputs[resultName] = {from: '', to: ''};
    });
    this.isResult = false;
  }
  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  }
  validateBasis(){
    for(let key in this.basisInputs){
      if(this.basisInputs[key] == '' && key != 'user_id' && key != 'country_id'){
        this.objNotify.warning('Fill out all values!');
        return false;
      }
    }
    return true;
  }
  showOutputs(outputs){
    switch(outputs.status){
      case 'success':
        this.isResult = true;
        this.resultNames.forEach(resultName => {
          this.basisOutputs[resultName] = JSON.parse(outputs[resultName]);
        });
        this.basisOutputs['info'] = JSON.parse(outputs.info);
        // save inputs, outputs, and data for individual page to the local storage
        this.isLocalInputs = true;
        this.objAuth.setValueToLocalStorage('basisInputs', JSON.stringify(this.basisInputs));
        this.objAuth.setValueToLocalStorage('basisOutputs', JSON.stringify(this.basisOutputs));
        this.objAuth.setValueToLocalStorage('pr', outputs.pr);
        let basis_self = this.basisInputs['purchasing'] - this.basisInputs['loan_amount'];
        this.objAuth.setValueToLocalStorage('localForIndi', JSON.stringify({pr: outputs.pr, lp: outputs.lp, hp: outputs.hp, lar: this.basisInputs['loan_amount'], basis_self: basis_self}));
        this.objBack.individualStatus['basis'] = true;
        break;
      case 'error':
        this.isResult = false;
        this.objNotify.error(outputs.msg);
        localStorage.removeItem('basisInputs');
        localStorage.removeItem('basisOutputs');
        this.objBack.individualStatus['basis'] = false;
        break;
    }
    this.objAuth.isProcessing = false;
  }
  async calcBasis(){
   this.objAuth.isProcessing = true;
    this.objAuth.isProcessText = "Calculating";
    if(this.validateBasis()){
      // dummy date for test
      this.isResult = false;
      this.resultNames.forEach(resultName => {
        this.basisOutputs[resultName] = '';
      });
      let promise1 = new Promise((resolve, reject) => {
        try {
          this.objBack.calcBasis(this.basisInputs)
            .pipe()
            .subscribe((apiResponse) => {
              this.showOutputs(apiResponse);
              if(apiResponse.status == 'success'){
                this.objBack.triggerScrollTo('loan_result');
              }
              resolve('done');
            },
            error => {
              console.log('invalid')
              this.objAuth.isProcessing = false;
            });
        }
        catch (err) {
          this.objAuth.isProcessing = false;
        }
      });
      let x = await promise1;
    }
  }
}
