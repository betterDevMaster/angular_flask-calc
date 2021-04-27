import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { NavigationService } from 'src/@vex/services/navigation.service';
import { LangService } from 'src/app/utils/services/language/language.service';

import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class FrontService {
  constructor(
    private objHttp: HttpClient,
    private objRouter: Router,
    private objAuth: AuthService,
    private objNav: NavigationService,
    private objLang: LangService
  ) { }

  login(data: any): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/auth/login`,
      data
    ).pipe(map(res => res));
  }
  logout(): void {
    this.objAuth.logout();
    this.objLang.getSelectedLang();
    this.objNav.setNav('');
    this.objRouter.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    
  }
  register(data: any): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/auth/register`,
      data
    ).pipe(map(res => res));
  }

  resendEmail(data: any): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/Member/ResendVerifyEmail`,
      data
    ).pipe(map(res => res));
  }

  forgotPassword(data: any): Observable<any> {
    return this.objHttp.put(
      `${environment.baseUrl}/v1/Member/ForgotPassword`,
      data
    ).pipe(map(res => res));
  }

  resetPassword(data: any): Observable<any> {
    return this.objHttp.put(
      `${environment.baseUrl}/v1/Member/ResetPassword`,
      data
    ).pipe(map(res => res));
  }

  emailVerification(data: any): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/Member/VerifyEmail`,
      data
    ).pipe(map(res => res));
  }

  getMember(): Observable<any> {
    return this.objHttp.get(
      `${environment.baseUrl}/v1/Member`
    ).pipe(map(res => res));
  }

  getLanguages(): Observable<any> {
    return this.objHttp.get(
      `${environment.baseUrl}/v1/Member/Languages`
    ).pipe(map(res => res));
  }

  updateProfile(data: any): Observable<any> {
    return this.objHttp.put(
      `${environment.baseUrl}/v1/Member`,
      data
    ).pipe(map(res => res));
  }

  changePassword(data: any): Observable<any> {
    return this.objHttp.put(
      `${environment.baseUrl}/v1/Member/ChangePassword`,
      data
    ).pipe(map(res => res));
  }

  checkUsernameAvailability(param: HttpParams): Observable<any> {
    return this.objHttp.get(
      `${environment.baseUrl}/v1/Member/CheckUniqueId`,
      { params: param }
    ).pipe(map(res => res));
  }

  checkNickNameAvailability(param: HttpParams): Observable<any> {
    return this.objHttp.get(
      `${environment.baseUrl}/v1/Member/CheckUniqueNickName`,
      { params: param }
    ).pipe(map(res => res));
  }

  checkEmailAvailability(param: HttpParams): Observable<any> {
    return this.objHttp.get(
      `${environment.baseUrl}/v1/Member/CheckUniqueEmail`,
      { params: param }
    ).pipe(map(res => res));
  }

  cancelMembership(data: any): Observable<any> {
    return this.objHttp.put(
      `${environment.baseUrl}/v1/Member/CancelMemberShip`,
      data
    ).pipe(map(res => res));
  }

  download(data: any): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/Member/AppDownloads`,
      data
    ).pipe(map(res => res));
  }

  getMessagesList(param: HttpParams): Observable<any> {
    return this.objHttp.get(
      `${environment.baseUrl}/v1/Message`,
      { params: param }
    ).pipe(map(res => res));
  }

  addMessage(data: any): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/Message`,
      data
    ).pipe(map(res => res));
  }

  replyMessage(data: any): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/Message/Reply/`,
      data
    ).pipe(map(res => res));
  }

  getMessage(messageId: string): Observable<any> {
    return this.objHttp.get(
      `${environment.baseUrl}/v1/Message/GetMessageById/${messageId}`
    ).pipe(map(res => res));
  }

  getMessagesReplies(messageId: string, param: HttpParams): Observable<any> {
    return this.objHttp.get(
      `${environment.baseUrl}/v1/Message/${messageId}`,
      { params: param }
    ).pipe(map(res => res));
  }
  
  deleteMessage(messageId: string): Observable<any> {
    return this.objHttp.delete(
      `${environment.baseUrl}/v1/Message/${messageId}`
    ).pipe(map(res => res));
  }

  likeDislikeMsg(messageId: string, data: any): Observable<any> {
    return this.objHttp.put(
      `${environment.baseUrl}/v1/Message/LikeOrDislike/${messageId}`,
      data
    ).pipe(map(res => res));
  }

  increaseView(messageId: string, data: any): Observable<any> {
    return this.objHttp.put(
      `${environment.baseUrl}/v1/Message/UpdateViews/${messageId}`,
      data
    ).pipe(map(res => res));
  }
  getContent() {
    return this.objHttp.get('/assets/contents.json').pipe(map(res => res));
  }

}
