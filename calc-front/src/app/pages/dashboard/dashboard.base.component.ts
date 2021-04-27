import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
@Component({
  selector: 'app-base-dashboard',
  template : `<router-outlet></router-outlet>`,
})
export class DashBoardBaseComponent implements OnInit {
  constructor(
    private objAuth: AuthService,
    private router: Router) {}
  ngOnInit() {
    // const user = this.objAuth.user;
    
    // let pages:any = this.router.config.filter(e => e.path == '');

    
    // if(pages.length) {
    //   let redirectPageIdex = pages[0].children.findIndex(e => e.redirectTo == 'home');
      
    //   if(this.objAuth.isLoggedIn) {
    //     if(user.user_role == 'individual') {
    //       pages[0].children[redirectPageIdex].redirectTo = "dashboard"
    //     }
    //   }
    // }
    // this.router.resetConfig(this.router.config);
    // console.log(this.router.config)
  }

}
