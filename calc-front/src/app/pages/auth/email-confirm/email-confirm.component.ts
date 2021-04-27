import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import icMail from '@iconify/icons-ic/twotone-mail';
import { BackService } from 'src/app/utils/services/back/back.service';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'vex-email-confirm',
  templateUrl: './email-confirm.component.html',
  styleUrls: ['./email-confirm.component.scss'],
  animations: [fadeInUp400ms]
})
export class EmailConfirmComponent implements OnInit {

  form = this.fb.group({
    email: [null, Validators.required]
  });

  icMail = icMail;
  public isProcessing = false;
  public token: string;
  public display: string;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private objBack: BackService,
    private objAuth: AuthService,
    private objNotify: NotificationService
  ) { }

  ngOnInit() {
    let url = this.router.url.split('/');
    this.token = url[url.length-1];
    this.confirmEmail();
  }
  confirmEmail(): void {
    try {
      this.objAuth.isProcessing = true;
      this.objBack.confirmEmail({token: this.token})
        .pipe(
          finalize(() => {
            this.objAuth.isProcessing = false;
          }))
        .subscribe((apiResponse) => {
          setTimeout(()=>{ this.display = "" }, 10000)
          switch(apiResponse.status){
            case 'success':
              this.objNotify.success(apiResponse.msg);
              this.objAuth.goPage('/login');
              break;
            case 'error':
              this.objNotify.error(apiResponse.msg);
              this.objAuth.goPage('/register');
              break;
          }
        });
      }
      catch (err) {
        this.objAuth.isProcessing = false;
      }
  }
}
