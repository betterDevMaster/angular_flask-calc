import {Component, OnInit } from '@angular/core';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import icGroup from '@iconify/icons-ic/group';
import icOutlineFlag from '@iconify/icons-ic/outline-flag';
import icLanguage from '@iconify/icons-ic/language';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import { BackService } from 'src/app/utils/services/back/back.service';
import { FrontService } from 'src/app/utils/services/front/front.service';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { finalize } from 'rxjs/operators';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import { LangService } from 'src/app/utils/services/language/language.service';


@Component({
  selector: 'vex-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  inputType = 'password';
  visible = false;

  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;
  icGroup = icGroup;
  icOutlineFlag = icOutlineFlag;
  icLanguage = icLanguage;
  public loginLangs={};
  public loginContents: any;
  public isProcessing = false;
  public langGroup: any;
  public countryGroup: any;
  public isSubmitted: boolean;
  constructor(private router: Router,
              private fb: FormBuilder,
              private objFront: FrontService,
              public objBack: BackService,
              private objAuth: AuthService,
              private objNotify: NotificationService,
              public objLang: LangService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      role   : ['', Validators.required],
      country   : ['', Validators.required],
      language   : [1, Validators.required],
    });
   }

  ngOnInit() {
    this.initPage();
  }
  initPage(): void {    
    // get languages activated
    this.objAuth.isProcessing = true;
    try {
      this.objBack.fetchLangActive()
        .pipe(
          finalize(() => {
            this.objAuth.isProcessing = false;
          }))
        .subscribe((apiResponse) => {                
          if (apiResponse.length > 0) {
              this.langGroup = apiResponse;
              this.registerForm.controls['language'].setValue(this.objLang.selectedLanguage['id']);
              this.getCountries();
          }
          else
            this.objAuth.isProcessing = false;
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
  getCountries(): void {
    try {
        this.objBack.fetchCountries()
        .pipe(
            finalize(() => {
              this.objAuth.isProcessing = false;
            }))
        .subscribe((apiResponse) => {
            if (apiResponse.length > 0) {
              this.countryGroup = apiResponse;
            }
            this.objAuth.isProcessing = false;
        });
    }
    catch (err) {
        this.objAuth.isProcessing = false;
    }
  }
  submitForm(): void {
    this.objAuth.isProcessing = true;
    this.objAuth.isProcessText = '';
    this.isSubmitted = true;
    try { 
        // this.objAuth.isProcessing = true;
        const requestData = {
            // name: this.registerForm.get('username').value,
            email: this.registerForm.get('email').value,
            password: this.registerForm.get('password').value,
            firstName: this.registerForm.get('firstName').value, 
            lastName: this.registerForm.get('lastName').value,               
            role: this.registerForm.get('role').value,
            country: this.registerForm.get('country').value,
            language: this.registerForm.get('language').value, 
        };
        this.objFront.register(requestData)
        .pipe(
            finalize(() => {
            this.objAuth.isProcessing = false;
            this.isSubmitted = false;
            }),
        ).subscribe(
            (apiResponse) => 
        {
          if(apiResponse.status == 'success'){
            this.objNotify.success(apiResponse.message);
            const key = new Date().getTime().toString();
            this.objAuth.setValueToLocalStorage('confirm_email', requestData.email);
            this.router.navigate(['/verify/'+this.registerForm.get('email').value]);
          }
          this.objAuth.isProcessing = false;
          // const key = new Date().getTime().toString();
          // this.objAuth.setValueToLocalStorage(key, requestData.email);
          // this.registerForm.reset();
          // this.router.navigate(['/login']);
        },
        error => {
            this.objNotify.error(error.error.message);
            this.objAuth.isProcessing = false;
        }
        );
    }
    catch (err) {
      this.objAuth.isProcessing = false;
    }
  } 
  setLanguage(lang_id): void
  {
    let langSelected = this.langGroup.filter(lang=>lang.id == lang_id)[0];
    this.objLang.getTranslates(langSelected);
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      // this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      // this.cd.markForCheck();
    }
  }
}
