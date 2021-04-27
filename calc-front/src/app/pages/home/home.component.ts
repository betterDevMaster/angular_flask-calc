import { Component, OnInit } from '@angular/core';
import accountBalance from '@iconify/icons-ic/account-balance';
// import theme from 'src/@vex/utils/tailwindcss';
import faAward from '@iconify/icons-fa-solid/award';
import faRetweet from '@iconify/icons-fa-solid/retweet';
import faFingerprint from '@iconify/icons-fa-solid/fingerprint';
import faUserfriends from '@iconify/icons-fa-solid/user-friends';
import faRocket from '@iconify/icons-fa-solid/rocket';
import faMedal from '@iconify/icons-fa-solid/medal';
import faPoll from '@iconify/icons-fa-solid/poll';
import faLightbulb from '@iconify/icons-fa-solid/lightbulb';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  faAward = faAward;
  faRetweet = faRetweet;
  faFingerprint = faFingerprint;
  faUserfriends = faUserfriends;
  faRocket = faRocket;
  faPoll = faPoll;
  faLightbulb = faLightbulb;
  public user_role: any;
  accountBalance = accountBalance
  constructor(
    public objAuth: AuthService,
    public objLang: LangService,
    private router: Router,
  ) { }

  ngOnInit() {

    if (this.router.url == '/') {
      if (this.objAuth.isLoggedIn) {
        const user = this.objAuth.user;

        if (user.user_role == 'individual') {
          this.router.navigate(['/dashboard'])
        } else {
          this.router.navigate(['/home'])
        }
      }
    }
  }

}
