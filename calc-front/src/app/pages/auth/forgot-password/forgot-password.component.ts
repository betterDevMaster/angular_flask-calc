import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import icMail from '@iconify/icons-ic/twotone-mail';
import { BackService } from 'src/app/utils/services/back/back.service';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';

@Component({
  selector: 'vex-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [fadeInUp400ms]
})
export class ForgotPasswordComponent implements OnInit {
  form = this.fb.group({
    email: [null, Validators.required]
  });
  icMail = icMail;
  public isProcessing = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private objBack: BackService,
    private objLang: LangService,
    private objAuth: AuthService,
    private objNotify: NotificationService,
  ) { }

  ngOnInit() {
  }

  send() {
    try {
      this.objAuth.isProcessing = true;
      this.objBack.sendForgotEmail({email: this.form.get('email').value})
        .pipe()
        .subscribe((apiResponse) => {
          this.objAuth.isProcessing = false;
          switch(apiResponse.status){
            case 'success':
              this.objNotify.success(apiResponse.msg);
              break;
            case 'error':
              this.objNotify.error(apiResponse.msg);
              break;
          }
        },
        error => {
          this.objAuth.isProcessing = false;
      });
    }
    catch (err) {
      this.objAuth.isProcessing = false;
    }  
  }
}
