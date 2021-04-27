import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { BackService } from '../back/back.service';
import { finalize } from 'rxjs/operators';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import { NavigationService } from 'src/@vex/services/navigation.service';
import { Router } from '@angular/router';
import { ContentObserver } from '@angular/cdk/observers';
@Injectable({
  providedIn: 'root'
})
export class LangService {
  public user: {};
  public user_language: any;
  public lang_id: any;
  public langs: any;
  public langFlags = [];
  public langsKey = '';
  public isProcessing: Boolean;
  public translates = {};
  public translatesPrev = {};
  public translateFlag = false;
  public selectedLanguage= {};
  public selectedFlag= '';
  public contentVals = {};
  public contentValsPrev = {};

  public reduction_options = [];
  public purchasing_starting_options = [];
  public net_reduction_options = [];
  public guarantor_reduction_options = [];

  constructor(
    private objRouter: Router,
    private objAuth: AuthService,
    private objBack: BackService,
    private objLang: LangService,
    private objNotify: NotificationService,
    private objNav: NavigationService) 
  {
  }
  initTranslates(langs){
    this.translates = langs;
    for(let lang in this.translates){
      this.translatesPrev[lang] = this.translates[lang];
    }
  }
  updateTranslates(langs){
    for(let lang in this.translates){
      this.translatesPrev[lang] = this.translates[lang];
    }
    this.translates = langs;
  }
  
  getLangs() {    
    this.objBack.fetchLangActive()
      .subscribe((apiResponse) => {
        if (apiResponse.length > 0) {
          this.langs = apiResponse;
          this.langFlags = [];
          this.langs.forEach(lang => {
            this.langFlags.push(JSON.parse(lang['flag'])['iso2']);
          });
          this.getSelectedLang();
        }
      },(err) => {
        console.log(err);
      });
  }
  getSelectedLang(){
    let lang = this.objAuth.isLoggedIn?this.langs.filter(name => name.id==this.objAuth.user['user_language'])[0]:this.langs[0];
    this.getTranslates(lang);
  }
  getTranslates(lang) {
    this.selectedLanguage = lang;
    this.selectedFlag = JSON.parse(this.selectedLanguage['flag'])['iso2'];
    let role = this.objAuth.isLoggedIn?this.objAuth.user.user_role:'individual';
    this.objAuth.isProcessing = true;
    this.objBack.getTranslatesAll(lang['id'])
    .subscribe((apiResponse) => {
        this.objAuth.isProcessing = false;
        if (apiResponse.length > 0) {
          
          apiResponse.forEach(lang => {
            this.langsKey = this.objBack.getLangsKey(lang.category, lang.page, lang.name);
            this.translatesPrev[this.langsKey] = this.translates[this.langsKey];
            this.translates[this.langsKey] = lang.val;
          });
          console.log('translates');
          console.log(this.translates);
          // if contentVals exist, update some words according the translates
          if(role == 'content' && Object.keys(this.contentVals).length > 0){
            let key_no_reduction = 'contentcontentno_reduction';
            let key_not_accepted = 'contentcontentnot_accepted';
            for(let key in this.contentVals){
              this.langsKey = this.objBack.getLangsKey('content', 'content', key);
              switch(this.contentVals[key]){
                case this.translatesPrev[key_no_reduction]:
                  this.contentVals[key] = this.translates[key_no_reduction];
                  break;
                case this.translatesPrev[key_not_accepted]:
                  this.contentVals[key] = this.translates[key_not_accepted];
                  break;
              }
              this.reduction_options = this.updateOptions(this.reduction_options);
              this.purchasing_starting_options =  this.updateOptions(this.purchasing_starting_options);
              this.net_reduction_options = this.updateOptions(this.net_reduction_options);
              this.guarantor_reduction_options = this.updateOptions(this.guarantor_reduction_options);
            }
          }
        }
        else{
            this.objNotify.warning('This language is unavailabe!');
        }
    });
  }
  updateOptions(array){
    let key_not_accepted = 'contentcontentnot_accepted';
    let key_no_reduction = 'contentcontentno_reduction';
    array.forEach((option, index) => {
      switch(option){
        case this.translatesPrev[key_no_reduction]:
          array[index] = this.translates[key_no_reduction];
          break;
        case this.translatesPrev[key_not_accepted]:
          array[index] = this.translates[key_not_accepted];
          break;
      }
    });
    return array;
  }
}
