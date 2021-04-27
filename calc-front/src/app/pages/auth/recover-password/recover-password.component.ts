import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import icMail from '@iconify/icons-ic/twotone-mail';
import { BackService } from 'src/app/utils/services/back/back.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
@Component({
  selector: 'vex-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
  animations: [fadeInUp400ms]
})
export class RecoverPasswordComponent implements OnInit {
  form = this.fb.group({
    password: ['', Validators.required],
    passwordConfirm: ['', Validators.required],
  });
  inputType = 'password';
  visible = false;
  icMail = icMail;
  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;
  public isProcessing = false;
  public token: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private objBack: BackService,
    public objLang: LangService,
    private objNotify: NotificationService,
    private objAuth: AuthService
  ) {

   }

  ngOnInit() {
    let url = this.router.url.split('/');
    this.token = url[url.length-1];
  }

  send() {
    let password = this.form.get('password').value;
    let passwordConfirm = this.form.get('passwordConfirm').value;
    if(password != passwordConfirm){
      this.objNotify.warning('Password did not match. Please try again...');
    }
    else{
      try {
        this.objAuth.isProcessing = true;
        this.objBack.resetPassword({token: this.token, password: password})
          .pipe()
          .subscribe((apiResponse) => {
            switch(apiResponse.status){
              case 'success':
                this.objNotify.success(apiResponse.msg);
                this.objAuth.goPage('/login')
                break;
              case 'warning':
                    this.objNotify.warning(apiResponse.msg);
                    break;
              case 'error':
                this.objNotify.error(apiResponse.msg);
                break;
            }
              this.objAuth.isProcessing = false;
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
  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
    } else {
      this.inputType = 'text';
      this.visible = true;
    }
  }
}
