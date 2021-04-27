import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { VexRoutes } from '../@vex/interfaces/vex-route.interface';
import { SharedModule } from 'src/app/shared.module';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';
import { AuthGuard } from './utils/guard/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { EncryptionService } from './utils/services/encryption/encryption.service';


const childrenRoutes: VexRoutes = [
  {
    // canActivate: [DefaultRedirectionGuard],
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
    // redirectTo: 'home',
    // pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
  },
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'admin',
        children: [
          {
            path: 'users',
            loadChildren: () => import('./pages/admin/users/users.module').then(m => m.UsersModule),
            data: {
              toolbarShadowEnabled: true
            }
          },
          {
            path: 'languages',
            loadChildren: () => import('./pages/admin/languages/languages.module').then(m => m.LanguagesModule),
            data: {
              toolbarShadowEnabled: true
            }
          },
          {
            path: 'countries',
            loadChildren: () => import('./pages/admin/countries/countries.module').then(m => m.CountriesModule),
            data: {
              toolbarShadowEnabled: true
            }
          }
        ]
      },
      {
        path: 'content-provider',
        loadChildren: () => import('./pages/content-provider/content-provider.module').then(m => m.ContentProviderModule),
      }
    ]
  },
  {
    path: 'individual',
    loadChildren: () => import('./pages/individual/individual.module').then(m => m.IndividualModule),
  },
  {
    path: 'dashboard',
    // canActivateChild: [AuthGuard],
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashBoardModule),
  },
  {
    path: 'loan',
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./pages/loan-details/loan-details.module').then(m => m.LoanDetailsModule),
  },
  {
    path: 'loan-menu',
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./pages/loan-menu/loan-menu.module').then(m => m.LoanMenuModule),
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: '**',
    loadChildren: () => import('./pages/errors/error-404/error-404.module').then(m => m.Error404Module)
  }
];

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then(m => m.RegisterModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
  },
  {
    path: 'verify/:email',
    loadChildren: () => import('./pages/auth/email-verify/email-verify.module').then(m => m.EmailVerifyModule),
  },
  {
    path: 'confirm/:token',
    loadChildren: () => import('./pages/auth/email-confirm/email-confirm.module').then(m => m.EmailConfirmModule),
  },
  {
    path: 'recover-password/:token',
    loadChildren: () => import('./pages/auth/recover-password/recover-password.module').then(m => m.RecoverPasswordModule),
  },
  {
    path: '',
    component: CustomLayoutComponent,
    children: childrenRoutes
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule, SharedModule]
})
export class AppRoutingModule {
  constructor(private objAuth: AuthService,
    private objEncryption: EncryptionService,
    private router: Router, routerModule: RouterModule) {

    // let user;


    // if (window.localStorage.getItem('user')) {
    //   user = JSON.parse(this.objEncryption.decryptData(window.localStorage.getItem('user')));
    // }

    // console.log(router.url)
    // if (user) {

    //   if (user.user_role == 'individual') {
    //    router.navigate(['/dashboard'])
    //   }
    // }
    // router.resetConfig(router.config);
    // console.log(router.config)
  }
}
