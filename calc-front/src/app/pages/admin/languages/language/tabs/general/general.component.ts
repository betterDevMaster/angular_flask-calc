import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { countries } from "country-flags-svg";
import { ContentsCommon } from "src/static-data/contents"
import { ReplaySubject, Subject } from 'rxjs';
import { Country } from './demo-data';
import { takeUntil } from "rxjs/operators";
import { BackService } from 'src/app/utils/services/back/back.service';
import { FrontService } from 'src/app/utils/services/front/front.service';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})

export class GeneralComponent implements OnInit {
  contents = ContentsCommon;
  public content_key = '';
  public category = 'common';
  public langId = 0;
  public isProcessing: boolean;
  public changedFlag = false;
  public changedData = [];
  public langs = {}
  public langsPrev = {};
  public country_no = 0;
  public countrySelected = countries[0];
  public countryCtrl: FormControl = new FormControl();
  /** control for the MatSelect filter keyword */
  public countryFilterCtrl: FormControl = new FormControl();
   /** list of banks filtered by search keyword */
   public filteredCountries: ReplaySubject<Country[]> = new ReplaySubject<Country[]>(1);
   protected _onDestroy = new Subject<void>();
  /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
  constructor(
    private objBack: BackService,
    private objFront: FrontService,
    private route: ActivatedRoute,
    private location: Location,
    private objNotify: NotificationService,
    private objAuth: AuthService
  ) { 
    this.initLangs();
  }

  ngOnInit() {
  }

  // Initialize
  initLangs(){
    this.contents.forEach(page => {
        page.children.forEach(content => {
            this.content_key = this.objBack.getLangKey(page.name, content.name);
            this.langs[this.content_key] = content.title;
            // this.langs[this.content_key] = '(Russian)' + content.title;
            // this.langsPrev[this.content_key] = this.langs[this.content_key];
            this.langsPrev[this.content_key] = '';
        });
    });
    this.langId = +this.route.snapshot.paramMap.get('id');
    this.getLangs(this.langId, this.category); 
  }

  // Get language
  getLangs(lang_id: any, category: string){
    try {
      this.objAuth.isProcessing= true;
      this.objBack.getTranslates(lang_id, category)
        .pipe()
        .subscribe((apiResponse) => {
          if(apiResponse.length > 0){
            apiResponse.forEach(lang => {
              this.content_key = this.objBack.getLangKey(lang.page, lang.name);
              this.langs[this.content_key] = lang.val;
              this.langsPrev[this.content_key] = lang.val;
            });
          }
          this.onChange();   
          this.objAuth.isProcessing = false;
        },
        error => {
          console.log(error,error.message);
          this.objAuth.isProcessing = false;
      });
    }
    catch (err) {
      this.objAuth.isProcessing = false;
    }  
  }
  // save data
  saveLangs(): void {
    let changedArr = [];
    this.contents.forEach(page => {
      page.children.forEach(content => {
        this.content_key = this.objBack.getLangKey(page.name, content.name);
        if(this.langs[this.content_key] != this.langsPrev[this.content_key]){
          changedArr.push({lang_id: this.langId, category: this.category, page: page.name, name: content.name, val: this.langs[this.content_key]});
          this.langsPrev[this.content_key] = this.langs[this.content_key];
        }
      });
    });
    this.objAuth.isProcessing = true;
    try {
      this.objBack.saveLangs(changedArr)
        .pipe(
          finalize(() => {
          }))
        .subscribe((apiResponse) => {
          this.objAuth.isProcessing = false;
          this.objNotify.success(apiResponse.status);  
          this.onChange();        
        });
    }
    catch (err) {
      this.objAuth.isProcessing = false;
    }
  }

  goBack(){
    this.location.back();
  }
  onChange(){
    this.changedFlag = this.objBack.getDifference(this.langs, this.langsPrev).length > 0?true:false;
  }
  
}
