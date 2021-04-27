import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { LangService} from 'src/app/utils/services/language/language.service';
import { ContentsProvider } from "src/static-data/contents";
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';

// import { lang } from 'moment';
import { Location } from '@angular/common';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContentComponent implements OnInit {
    dummy_data = 'Dummy';
    public isProcessing: Boolean;
    public changedFlag: Boolean;
    public contentNames: any;
    public contentHeaders: any;
    public contentHeadersMain: any;
    public contentElementsGeneral: any;
    public contentHeadersEven: any;
    public contentHeadersOdd: any;
    public contentElements: any;
    public contentOptions: any;
    public contentElementsInfo: any;
    public contentElementsOther: any;
    public contentGroup: any;
    public contentGroupGeneral: any;
    public contentGroupInfo: any;
    public contentLangs: any;
    public contentLangsPrev: any;
    public langId: any;
    
  /**
   * Constructor
   *
   */
  constructor(
    private objAuth: AuthService,
    private objBack: BackService,
    public objLang: LangService,
    private objNotify: NotificationService,
    private route: ActivatedRoute,
    private location: Location
    // private route: Router,
  )
  {
      this.contentGroup = {};
      this.contentGroupGeneral = [];
      this.contentGroupInfo = [];
      this.contentLangs = {};
      this.contentLangsPrev = {};
      this.contentHeadersEven = [];
      this.contentHeadersOdd = [];
      this.objAuth.isProcessing = false;
      this.changedFlag = false;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
    this.langId = +this.route.snapshot.paramMap.get('id');
    this.initPage();
  }
  initPage(): void {
    let elementsTemp: any, optionsTemp: any, headerName: string, elementName: string, optionName: string, arrayTemp = [];
    this.contentNames= ContentsProvider.filter(name => name.variety != 'number');
    this.contentHeaders = this.contentNames.filter(name => name.level == 1);
    this.contentHeadersMain = this.contentHeaders.filter(name => name.name != 'general' && name.name != 'tip');
    this.contentElements = this.contentNames.filter(name => name.level == 2 && name.lang_need != false);
    this.contentOptions = this.contentNames.filter(name => name.level == 3);
    // get group regarding contentHeaders
    this.contentHeaders.forEach((contentHeader) => {
      headerName = contentHeader.name;
      this.contentGroup[contentHeader.name] = [];
      arrayTemp = [];
      // add header
      if(headerName!='general'&&headerName!='tip')
        arrayTemp.push({key: headerName, val: contentHeader.val});
      // add element
      elementsTemp = this.contentElements.filter(name => name.parent_id == contentHeader.id);
      if(elementsTemp.length > 0){
          elementsTemp.forEach(element => {
            elementName = element.name;
            arrayTemp.push({key: elementName, val: element.val});
            // add options
            optionsTemp = this.contentOptions.filter(name => name.parent_id == element.id);
            if(optionsTemp.length > 0){
              optionsTemp.forEach(option => {
                optionName = option.name;
                arrayTemp.push({key: optionName, val: option.val});
              });
            }
          });
      }
      this.contentGroup[contentHeader.name] = arrayTemp;
      arrayTemp.forEach(temp => {
        this.contentLangs[temp.key] = '(German)' + this.dummy_data;
        // this.contentLangs[temp.key] = '(Russian)' + this.dummy_data;
      });
    });
    // get languages from the database
    this.getContentLang();
    // this.onChange();
  }
  // Save language
  saveLangs(){
    let changedArr = [];
    this.objAuth.isProcessing = false;
    for(let contentLang in this.contentLangs){
      if(this.contentLangs[contentLang] != this.contentLangsPrev[contentLang]){
        changedArr.push({lang_id: this.langId, category: 'content', page: 'page', name: contentLang, val: this.contentLangs[contentLang]});
        this.contentLangsPrev[contentLang] = this.contentLangs[contentLang];
      }
    }
    try {
      this.objBack.saveLangs(changedArr)
        .pipe()
        .subscribe((apiResponse) => {
            this.objNotify.success(apiResponse.status);       
            this.objAuth.isProcessing = false;
            this.onChange();
        },
        error => {
          this.objNotify.error(error.error.message);
          this.objAuth.isProcessing = false;
      });
    }
    catch (err) {
      this.objAuth.isProcessing = false;
    }  
  }
  // Get language
  async getContentLang(){
    this.objAuth.isProcessing= true;
    let promise = new Promise((resolve, reject) => {
      try {
        this.objBack.getTranslates(this.langId, 'content')
          .pipe()
          .subscribe((apiResponse) => {
            if(apiResponse.length > 0){
              apiResponse.forEach(lang => {
                this.contentLangs[lang.name] = lang.val;
                this.contentLangsPrev[lang.name] = lang.val;
              });
              this.objAuth.isProcessing = false;
            }
          },
          error => {
            console.log(error.error.message);
        });
      }
      catch (err) {
      }  
    });
    let x = await promise;
    this.objAuth.isProcessing = false;
    this.onChange();
  }
  onChange(){
    this.changedFlag = this.objBack.getDifference(this.contentLangs, this.contentLangsPrev).length > 0?true:false;
  } 
  goBack(){
    this.location.back();
  }
}
