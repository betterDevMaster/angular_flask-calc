import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackService } from 'src/app/utils/services/back/back.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {MatSnackBar,MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition,} from '@angular/material';
import { Location } from '@angular/common';
import icEdit from '@iconify/icons-ic/edit';
import icSettings from '@iconify/icons-ic/settings';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icSave from '@iconify/icons-ic/save';
import { countries } from "country-flags-svg";
import {Country} from 'src/static-data/contents';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import { AuthService } from 'src/app/utils/services/auth/auth.service';


@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
  icSettings = icSettings;
  icMoreVert = icMoreVert;
  icSave = icSave;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  public langId = 0;
  public isProcessing = false;
  public titleChangedFlag = false;
  public pageTitle = '';
  public titleForm = {id: 0, name: '', foreign: '', flag: {}, status: false};
  public titleFormPrev = {id: 0, name: '', foreign: '', flag: {}, status: false};
  
  // variables for flag
  public countryCtrl: FormControl = new FormControl();
  /** control for the MatSelect filter keyword */
  public countryFilterCtrl: FormControl = new FormControl();
   /** list of banks filtered by search keyword */
   public filteredCountries: ReplaySubject<Country[]> = new ReplaySubject<Country[]>(1);
   protected _onDestroy = new Subject<void>();
   public countryFlags = [];

  /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
  constructor(
    private _formBuilder: FormBuilder,
    private objBack: BackService,
    private objLang: LangService,
    private objAuth: AuthService,
    private objNotify: NotificationService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private location: Location,
    private cd: ChangeDetectorRef
  ) {
    // set initial selection
    countries.forEach(element => {
      this.countryFlags.push({name: element.name, iso2: element.iso2});
    });
    this.titleForm.flag = this.countryFlags[0];
    this.countryCtrl.setValue(this.countryFlags[0]);
    // load the initial bank list
    this.filteredCountries.next(this.countryFlags.slice());
     this.countryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCountries();
      }); 
    
    this.langId = +this.route.snapshot.paramMap.get('id');
    this.getLangTitle();
  }
  ngOnInit() {
    // check if the action is edit or create
    
  }
  protected filterCountries() {
    if (!this.countryFlags) {
      return;
    }
    // get the search keyword
    let search = this.countryFilterCtrl.value;
    if (!search) {
      this.filteredCountries.next(this.countryFlags.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCountries.next(
      this.countryFlags.filter(country => country.name.toLowerCase().indexOf(search) > -1)
    );
  }
  getLangTitle(): void {
    try {
      this.objAuth.isProcessing = true;
      this.objBack.fetchLangTitle(this.langId)
        .pipe(
          finalize(() => {
            this.objAuth.isProcessing = false;
          }))
        .subscribe((apiResponse) => {
          if (apiResponse.length > 0) {
            for(let key in this.titleForm){
              if(key == 'flag'){
                for(let flagKey in this.titleForm.flag){
                  this.titleForm.flag[flagKey] = JSON.parse(apiResponse[0][key])[flagKey];
                  this.titleFormPrev.flag[flagKey] = JSON.parse(apiResponse[0][key])[flagKey];
                }

              }else{
                this.titleForm[key] = apiResponse[0][key];
                this.titleFormPrev[key] = apiResponse[0][key];
              }
            }
            this.cd.detectChanges();
            this.pageTitle = this.titleForm['name'];
          }
        });
      }
      catch (err) {
        this.objAuth.isProcessing = false;
      }
  }
  saveLangTitle(): void {
    if(this.titleChangedFlag){
      try {
        this.objAuth.isProcessing = true;
        this.objBack.addLang(this.titleForm)
          .pipe()
          .subscribe((apiResponse) => {
            this.objNotify.success(apiResponse.status);
            this.pageTitle = this.titleForm.name;
            this.titleChangedFlag = false;
            for(let key in this.titleForm){
              this.titleFormPrev[key] = this.titleForm[key];
            }
            this.objLang.getLangs();
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
  }
  onChange(): void {
    let changedItems = [];
    changedItems = this.objBack.getDifference(this.titleForm, this.titleFormPrev);
    if(changedItems.length == 1 && changedItems[0] == 'flag')
      this.titleChangedFlag = this.titleForm.flag['name'] != this.titleFormPrev.flag['name']?true:false;
    else
      this.titleChangedFlag = changedItems.length>0?true:false;
  }
}
