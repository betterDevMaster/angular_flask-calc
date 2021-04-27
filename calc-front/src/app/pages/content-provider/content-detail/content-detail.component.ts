import { Component, OnInit, ViewChild, ChangeDetectorRef, Input} from '@angular/core';
import { MatAccordion } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import icKeyboardArrowDown from '@iconify/icons-ic/keyboard-arrow-down';
import icAdd from '@iconify/icons-ic/add';
import icRemove from '@iconify/icons-ic/remove';
import icInfo from '@iconify/icons-ic/info';
import icSkipNext from '@iconify/icons-ic/skip-next';
import icSkipPrev from '@iconify/icons-ic/skip-previous';
import icMoreVert from '@iconify/icons-ic/more-vert'
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import { ContentsProvider } from "src/static-data/contents";
import { User } from 'src/static-data/contents';

@Component({
  selector: 'app-content-detail',
  templateUrl: './content-detail.component.html',
  styleUrls: ['./content-detail.component.scss']
})
export class ContentDetailComponent implements OnInit {
  @Input() user: User;
  @ViewChild(MatAccordion, {static: true}) accordion: MatAccordion;
  @ViewChild(SelectAutocompleteComponent, {static: true}) multiSelect: SelectAutocompleteComponent;
  icKeyboardArrowDown = icKeyboardArrowDown;
  icAdd = icAdd;
  icRemove = icRemove;
  icInfo = icInfo;
  icSkipNext = icSkipNext;
  icSkipPrev = icSkipPrev;
  icMoreVert = icMoreVert;
  displayedColumns: string[] = ['no', 'years', 'status', 'surcharge'];
  dataSource = [];
  user_role: any;
  user_id: any;
  // user: any;
  // options for the country
  countryOptions = [];
  countryForm = new FormGroup({
    selected: new FormControl([])
  });
  // flat for new or update
  public newFlag: any;
  public tabIndex = 0;
  public isProcessing: boolean;
  public contentNames: any;
  public contentHeaders: any;
  public contentHeadersGeneral: any;
  public contentHeadersBasis: any;
  public contentHeadersIndividual: any;
  public contentHeadersSpecial: any;
  public contentElementsTotal: any;
  public contentElements: any;
  public contentOptions: any;
  public surchargeStatus = {};
  public surchargeStatusPrev = {};
  // objects for database
  public contentObj: any;
  public contentMainObj: any;
  public contentRangeObj: any;
  public contentReductionObj: any;
  public contentSurchargeObj: any;
  public contentGuarantorObj: any;
  // interest variant
  public interest_variant_header: {};
  public interest_variant_elements: any;
  public interest_accepted_element: {};
  public interest_accepted_options: any;
  public interest_reference_element: {};
  public interest_reference_options: any;
  public interest_surcharge_options: any;
  public interest_surcharges: any;
  // funding per case
  public funding_case_header: {};
  public funding_case_elements: any;
  // purpose
  public purpose_header: {};
  public purpose_elements = [];
  // 
  // purchasing price/property value
  public purchasing_header = {};
  public purchasing_elements: any;
  public purchasing_options: any;
  public purchasing_min: any;
  public purchasing_max: any;
  public purchasing_step: any;
  public purchasing_starting_options: any;
  public purchasing_reductions_options: any;
  // loan amount
  public loan_amount_header = {};
  public loan_amount_elements: any;
  // loan term
  public loan_term_header: any;
  public loan_term_elements: any;
  public loan_term_options: any;
  // age
  public age_header: any;
  public age_elements: any;
  public age_options: any;
  // number of kids
  public kids_header: any;
  public kids_elements: any;
  public kids_ranges: any;
  public kids_options: any;
  public kids_reductions: any;
  public kids_reductions_available: any;
  public kids_to: any;
  // Net income
  public net_income_header: any;
  public net_income_elements: any;
  public net_min_options: any;
  public net_not_ratio_options: any;
  public net_ratio_options: any;
  public net_usual_group: any;  
  public net_reduction_group: any;
  public net_ratio_group: any;
  public net_reduction_group_available: any;
  public net_ratio_group_available: any;
  // reductions
  public reduction_options: any;
  public reduction_start: any;
  public reduction_end: any;
  public reduction_step: any;
  public reduction_group: any;
  // Address
  public address_header: any;
  public address_elements: any;
  public address_elements_main: any;
  public address_options: any;
  public country_options: any;
  // Guarantor
  public guarantor_group: any;
  public guarantor_options: any;
  public guarantor_headers: any;
  public guarantor_elements: any;
  public guarantor_self_options: any;
  public guarantor_min_options: any;
  public guarantor_until_options: any;
  // Ranges
  public range_elements: any;
  // input steps
  public contentSteps = {};
  public contentTypes = {};
  // tips
  public contentTipsElements: any;
  public contentTips = {};
  constructor(
    private objAuth: AuthService,
    private objBack: BackService,
    public objLang: LangService,
    private cd: ChangeDetectorRef,
    private objNotify: NotificationService
  ) {
    
  }
  ngOnInit() {
    this.newFlag = false;
    this.contentObj = {user_id: 0, interest_accepted: '', interest_reference: '', interest_fixed: 0, interest_surcharge: '', internal_val: 0, funding_case_min: 0, funding_case_max: 0, purpose: '', type_property: '', purchasing_min: 0, purchasing_max: 0, purchasing_reduction_starting: 0, purchasing_reduction: '', loan_amount_min: 0, loan_amount_max: 0, loan_term_min: 0, loan_term_max: 0, employment_type: '', martial_status: '', age_min: 0, age_max: 0, age: '', net_min: 0, net_not_ratio: 0, net: '', net_to: 0, highest_degree: '', field_work: '', job_position: '', kids_min: 0, kids_max: 0, kids: '', kids_to: 0, address_scope: '', country_id: '', self_required: false, self_min: 0, self_funds: '', self_to: 0, guarantor_required: false, guarantor_min: 0, guarantor: '', guarantor_to: 0, combined_required: false, combined_min: 0, combined: '', combined_to: 0};
    this.contentMainObj = { user_id: 0, interest_accepted: '', interest_reference: '', interest_fixed: 0, internal_val: 0, purchasing_reduction_starting: 0, net_min: 0, net_not_ratio: 0, net_ratio_1: 0, net_reduction_surcharge_1: 0, net_ratio_2: 0, net_reduction_surcharge_2: 0, net_ratio_3: 0, net_reduction_surcharge_3: 0, address_scope: '', kids_to: 1, country_id: 0, net_to: 1 };
    this.contentRangeObj = { user_id: 0, name: '', val: 0 };
    this.contentReductionObj = { user_id: 0, name: '', val: 0 };
    this.contentSurchargeObj = { user_id: 0, name: '', val: '', status: true };
    this.contentGuarantorObj = { user_id: 0, name: '', required: false, mini: 0, until_1: 0, reduction_1: 0, until_2: 0, reduction_2: 0, until_3: 0, reduction_3: 0, until_4: 0, reduction_4: 0, until_5: 0, reduction_5: 0 };
    setTimeout(() => {
      
      this.getContents();
    }, 1000);
  }
  getContents(): void {
    this.contentNames = ContentsProvider;
    this.contentHeaders = this.contentNames.filter(name => name.level == 1 && name.name != 'general');
    this.contentHeadersGeneral = this.contentHeaders.filter(name => name.variety == 'general');
    this.contentHeadersBasis = this.contentHeaders.filter(name => name.variety == 'basis');
    this.contentHeadersIndividual = this.contentHeaders.filter(name => name.variety == 'individual');
    this.contentHeadersSpecial = this.contentHeaders.filter(name => name.variety == 'special');
    this.contentElementsTotal = this.contentNames.filter(name => name.level == 2);
    this.contentElements = this.contentElementsTotal.filter(name => name.variety != 'tip');
    this.contentOptions = this.contentNames.filter(name => name.level == 3);
    // Interest rate
    this.interest_variant_header = this.contentHeaders.filter(name => name.name == 'interest_variant')[0];
    this.interest_variant_elements = this.contentElements.filter(name => name.parent_id == this.interest_variant_header['id']);
    // interest accepted
    this.interest_accepted_element = this.interest_variant_elements.filter(name => name.name == 'interest_accepted')[0];
    this.interest_accepted_options = this.contentOptions.filter(name => name.parent_id == this.interest_accepted_element['id']);
    // interest reference
    this.interest_reference_element = this.interest_variant_elements.filter(name => name.name == 'interest_reference')[0];
    this.interest_reference_options = this.contentOptions.filter(name => name.parent_id == this.interest_reference_element['id']);
    // interest surcharges
    this.interest_surcharges = this.interest_variant_elements.filter(name => name.category == 'content_surcharges');
    // interest surcharges
    this.interest_surcharge_options = this.setOptions(0, 2, 0.05);
    this.dataSource = this.interest_surcharges;
    // Funding per case
    this.funding_case_header = this.contentHeaders.filter(name => name.name == 'funding_case')[0];
    this.funding_case_elements = this.contentElements.filter(name => name.parent_id == this.funding_case_header['id']);
    // Purpose
    this.purpose_header = this.contentHeaders.filter(name => name.name == 'purpose')[0];
    this.purpose_elements = this.contentElements.filter(name => name.parent_id == this.purpose_header['id'] && name.category == 'content_reductions');
    // Purchasing
    this.purchasing_header = this.contentHeaders.filter(name => name.name == 'purchasing')[0];
    this.purchasing_elements = this.contentElements.filter(name => name.parent_id == this.purchasing_header['id']);
    this.setPurchasingValues();
    // Loan amount
    this.loan_amount_header = this.contentHeaders.filter(name => name.name == 'loan_amount')[0];
    this.loan_amount_elements = this.contentElements.filter(name => name.parent_id == this.loan_amount_header['id']);
    // Loan term
    this.loan_term_header = this.contentHeaders.filter(name => name.name == 'loan_term')[0];
    this.loan_term_elements = this.contentElements.filter(name => name.parent_id == this.loan_term_header['id']);
    this.setLoantermValues();
    // Age
    this.age_header = this.contentHeaders.filter(name => name.name == 'age')[0];
    this.age_elements = this.contentElements.filter(name => (name.parent_id == this.age_header['id']) && (name.category == 'content_ranges'));
    this.setAgeValues();
    // Kids
    this.kids_header = this.contentHeaders.filter(name => name.name == 'kids')[0];
    this.kids_elements = this.contentElements.filter(name => name.parent_id == this.kids_header['id']);
    this.kids_ranges = this.kids_elements.filter(name => name.category == 'content_ranges');
    this.kids_reductions = this.kids_elements.filter(name => name.category == 'content_reductions');
    this.setKidsValues();
    // Reduction group
    this.reduction_group = this.getCategoryGroup(this.contentNames, 'content_reductions');
    this.objLang.reduction_options = this.setReductionArray(-2.00, 2.00, 0.05);
    // Net icome
    this.net_income_header = this.contentHeaders.filter(name => name.name == 'net_income')[0];
    this.net_income_elements = this.contentElements.filter(name => name.parent_id == this.net_income_header['id']);
    this.net_usual_group = this.net_income_elements.filter(name => name.variety == 'net_usual');
    this.net_ratio_group = this.net_income_elements.filter(name => name.variety == 'net_ratio');
    this.net_reduction_group = this.net_income_elements.filter(name => name.variety == 'net_reduction_surcharge');
    this.setNetIncomeValues();
    // Address
    this.address_header = this.contentHeaders.filter(name => name.name == 'address')[0];
    this.address_elements = this.contentElements.filter(name => name.parent_id == this.address_header['id']);
    this.address_options = this.contentOptions.filter(name => name.parent_id == this.address_elements[0].id);
    this.getCountries();
    // Guarantor group
    this.guarantor_headers = this.contentHeaders.filter(name => name.category == 'content_guarantors');
    this.guarantor_elements = this.contentElements.filter(name => name.category == 'content_guarantors');
    this.guarantor_group = this.getGuarantorGroup();
    this.guarantor_self_options = [{ key: true, val: 'Yes' }, { key: false, val: 'No' }];
    this.guarantor_min_options = this.setOptions(5, 50, 5);
    this.guarantor_until_options = this.setOptions(0, 50, 5);
    this.objLang.guarantor_reduction_options = this.setReductionArray1(-2.00, 0, 0.05);
    // Tips
    this.contentTipsElements = this.contentElementsTotal.filter(name => name.variety == 'tip');
    this.setTipsGroup(this.contentTipsElements);
    // Initialize contentVals
    this.objLang.contentVals = this.initContents(this.contentElements, this.contentOptions);
    // Get content main
    this.getContentData();
  }
  getContentData(): void {
    let tempObj = {}, tempArr = [], kidsLen = 0;
    try {
      this.objAuth.isProcessing = true;
      this.objBack.fetchContentMain(this.user['id'])
        .pipe(
          finalize(() => {
          }))
        .subscribe((apiResponse) => {
          console.log('content data from DB');
          console.log(this.user['id'])
          console.log(apiResponse);
          if (apiResponse.length > 0) {
            this.contentObj = apiResponse[0];
            for (let key in this.contentObj) {
              switch (key) {
                case 'purpose':
                case 'type_property':
                case 'employment_type':
                case 'martial_status':
                case 'age':
                case 'highest_degree':
                case 'field_work':
                case 'job_position':
                  tempObj = {};
                  tempObj = JSON.parse(this.contentObj[key]);
                  for(let key in tempObj){
                    this.objLang.contentVals[key] = this.setReductionStr(tempObj[key]);
                  }
                  break;
                case 'kids':
                  tempObj = {};
                  tempObj = JSON.parse(this.contentObj[key]);
                  for(let key in tempObj){
                    this.objLang.contentVals[key] = this.setReductionStr(tempObj[key]);
                  }
                  kidsLen = Object.keys(tempObj).length;
                  break;
                case 'net':
                  let net_ratio_name, net_reduction_name;
                  tempArr = [];
                  tempArr = JSON.parse(this.contentObj[key]);
                  this.objLang.contentVals['net_to'] = tempArr.length;
                  this.net_ratio_group_available = this.net_ratio_group.slice(0, this.objLang.contentVals['net_to']);
                  this.net_reduction_group_available = this.net_reduction_group.slice(0, this.objLang.contentVals['net_to']);
                  for(let i=0;i<this.objLang.contentVals['net_to'];i++){
                    net_ratio_name = this.net_ratio_group_available[i].name;
                    this.objLang.contentVals[net_ratio_name] = tempArr[i]['ratio'];
                    net_reduction_name = this.net_reduction_group_available[i].name;
                    this.objLang.contentVals[net_reduction_name] = this.setReductionStr(tempArr[i]['reduction']);
                  }
                  break;
                case 'self_funds':
                case 'guarantor':
                case 'combined':
                  let until_name, until_val, reduction_name, reduction_val;
                  tempArr = [];
                  tempArr = JSON.parse(this.contentObj[key]);
                  this.guarantor_group[key]['reduction_to'] = tempArr.length;
                  this.guarantor_group[key]['reductions_available'] = this.guarantor_group[key]['reductions'].slice(0, this.guarantor_group[key]['reduction_to']);
                  this.guarantor_group[key]['untils_available'] = this.guarantor_group[key]['untils'].slice(0, this.guarantor_group[key]['reduction_to']);
                  for(let i=0;i<this.guarantor_group[key]['reduction_to'];i++){
                    until_name = this.guarantor_group[key]['untils_available'][i]['name'];
                    this.objLang.contentVals[until_name] = tempArr[i]['until'];
                    reduction_name = this.guarantor_group[key]['reductions_available'][i]['name'];
                    this.objLang.contentVals[reduction_name] = this.setReductionStr(tempArr[i]['reduction']);
                  } 
                  break;
                case 'purchasing_reduction_starting':
                  this.objLang.contentVals[key] = this.setReductionStr(this.contentObj[key]);
                  break;
                case 'country_id':
                    this.objLang.contentVals[key] = JSON.parse(this.contentObj[key]);
                    break;
                case 'self_required':
                case 'guarantor_required':
                case 'combined_required':
                  this.objLang.contentVals[key] = Boolean(this.contentObj[key]);
                case 'interest_surcharge':
                  tempObj = {};
                  tempObj = JSON.parse(this.contentObj[key]);
                  for(let key in tempObj){
                    this.objLang.contentVals[key] = tempObj[key].val;
                    this.surchargeStatus[key] = tempObj[key].status;
                  }
                  break;
                default:
                   this.objLang.contentVals[key] = this.contentObj[key];
                  break;
              }
            }
            // set available kids reduction
            this.objLang.contentVals['kids_to'] = this.objLang.contentVals['kids_min'] + kidsLen - 1;
            this.kids_reductions_available = this.kids_reductions.filter(name => name.val >= this.objLang.contentVals['kids_min']).slice(0, kidsLen);
          }
          else{
            this.copyContentVals(this.objLang.contentVals);
            this.newFlag = true;
          }
          this.objAuth.isProcessing = false;
        });
    }
    catch (err) {
      this.objAuth.isProcessing = false;
    }
  }
  setPurchasingValues() {
    this.purchasing_options = this.setOptions(5000, 1000000, 5000);
    this.objLang.purchasing_starting_options = this.setReductionArray2(5000, 1000000, 5000);
    this.objLang['purchasing_reductions_options'] = this.setOptions(-2, -0.05, 0.05);
  }
  setLoantermValues() {
    this.loan_term_options = this.setOptions(1, 80, 1);
  }
  setAgeValues() {
    this.age_options = this.setOptions(18, 80, 1);
  }
  setKidsValues() {
    this.kids_options = this.setOptions(0, 10, 1);
  }
  setNetIncomeValues() {
    this.net_min_options = this.setOptions(400, 10000, 100);
    this.net_not_ratio_options = this.setOptions(0, 1, 0.01);
    this.net_ratio_options = this.setOptions(0, 1, 0.01);
    this.objLang.net_reduction_options = this.setReductionArray(-2, 2, 0.05);
  }
  setGuarantorValues() {
    this.guarantor_self_options = [{ key: true, val: 'Yes' }, { key: false, val: 'No' }];
    this.guarantor_min_options = this.setOptions(5, 50, 5);
    this.guarantor_until_options = this.setOptions(0, 50, 5);
    this.objLang.guarantor_reduction_options = this.setReductionArray1(-2.00, 0, 0.05);
  }
  setReductionArray(start, end, step) {
    let val, i, end_plus;
    let options = [];
    end_plus = end + step;
    for (i = start; i <= end_plus; i += step) {
      i = Math.round(i * 100) / 100;
      switch (i) {
        case 0:
          val = this.objLang.translates['contentcontentno_reduction'];
          break;
        case end_plus:
          val = this.objLang.translates['contentcontentnot_accepted'];
          break;
        default:
          val = i;
          break;
      }
      options.push(val);
    }
    return options;
  }
  setReductionArray1(start, end, step) {
    let val, i;
    let options = [];
    for (i = start; i <= end; i += step) {
      i = Math.round(i * 100) / 100;
      val = i;
      if (i == end)
        val = this.objLang.translates['contentcontentno_reduction'];
      options.push(val);
    }
    return options;
  }
  setReductionArray2(start, end, step) {
    let val, i;
    let options = [];
    options.push(this.objLang.translates['contentcontentno_reduction']);
    if (start == 0) {
      start += step;
    }
    if (start % step > 0) {
      options.push(start);
      start = start + step - (start % step);
    }
    for (i = start; i <= end; i += step) {
      val = Math.round(i * 100) / 100;
      options.push(val);
    }
    if (end % step > 0) {
      options.push(end);
    }
    return options;
  }
  setOptions(start, end, step) {
    let val, i;
    let options = [];
    for (i = start; i <= end; i += step) {
      i = Math.round(i * 100) / 100;
      options.push(i);
    }
    return options;
  }
  setTipsGroup(elements){
    elements.forEach(element => {
    this.contentTips[element.parent_id] = element.name;
    });
  }
  getCategoryGroup(content_all, category) {
    let categories = [], category_headers = [], category_elements = [], category_group = {}, i = 0;
    categories = content_all.filter(name => name.category == category);
    category_headers = categories.filter(name => name.level == 1);
    category_elements = categories.filter(name => name.level == 2);
    category_headers.forEach(category_header => {
      category_group[category_header.name] = category_elements.filter(name => name.parent_id == category_header.id);
    });
    return category_group;
  }
  getGuarantorGroup() {
    let categories = [], guarantor_headers = [], elements = [], category_group = {}, i = 0, usuals = [], reductions = [], untils = [];
    this.guarantor_headers.forEach(guarantor_header => {
      let category = {};
      elements = this.guarantor_elements.filter(name => name.parent_id == guarantor_header.id);
      category['reduction_to'] = 1;
      category['usuals'] = elements.filter(name => name.variety == 'required' || name.variety == 'mini');
      category['untils'] = elements.filter(name => name.variety == 'until');
      category['reductions'] = elements.filter(name => name.variety == 'reduction');
      category['untils_available'] = category['untils'].slice(0, 1);
      category['reductions_available'] = category['reductions'].slice(0, 1);
      category_group[guarantor_header.name] = category;
    });
    return category_group;
  }
  initContents(content_elements, content_options) {
    let key, val, content_vals = {}, options = [];
    content_elements.forEach(element => {
      val = '';
      // if element is included in Purchasing
      this.contentSteps[element.name] = 1;
      if (element.parent_id == this.purchasing_header['id']) {

        switch (element.name) {
          case 'purchasing_min':
            val = this.purchasing_options[0];
            break;
          case 'purchasing_max':
            let purchasing_options_final = this.purchasing_options.length - 1;
            val = this.purchasing_options[purchasing_options_final];
            break;
          case 'purchasing_reduction_starting':
            val = this.objLang.purchasing_starting_options[0];
            break;
          case 'purchasing_reduction':
            val = this.objLang['purchasing_reductions_options'][0];
            break;
        }
      }
      else if (element.name == 'interest_fixed' || (element.name == 'internal_val')) {
        this.contentSteps[element.name] = 0.01;
        val = 0;
      }
      // if loan amount
      else if ((element.parent_id == this.loan_amount_header['id']) && (element.category == 'content_ranges')) {
        let loan_amount_final = this.purchasing_options.length - 1;
        switch (element.name) {
          case 'loan_amount_min':
            val = this.purchasing_options[0];
            break;
          case 'loan_amount_max':
            val = this.purchasing_options[loan_amount_final];
            break;
        }
      }
      // if loan term
      else if ((element.parent_id == this.loan_term_header['id']) && (element.category == 'content_ranges')) {
        let loan_term_final = this.loan_term_options.length - 1;
        switch (element.name) {
          case 'loan_term_min':
            val = this.loan_term_options[0];
            break;
          case 'loan_term_max':
            val = this.loan_term_options[loan_term_final];
            break;
        }
      }
      // if age
      else if ((element.parent_id == this.age_header['id']) && (element.category == 'content_ranges')) {
        let age_final = this.age_options.length - 1;
        switch (element.name) {
          case 'age_min':
            val = this.age_options[0];
            break;
          case 'age_max':
            val = this.age_options[age_final];
            break;
        }
      }
      // if net income
      else if (element.parent_id == this.net_income_header['id']) {
        switch (element.name) {
          case 'net_min':
            val = this.net_min_options[0];
            break;
          case 'net_not_ratio':
            val = this.net_not_ratio_options[0];
            break;
          case 'net_to':
            val = 1;
            this.net_reduction_group_available = this.net_reduction_group.slice(0, 1);
            this.net_ratio_group_available = this.net_ratio_group.slice(0, 1);
            break;
        }
        switch (element.variety) {
          case 'net_ratio':
            val = this.net_ratio_options[0];
            break;
          case 'net_reduction_surcharge':
            val = this.objLang.translates['contentcontentno_reduction'];
            break;
        }
      }
      // if kids
      else if ((element.parent_id == this.kids_header['id']) && (element.category == 'content_ranges')) {
        let kids_final = this.kids_options.length - 1;
        switch (element.name) {
          case 'kids_min':
            val = this.kids_options[0];
            break;
          case 'kids_max':
            val = this.kids_options[kids_final];
            break;
        }
      }
      else if (element.name == 'kids_to') {
        val = 1;
        this.kids_reductions_available = this.kids_reductions.filter(name => name.val == 1);
      }
      // if address
      else if (element.parent_id == this.address_header['id']) {
        switch (element.name) {
          case 'address_scope':
            val = this.address_options[0].name;
            break;
          case 'country_id':
            val = [];
            break;
        }
      }
      // if its category is content_reduction
      else if (element.category == 'content_reductions')
        val = this.objLang.translates['contentcontentno_reduction'];
      // if its category is guarantor
      else if (element.category == 'content_guarantors') {
        switch (element.variety) {
          case 'required':
            val = this.guarantor_self_options[1].key;
            break;
          case 'mini':
            val = this.guarantor_min_options[0];
            break;
          case 'until':
            val = this.guarantor_until_options[0];
            break;
          case 'reduction':
            val = this.objLang.translates['contentcontentno_reduction'];
            break;
          case 'reduction_to':
            val = 1;
            break;
        }
      }
      // if element type is surcharges  
      else if (element.category == 'content_surcharges') {
        val = 0;
        this.surchargeStatus[element.name] = false;
        this.surchargeStatusPrev[element.name] = false;
        this.contentSteps[element.name] = 0.01;
      }
      // if element has own options in the database
      else {
        options = content_options.filter(name => name.parent_id == element.id);
        if (options.length > 0)
          val = options[0].name;
        else
          val = 0;
      }
      content_vals[element.name] = val;
      this.contentTypes[element.name] = 'text';
    });
    content_vals['purchasing_min'] = this.purchasing_options[0];
    return content_vals;
  }
  getHeaders(element, index, array) {
    return (element.level == 1);
  }
  getCountries(): void {
    try {
      // this.objAuth.isProcessing = true;

      this.objBack.fetchCountries()
        .pipe(
          finalize(() => {
          }))
        .subscribe((apiResponse) => {
          if (apiResponse.length > 0) {
            this.country_options = apiResponse;
            apiResponse.forEach(country_option => {
              this.countryOptions.push({display: country_option.name, value: country_option.id});
            });
          }
          else {
            this.country_options = [];
          }
          
        });
    }
    catch (err) {
      this.objAuth.isProcessing = false;
    }
  }
  onChange() {
  }
  validateRanges() {
    if ((this.objLang.contentVals[this.kids_ranges[0]['name']] > this.objLang.contentVals[this.kids_ranges[1]['name']]) ||
      (this.objLang.contentVals[this.age_elements[0]['name']] > this.objLang.contentVals[this.age_elements[1]['name']]) ||
      (this.objLang.contentVals[this.funding_case_elements[0]['name']] > this.objLang.contentVals[this.funding_case_elements[1]['name']]) ||
      (this.objLang.contentVals[this.funding_case_elements[0]['name']] > this.objLang.contentVals[this.funding_case_elements[1]['name']]) ||
      (this.objLang.contentVals['purchasing_min'] > this.objLang.contentVals['purchasing_max']) ||
      (this.objLang.contentVals[this.loan_amount_elements[0]['name']] > this.objLang.contentVals[this.loan_amount_elements[1]['name']]) ||
      (this.objLang.contentVals[this.loan_term_elements[0]['name']] > this.objLang.contentVals[this.loan_term_elements[1]['name']])) {
      return false;
    }
    return true;
  }
  getReductionStr(val: any){
    switch(val){
      case this.objLang.translates['contentcontentno_reduction']:
        val = 0;
        break;
      case this.objLang.translates['contentcontentnot_accepted']:
        val = 'not_accepted';
        break;
      default:
        val = Number(val);
    }
    return val;
  }
  setReductionStr(val: any){
    switch(val){
      case 0:
        val = this.objLang.translates['contentcontentno_reduction'];
        break;
      case 'not_accepted':
        val = this.objLang.translates['contentcontentnot_accepted'];
        break;
    }
    return val;
  }
  saveContentData() {
    let validateFlag = false, tempObj = {}, tempArr = [];
    console.log('content for saving');
    console.log(this.contentObj);
    validateFlag = this.validateRanges();
    if (!validateFlag)
      this.objNotify.success(this.objLang.translates['validate_error']);
    else{
      // update obj    
      for (let key in this.contentObj) {
        switch (key) {
          case 'user_id':
            this.contentObj[key] = this.user['id'];
            break;
          case 'purchasing_reduction_starting':
            this.contentObj[key] = this.getReductionStr(this.objLang.contentVals[key]);
            break;
          case 'country_id':
              this.contentObj[key] = this.objLang.contentVals['address_scope'] == this.address_options[1].name ? JSON.stringify(this.objLang.contentVals[key]) : '[]';           
              break;
          case 'interest_surcharge':
            tempObj = {};
            this.interest_surcharges.forEach(element => {
              tempObj[element.name] = {val: this.objLang.contentVals[element.name], status: this.surchargeStatus[element.name]}
            });
            this.contentObj[key] = JSON.stringify(tempObj);
            break;
          case 'purpose':
          case 'type_property':
          case 'employment_type':
          case 'martial_status':
          case 'age':
          case 'highest_degree':
          case 'field_work':
          case 'job_position':
            tempObj = {};
            this.reduction_group[key].forEach(element => {
              tempObj[element.name] = this.getReductionStr(this.objLang.contentVals[element.name]);
            });
            this.contentObj[key] = JSON.stringify(tempObj);
            break;
          case 'kids':
            tempObj = {};
            this.kids_reductions_available.forEach(element => {
              tempObj[element.name] = this.getReductionStr(this.objLang.contentVals[element.name]);
            });
            this.contentObj[key] = JSON.stringify(tempObj);
            break;          
          case 'net':
            tempArr = [];
            for(let i=0;i<this.objLang.contentVals['net_to'];i++){
              let net_ratio_name = this.net_ratio_group_available[i].name;
              let net_ratio_val = this.objLang.contentVals[net_ratio_name];
              let net_reduction_name = this.net_reduction_group_available[i].name;
              let net_reduction_val = this.objLang.contentVals[net_reduction_name];
              tempArr.push({'ratio': net_ratio_val, 'reduction': this.getReductionStr(net_reduction_val)});
            }
            this.contentObj[key] = JSON.stringify(tempArr);
            break;
          case 'self_funds':
          case 'guarantor':
          case 'combined':
            tempArr = [];
            for(let i=0;i<this.guarantor_group[key]['reduction_to'];i++){
              let until_name = this.guarantor_group[key]['untils_available'][i]['name'];
              let until_val = parseFloat(this.objLang.contentVals[until_name]);
              let net_reduction_name = this.guarantor_group[key]['reductions_available'][i]['name'];
              let net_reduction_val = this.getReductionStr(this.objLang.contentVals[net_reduction_name]);
              tempArr.push({'until': until_val, 'reduction': net_reduction_val});
            }
            this.contentObj[key] = JSON.stringify(tempArr);
            break;
          default:
            this.contentObj[key] = this.objLang.contentVals[key];
            break;
        }
      }
      console.log('this.contentObj');
      console.log(this.contentObj);
      // submit
      try {
        this.objBack.saveContentMain(this.contentObj)
          .pipe()
          .subscribe((apiResponse) => {
            this.objNotify.success(apiResponse.status);
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
  
  copyContentVals(obj){
    for(let key in obj){
      this.objLang.contentValsPrev[key] = obj[key];
    }
  }
  // Set number step
  setNumberStep() {
    for (let key in this.objLang.contentVals) {
      if (!isNaN(this.objLang.contentVals[key])) {
        this.countDecimals(key);
        this.contentTypes[key] = 'number';
      }
    }
  }

  countDecimals(key: any) {
    let decimalNumber, offset, value;
    value = this.objLang.contentVals[key];
    if ((Math.floor(value) === value) || (value == '') || (value.toString().split(".").length < 2))
      return 1;
    var decimalLength = (value.toString().split(".")[1].length || 0);
    var decimalLengthNegative = decimalLength * -1;
    var decimalUnit = Math.pow(10, decimalLength);
    var decimalUnitNegative = Math.pow(10, decimalLengthNegative);
    decimalNumber = Math.round(decimalUnitNegative * decimalUnit) / decimalUnit;
    offset = Math.round(this.contentSteps[key] / decimalNumber * 10) / 10;
    if (offset != 0.1)
      this.contentSteps[key] = decimalNumber;
  }
  nextBtn() {
    const tabCount = 4;
    this.tabIndex = (this.tabIndex + 1) % tabCount;
  }
  backBtn() {
    const tabCount = 4;
    if (this.tabIndex != 0)
      this.tabIndex = (this.tabIndex - 1) % tabCount;
  }

  public setPurchasingRange(content_min, content_max) {
    if (content_min < content_max) {
      this.objLang.purchasing_starting_options = this.setReductionArray2(content_min, content_max, 5000);
    } else {
      let options = [];
      options.push(this.objLang.translates['contentcontentno_reduction']);
      this.objLang.purchasing_starting_options = options;
    }
  }
  setKidsLimit(num){
    this.kids_reductions_available = this.kids_reductions.filter(name => name.val >= this.objLang.contentVals['kids_min'] && name.val <= num);
  }
  addKids() {
    if (this.objLang.contentVals['kids_to'] < (this.objLang.contentVals['kids_max'])) {
      this.objLang.contentVals['kids_to']++;
      this.setKidsLimit(this.objLang.contentVals['kids_to']);
    }
  }
  reduceKids() {
    if (this.objLang.contentVals['kids_to'] > (this.objLang.contentVals['kids_min'])) {
      this.objLang.contentVals['kids_to']--;
      this.setKidsLimit(this.objLang.contentVals['kids_to']);
    }
  }

  changeKidsRange() {
    if (this.objLang.contentVals['kids_to'] > this.objLang.contentVals['kids_max']) {
      this.objLang.contentVals['kids_to'] = this.objLang.contentVals['kids_max'];
    }
    if (this.objLang.contentVals['kids_to'] < this.objLang.contentVals['kids_min']) {
      this.objLang.contentVals['kids_to'] = this.objLang.contentVals['kids_min'];
    }
    this.kids_reductions_available = this.kids_reductions.filter(name => name.val >= this.objLang.contentVals['kids_min'] && name.val <= this.objLang.contentVals['kids_to']);
  }
  setGuarantorLimit(header, num){
    this.guarantor_group[header]['untils_available'] = this.guarantor_group[header]['untils'].slice(0, num);
    this.guarantor_group[header]['reductions_available'] = this.guarantor_group[header]['reductions'].slice(0, num);
  }
  addGuarantors(header) {
    if (this.guarantor_group[header]['reduction_to'] < 5) {
      this.setGuarantorLimit(header, ++this.guarantor_group[header]['reduction_to']);
    }
  }
  reduceGuarantors(header) {
    if (this.guarantor_group[header]['reduction_to'] > 1) {
      this.setGuarantorLimit(header, --this.guarantor_group[header]['reduction_to']);
    }
  }
  setNetRatiosLimit(num){
    this.net_ratio_group_available = this.net_ratio_group.slice(0, num);
    this.net_reduction_group_available = this.net_reduction_group.slice(0, num);
  }
  addNetIncome(){
    if(this.objLang.contentVals['net_to']<3){
      this.objLang.contentVals['net_to']++;
      this.setNetRatiosLimit(this.objLang.contentVals['net_to']);
    }
  }
  reduceNetIncome(){
    if(this.objLang.contentVals['net_to']>1){
      this.objLang.contentVals['net_to']--;
      this.setNetRatiosLimit(this.objLang.contentVals['net_to']);
    }
  }
}

