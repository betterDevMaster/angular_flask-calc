import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import {HttpResponse} from '@angular/common/http';
// import {Http} from '@angular/common/http';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {MatSnackBar,MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition} from '@angular/material';
import { Location } from '@angular/common';
import { IndividualStatus } from 'src/static-data/contents'
import { User } from 'src/static-data/contents';
import { AuthService } from '../auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable({
  providedIn: 'root',
})
export class BackService {
  constructor(
    private objHttp: HttpClient,
    public snackBar: MatSnackBar,
    private location: Location,
    private _scrollToService: ScrollToService,
    private objCookieService: CookieService,
    private objEncryption: EncryptionService,
  ) { }
  individualStatus: IndividualStatus;
  // individualStatus = {};
  public triggerScrollTo(target: string) {
    
    const config: ScrollToConfigOptions = {
      target: target
    };
 
    this._scrollToService.scrollTo(config);
  }
  pageStatus = [
    {id: 1, name: 'basis', to: '/individual/basis'},
    {id: 2, name: 'individual', to: '/individual/individual'},
    {id: 3, name: 'household', to: '/individual/household'},
    {id: 4, name: "documents", to: "/individual/documents"},
    {id: 5, name: 'special', to: '/individual/special'},
    {id: 6, name: 'livingspace', to: '/individual/livingspace'},
    {id: 7, name: 'projectcost', to: '/individual/projectcost'}
  ];
  // Naming user
  public userRole = ['Admin', 'Individual', 'Content Provider', 'Both'];
  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  backPage(){
    this.location.back();
  }
  getDifference(object, base) {
    var difference = Object.keys(object).filter(k => object[k] !== base[k]);
    return difference;
  }
  // getDifference(object, base) {
  //   var difference = Object.keys(object).filter(k => object[k] !== base[k]);
  //   return difference;
  // }
  getLangKey(page: string, name: string):string{
    return (page+name);
  }
  getLangsKey(category: string, page: string, name: string):string{
    return (category+page+name);
  }
  getIndividualStatus(user_id: number){
    this.isDB(user_id).subscribe((apiResponse) => {
      this.individualStatus = apiResponse;
    });
  }
  login(data: any): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/Member/Login`,
      data
    );
  }

  fetchMembers(): Observable<any> {
    
    return this.objHttp.get(
      `${environment.baseUrl}/v1/members/admin`,
      {  }
    );
  }

  getValueFromCookie(key: string): string | null {
    if (this.objCookieService.get(key)) {
      return this.objEncryption.decryptData(this.objCookieService.get(key));
    }
  }

  updateMembers(data: any): Observable<any> {
    let headers = new HttpHeaders();
    
   let _headers = headers.append('Authorization','Bearer' + ' ' + data.access_token)
    return this.objHttp.put(
      `${environment.baseUrl}/v1/member/Update`, data , {
        headers:_headers
      }
    );
  }

  fetchMember(id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/member/admin`,
      { params }
    );
  }
  // Language service
  fetchLangs(): Observable<any> {
    
    return this.objHttp.get(
      `${environment.baseUrl}/v1/langs/admin`,
      {  }
    );
  }

  fetchLang(id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/lang/admin`,
      { params }
    );
  }
  fetchLangPage(lang_id: number, page: string): Observable<any> {
    
    let params = new HttpParams();
    params = params.append('lang_id', lang_id.toString());
    params = params.append('page', page);
    return this.objHttp.get(
      `${environment.baseUrl}/v1/langPage/admin`,
      { params }
    );
  }
  addLangDetails(data: any): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/lang/admin`,
      data
    );
  }
  saveLangs(data: object): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/lang/admin`,
      data
    );
  }
  fetchLangTitle(id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/langTitle/admin`,
      { params }
    );
  }
  addLang(data: any): Observable<any> {
    const params = data;
    return this.objHttp.post(
      `${environment.baseUrl}/v1/langTitle/admin`,
      params
    );
  }

  deleteLangDetails(id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/langDelete/admin`,
      { params }
    );
  }
  saveLang(data: any): Observable<any> {
    // const params = data;
    // params.status = (params.status === 'true');
    return this.objHttp.post(
      `${environment.baseUrl}/v1/langComponent/admin`,
      data
    );
  }
  getTranslates(lang_id: number, category: string): Observable<any> {
    
    let params = new HttpParams();
    params = params.append('lang_id', lang_id.toString());
    params = params.append('category', category.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/langComponent/admin`,
      { params }
    );
  }
  getTranslatesAll(lang_id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('lang_id', lang_id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/langComponentAll/admin`,
      { params }
    );
  }
  activeLang(id: number, status: boolean): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/langActive/admin`,
      { id: id, status: status }
    );
  }
  fetchLangActive(): Observable<any> {
    return this.objHttp.get(
      `${environment.baseUrl}/v1/langActive/admin`,
    );
  }
  fetchLangNewId(): Observable<any> {
    return this.objHttp.get(
      `${environment.baseUrl}/v1/langNewId/admin`,
      {}
    );
  }

  // Country
  fetchCountries(): Observable<any> {
    return this.objHttp.get(
      `${environment.baseUrl}/v1/countries/admin`,
      {  }
    );
  }
  addCountry(data: any): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/country/admin`,
      data
    );
  }
  
  deleteCountry(id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/countryDelete/admin`,
      { params }
    );
  }
  // Content Provider
  fetchContentNames(): Observable<any> {
    
    return this.objHttp.get(
      `${environment.baseUrl}/v1/names/content`,
      {}
    );
  }
  
  saveContentMain(data: any): Observable<any> {
    const params = data;
    params.status = (params.status === 'true');
    return this.objHttp.post(
      `${environment.baseUrl}/v1/mains/content`,
      params
    );
  }
  fetchContentMain(user_id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('user_id', user_id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/mains/content`,
      { params }
    );
  }
  fetchContentSurcharges(user_id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('user_id', user_id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/surcharges/content`,
      { params }
    );
  }
  fetchContentReductions(user_id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('user_id', user_id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/reductions/content`,
      { params }
    );
  }
  fetchContentRanges(user_id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('user_id', user_id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/ranges/content`,
      { params }
    );
  }
  fetchContentGuarantors(user_id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('user_id', user_id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/guarantors/content`,
      { params }
    );
  }
  
  saveContentSurcharges(data: any): Observable<any> {
    const params = data;
    return this.objHttp.post(
      `${environment.baseUrl}/v1/surcharges/content`,
      params
    );
  }
  saveContentReductions(data: any): Observable<any> {
    const params = data;
    return this.objHttp.post(
      `${environment.baseUrl}/v1/reductions/content`,
      params
    );
  }
  saveContentRanges(data: any): Observable<any> {
    const params = data;
    return this.objHttp.post(
      `${environment.baseUrl}/v1/ranges/content`,
      params
    );
  }
  saveContentGuarantors(data: any): Observable<any> {
    const params = data;
    return this.objHttp.post(
      `${environment.baseUrl}/v1/guarantors/content`,
      params
    );
  }

  // Individual
  fetchContentPage(val: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', val);
    return this.objHttp.get(
      `${environment.baseUrl}/v1/names/page`,
      { params }
    );
  }
  fetchIndividualBasis(user_id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('user_id', user_id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/basis/individual`,
      { params }
    );
  }
  calcBasis(data: any): Observable<any>{
    const params = data;
    return this.objHttp.post(
      `${environment.baseUrl}/v1/basis/individual`,
      params
    );
  }
  fetchIndividualIndividual(user_id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('user_id', user_id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/individual/individual`,
      { params }
    );
  }
  calcIndividual(data: any): Observable<any>{
    const params = data;
    return this.objHttp.post(
      `${environment.baseUrl}/v1/individual/individual`,
      params
    );
  }
  saveIndividual(data: any): Observable<any>{
    const params = data;
    return this.objHttp.post(
      `${environment.baseUrl}/v1/individualSave/individual`,
      params
    );
  }
  saveLocalToDb(basisInputs: any, individualInputs: any): Observable<any>{
    const params = {basisInputs: basisInputs, individualInputs: individualInputs};
    return this.objHttp.post(
      `${environment.baseUrl}/v1/individualLocalSave/individual`,
      params
    );
  }
  calcSpecial(data: any): Observable<any>{
    const params = data;
    return this.objHttp.post(
      `${environment.baseUrl}/v1/specialCalc/individual`,
      params
    );
  }
  saveSpecial(data: any, address: any): Observable<any>{
    const params = {inputs: data, address: address}
    return this.objHttp.post(
      `${environment.baseUrl}/v1/special/individual`,
      params
    );
  }
  fetchIndividualSpecial(user_id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('user_id', user_id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/special/individual`,
      { params }
    );
  }
  calcHousehold(data: any): Observable<any>{
    const params = data;
    return this.objHttp.post(
      `${environment.baseUrl}/v1/householdCalc/individual`,
      params
    );
  }
  fetchIndividualHousehold(user_id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('user_id', user_id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/household/individual`,
      { params }
    );
  }
  saveHousehold(data: any): Observable<any>{
    const params = data;
    return this.objHttp.post(
      `${environment.baseUrl}/v1/household/individual`,
      params
    );
  }
  calcLivingspace(data: any): Observable<any>{
    const params = data;
    return this.objHttp.post(
      `${environment.baseUrl}/v1/livingspaceCalc/individual`,
      params
    );
  }
  fetchLivingspace(user_id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('user_id', user_id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/livingspace/individual`,
      { params }
    );
  }
  saveLivingspace(user_id: any, data: any): Observable<any>{
    let params = {user_id: user_id, floors: data};
    return this.objHttp.post(
      `${environment.baseUrl}/v1/livingspace/individual`,
      params
    );
  }
  calcProjectcost(data: any): Observable<any>{
    const params = data;
    return this.objHttp.post(
      `${environment.baseUrl}/v1/projectcostCalc/individual`,
      params
    );
  }
  calcProjectcostTurnkey(inputs: any, turnkey: number): Observable<any>{
    const params = {inputs: inputs, turnkey: turnkey};
    return this.objHttp.post(
      `${environment.baseUrl}/v1/projectcostCalcTurnkey/individual`,
      params
    );
  }
  
  saveProjectcost(user_id: any, data: any): Observable<any>{
    let params = {user_id: user_id, inputs: data};
    return this.objHttp.post(
      `${environment.baseUrl}/v1/projectcost/individual`,
      params
    );
  }
  fetchProjectcost(user_id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('user_id', user_id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/projectcost/individual`,
      { params }
    );
  }
  postFile(fileToUpload: File, heading: any, person: any): Observable<any> {
    const endpoint = 'your-destination-url';
    const formData: FormData = new FormData();
    formData.append('heading', heading);
    formData.append('person', person);
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.objHttp.post(
      `${environment.baseUrl}/v1/fileUpload/individual`,
      formData
    );
  }
  deleteFile(document: any, heading: any, person: any): Observable<any> {
    let params = {document: document, heading: heading, person: person};
    return this.objHttp.post(
      `${environment.baseUrl}/v1/fileDelete/individual`,
      params
    );
  }
  saveDocuments(data, user_id){
    let params = {user_id: user_id, documents: data};
    return this.objHttp.post(
      `${environment.baseUrl}/v1/documents/individual`,
      params
    );
  }
  fetchDocuments(user_id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('user_id', user_id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/documents/individual`,
      { params }
    );
  }
  sendEmail(data: any): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/Member/Admin/SendEmails`,
      data
    );
  }
  confirmEmail(data: any): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/auth/confirm`,
      data
    );
  }
  resendEmail(data: any): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/auth/resend`,
      data
    );
  }
  sendForgotEmail(data: any): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/auth/forgot`,
      data
    );
  }
  resetPassword(data: any): Observable<any> {
    return this.objHttp.post(
      `${environment.baseUrl}/v1/auth/reset`,
      data
    );
  }
  isDB(user_id: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('user_id', user_id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/isDB/individual`,
      { params }
    );
  }
  fetchScenarios(user_id: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('userId', user_id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/individual/individual/userStressScenario`,
      { params }
    );
  }
  calcStressScenario(stressScenario: any): Observable<any>{
    return this.objHttp.post(
      `${environment.baseUrl}/v1/individual/individual/stressScenario`,
      stressScenario
    );
  }
  deleteStressScenario(id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id.toString());
    return this.objHttp.get(
      `${environment.baseUrl}/v1/individual/individual/stressScenarioDelete`,
      { params }
    );
  }
}
