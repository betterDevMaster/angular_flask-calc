import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from '../encryption/encryption.service';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { tap, map, catchError, timeout, finalize } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { NotificationService } from '../notification/notification.service';
import { User } from 'src/static-data/contents';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private skipLogout = ['get-auth-token-user'];
  public userdata: BehaviorSubject<any> = new BehaviorSubject({});
  public userRole = {admin:'Admin', individual: 'Individual', content: 'Content Provider', both: 'Both'};
  public isLoggedIn: Boolean;
  public isProcessing: Boolean;
  public isProcessText: string = "Loading";
  public user: User;
  public langIDTest: any;
  constructor(
    private objRouter: Router,
    private objHttp: HttpClient,
    private objNotify: NotificationService,
    private objEncryption: EncryptionService,
    private objCookieService: CookieService,
    private objBack: BackService
  ) { }
  checkRoleNaviate(pageRole: any) {
    let currentRole, user: any, userInfo: any;
    user = this.getValueFromLocalStorage('user');
    if(user != null){
      userInfo = JSON.parse(this.getValueFromLocalStorage('user'));
      currentRole = userInfo['user_role'];
      if(pageRole != currentRole){
        if(!((pageRole == 'content') && (currentRole == 'both'))){
          this.objRouter.navigate(['/error-auth']);
        }
      }
    }
    else{
      this.objRouter.navigate(['/error-auth']);
    }
  }
  goPage(pageRoute: any){
    let isEnable = true;
    if(this.isLoggedIn && this.user.user_role == 'individual'){
      if(!this.objBack.individualStatus['basis']){
        switch(pageRoute){
          case '/individual/individual':
          case '/individual/projectcost':
            this.objNotify.warning('Please analyse potential on Loan data page.');
            isEnable = false;
            break;
        }
      }
      if(!this.objBack.individualStatus.individual){
        switch(pageRoute){
          case '/individual/documents':
          case '/individual/household':
            this.objNotify.warning('Please check potential on Personal data page.');
            isEnable = false;
            break;
        }
      }
    }
    if(isEnable)
      this.objRouter.navigate([pageRoute]);
  }
  redirectPage(userRole: any){
    
    switch(userRole){
      case 'admin':
        this.objRouter.navigate(['/admin/users']);
        break;
    case 'individual':
        // this.objRouter.navigate(['individual/overview']);
        this.objRouter.navigate(['/dashboard/index']);
        break;
    case 'content':
        this.objRouter.navigate(['/content-provider']);
        break;
    default:
        this.objRouter.navigate(['/login']);
        break;
    }
  }
  setUserData(data: any): any {
    this.userdata.next(data);
  }
  setUserData1(data: any): any {
  }
  getUserData(): any {
    return this.userdata.value;
  }
  getUserAuth(): any{
    let userStorage = this.getValueFromLocalStorage('user');
    if(userStorage != null){
      this.isLoggedIn = true;
      this.user = JSON.parse(userStorage);
      return true;
    }
    else{
      this.isLoggedIn = false;
    }
  }

  getBaseUrl(): string {
    return this.getUserData().baseUrl;
  }

  getAuthToken(): string {
    return this.getValueFromCookie('token');
  }

  getUserLocalData(): string {
    return this.getValueFromCookie('calcUser');
  }

  logout(): void {
    this.clearStorage();
    this.isLoggedIn = false;
    this.objRouter.navigate(['/']);
  }

  setValueToCookie(key: string, value: string, cookieExpiryTime?: number): void {
    this.objCookieService.set(key, this.objEncryption.encryptData(value), cookieExpiryTime, '/');
  }

  getValueFromCookie(key: string): string | null {
    if (this.objCookieService.get(key)) {
      return this.objEncryption.decryptData(this.objCookieService.get(key));
    }
  }

  setValueToLocalStorage(key: string, value: string): void {
    window.localStorage.setItem(key, this.objEncryption.encryptData(value));
  }

  getValueFromLocalStorage(key: string): string | null {
    if (window.localStorage.getItem(key)) {
      return this.objEncryption.decryptData(window.localStorage.getItem(key));
    }
  }

  clearStorage(): void {
    window.localStorage.clear();
    this.removeStorageKey('calcUser');
    this.removeStorageKey('token');
  }

  removeStorageKey(key: string): void {
    this.objCookieService.delete(key, '/');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken: string = this.getAuthToken();

   

    let headers = new HttpHeaders();
    if (request.headers.get('Content') !== 'file') {
      if (request.headers.get('Content-Type')) {
        headers = headers.set('Content-Type', request.headers.get('Content-Type'));
      }
      else {
        headers = headers.set('Content-Type', 'application/json');
      }
    }

    if (authToken) {
      headers = headers.set('Authorization', authToken);
      headers = headers.set('id', JSON.parse(this.getUserLocalData()).memberId);
    }

    request = request.clone({ headers });

    return next.handle(request)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && event.status === 200) {
            if (event.body.message) {
              if (event.body.response_Code === 1) {
                this.objNotify.success(event.body.message);
              }
              else {
                this.objNotify.info(event.body.message);
              }
            }
          }
        }),
        catchError((response) => {
          if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 422) {
            if (response.error != null) {
              let html = '';
              if (response.error.message) {
                html += response.error.message;
              }
              else if (response.error.errors) {
                Object.keys(response.error.errors).forEach((key) => {
                  html += key + ' : ' + response.error.errors[key].msg + '</br>';
                });
              }
              this.objNotify.warning(html);
            }

            if (response.status === 401) {
              console.log(authToken);
              const requestUrl = response.url.split('/');
              if (!this.skipLogout.some(r => requestUrl.includes(r))) {
                this.logout();
              }
            }
          }
          else if (response.status === 404) {
            this.objNotify.warning('Request not completed.');
          }
          else {
          }
          return throwError(response);
        }),
        timeout(15000),
        finalize(() => { })
      );
  }

}
