import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute  } from '@angular/router';
import { BackService } from 'src/app/utils/services/back/back.service';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import icMail from '@iconify/icons-ic/twotone-mail';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';

@Component({
  selector: 'email-verify-password',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.scss'],
  animations: [fadeInUp400ms]
})
export class EmailVerifyComponent implements OnInit {
  public confirm_email: string;
  public isProcessing = false;
  public email: string;
  icMail = icMail;

  constructor(
    private _route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private objBack: BackService,
    private objAuth: AuthService,
    private objNotify: NotificationService
  ) {
      
   }

  ngOnInit() {
    let url = this.router.url.split('/');
    this.email = url[url.length-1];
  }

  resend() {
    this.objAuth.isProcessing = true;
    try {
      this.objBack.resendEmail({email: this.email})
        .pipe()
        .subscribe((apiResponse) => {
          this.objNotify.success(apiResponse.msg);
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
