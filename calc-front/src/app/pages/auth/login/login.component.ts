import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import { finalize } from 'rxjs/operators';
import { FrontService } from 'src/app/utils/services/front/front.service';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import { NavigationService } from 'src/@vex/services/navigation.service';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import icLanguage from '@iconify/icons-ic/language';
@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  inputType = 'password';
  visible = false;
  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;
  icLanguage = icLanguage;
  // public rememberMe: Boolean
  public cookieExpiryTime: number;
  public isSubmitted: boolean;
  public isProcessing: boolean;  
  public pageId: number;
  public langGroup: any;
  public loginContents: any;
  public loginLangs={};
  public selectedLang = 0;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private objAuth: AuthService,
    private objFront: FrontService,
    private objBack: BackService,
    private navigationService: NavigationService,
    private objNotify: NotificationService,
    public objLang: LangService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      // language   : [1],
      rememberMe: [false]
    });
    if (this.objAuth.getValueFromCookie('qwus'))
      this.loginForm.get('rememberMe').setValue(true);
    // this.getLangs();
  }

  ngOnInit() {
    this.selectedLang = this.objLang.selectedLanguage['id'];
  }
  getLangs(): void {    
    try {
      this.objAuth.isProcessing = true;

      this.objBack.fetchLangActive()
        .pipe(
          finalize(() => {
            this.objAuth.isProcessing = false;
          }))
        .subscribe((apiResponse) => {  
          this.objAuth.isProcessing = false;              
          if (apiResponse.length > 0) {
              this.langGroup = apiResponse;
              this.selectedLang = this.objLang.selectedLanguage['id'];
          }
        },
        error => {
          this.objNotify.success('error.error.message');
          this.objAuth.isProcessing = false;
        });
    }
    catch (err) {
      this.objAuth.isProcessing = false;
    }
  }
  async login(){
    this.isSubmitted = true;
    try {
        this.objAuth.isProcessing = true;            
        const requestData = {
          email: this.loginForm.get('email').value,
          password: this.loginForm.get('password').value,
        };
        this.objFront.login(requestData)
          .pipe(
            finalize(() => {
              this.objAuth.isProcessing = false;
              this.isSubmitted = false;
            })
          ).subscribe((apiResponse) => {
            switch (apiResponse.status) {
              case 'info':
                this.objNotify.info(apiResponse.msg);
                break;
              case 'success':
                this.navigationService.setNav(apiResponse.user_role);
                this.setAuthData(apiResponse);
                if(apiResponse.user_role == 'individual')
                  this.setIndividualData(apiResponse);
                this.objAuth.redirectPage(apiResponse.user_role);
                break;
            }
        },
        error => {
          this.objNotify.error(error.error.message);
        });
    }
    catch (err) {
        this.objAuth.isProcessing = false;
    }
  }
  setAuthData(user){
    let cookieExpiryTime: number;
    this.objAuth.setUserData(user);
    if (this.loginForm.get('rememberMe').value) {
      cookieExpiryTime = 30;
      this.objAuth.setValueToCookie('qwus', user.email, cookieExpiryTime);
    }
    else {
        this.objAuth.removeStorageKey('qwus');
    }
    // save user info to cookie and local storage
    this.objAuth.setValueToCookie('calcUser', JSON.stringify(user), cookieExpiryTime);
    this.objAuth.setValueToCookie('token', user.accessToken, cookieExpiryTime);
    this.objAuth.setValueToLocalStorage('user', JSON.stringify(user));
    this.objAuth.isLoggedIn = true;
    this.objAuth.user = user;
  }
  setLanguage(lang_id): void
  {
    let langSelected = this.objLang.langs.filter(lang=>lang.id == lang_id)[0];
    this.objLang.getTranslates(langSelected);
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
    } else {
      this.inputType = 'text';
      this.visible = true;
    }
  }
  async setIndividualData(user){
    if(localStorage.getItem("individualInputs") != null && localStorage.getItem("pr") != null){
      let basisInputs = JSON.parse(this.objAuth.getValueFromLocalStorage('basisInputs'));
      basisInputs['user_id'] = user.id;
      let individualInputs = JSON.parse(this.objAuth.getValueFromLocalStorage('individualInputs'));
      individualInputs['user_id'] = user.id;
      // Save data to the db
      let promise3 = new Promise((resolve, reject) => {
        try {
          this.objBack.saveLocalToDb(basisInputs, individualInputs)
            .pipe()
            .subscribe((apiResponse) => {
              if(apiResponse.status == 'success'){
                localStorage.removeItem('individualInputs');
                localStorage.removeItem('basisInputs');
              }
              else if(apiResponse.status == 'error'){
                this.objNotify.error('Failed save!');
              }
              resolve('done');
            },
            error => {
              this.objAuth.isProcessing = false;
            });
        }
        catch (err) {
          this.objAuth.isProcessing = false;
        }
      });
      let y = await promise3;
    }
    this.objBack.getIndividualStatus(this.objAuth.user.id);
  }
}
