import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { finalize } from 'rxjs/operators';
import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import icDownload from '@iconify/icons-ic/cloud-download';
import icUpload from '@iconify/icons-ic/cloud-upload';
import icDelete from '@iconify/icons-ic/delete';
import icAdd from '@iconify/icons-ic/add';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import { User } from 'src/static-data/contents';
import { Location } from '@angular/common';


@Component({
  selector: 'app-document-detail',
  templateUrl: './documents-detail.component.html',
  styleUrls: ['./documents-detail.component.scss']
})
export class DocumentsDetailComponent implements OnInit {
  @Input() user: User;
  icDownload = icDownload;
  icUpload = icUpload;
  icDelete = icDelete;
  icAdd = icAdd;
  constructor(
    public objAuth: AuthService,
    public objBack: BackService,
    public objLang: LangService,
    private httpClient: HttpClient,
    private objNotify: NotificationService,
    public location: Location
  ) { }
  public environment = environment;
  public martial_status: string;
  public isProcessing: boolean;
  public documentsInit = {
    identification: {person_1: '', person_2: ''},
    statement_bank: {person_1: [''], person_2: ['']},
    pay_slip: {person_1: [''], person_2: ['']},
    proof_assets: {person_1: [''], person_2: ['']},
    // don't need for single 2
    house_offer: {person_1: ''},
    basement: {person_1: ''},
    id_guarantor: {person_1: ''},
    proof_guarantor: {person_1: ['']},
    deed_suretyship: {person_1: ''}
  }
  public documents = {
    identification: {person_1: '', person_2: ''},
    statement_bank: {person_1: [''], person_2: ['']},
    pay_slip: {person_1: [''], person_2: ['']},
    proof_assets: {person_1: [''], person_2: ['']},
    // don't need for single 2
    house_offer: {person_1: ''},
    basement: {person_1: ''},
    id_guarantor: {person_1: ''},
    proof_guarantor: {person_1: ['']},
    deed_suretyship: {person_1: ''}
  };
  public documentHeadings = [
    {name: 'identification', title: 'Identification', more: false},
    {name: 'statement_bank', title: 'Statement of bank account', more: true, add_enable: false},
    {name: 'pay_slip', title: 'Pay slip/proof of income*', more: true, add_enable: false},
    {name: 'proof_assets', title: 'Proof of assets(*)', more: true, add_enable: false},
    {name: 'house_offer', title: 'House offer*', more: false},
    {name: 'basement', title: 'Basement/ Foundation/ Cellar offer*', more: false},
    {name: 'id_guarantor', title: 'ID guarantor(*)', more: false},
    {name: 'proof_guarantor', title: 'Proof of assets guarantor(*)', more: true, add_enable: false},
    {name: 'deed_suretyship', title: 'Deed of suretyship', more: false}
  ];
  fileToUpload: File = null;
  ngOnInit() {
    this.initData();
  }
  isEnable(){
    if(!this.objBack.individualStatus.individual){
      this.objNotify.warning('Please check potential on Personal data page.');
      this.location.back();
      return false;
    }
    return true;
  }
  async initData(){
    if(this.isEnable()){
        // check and fetch inputs from the db
      let promise2 = new Promise((resolve, reject) => {
        try {
          this.objBack.fetchDocuments(this.user['id'])
            .pipe(
              finalize(() => {
              }))
            .subscribe((apiResponse) => {
              this.martial_status = apiResponse.martial_status;
              if(this.martial_status == ''){
                this.objNotify.warning('You need to set the martial status on the individual page.');
                this.objAuth.goPage('/individual/individual');
              }
              if(apiResponse.documents.length > 0){
                let tempObj = apiResponse.documents[0];
                for(let key in tempObj){
                  this.documents[key] = JSON.parse(tempObj[key]);
                }
                console.log('this.documents');
                console.log(this.documents);
              }
              resolve('done');
            });
        }
        catch (err) {
          this.objAuth.isProcessing = false;
        }
      });
      let x2 = await promise2;
      let keys = Object.keys(this.documents);
      let len = keys.length;
      if(len == 0){
        for(let key in this.documentsInit){
          this.documents[key] = this.documentsInit[key];
        }
      }
    }
  }
  handleFileInput(files: FileList, heading: any, person: any, no: any) {
    let uploadTime = new Date().getTime();
    this.fileToUpload = files.item(0);
    this.objAuth.isProcessing = true;
    this.objAuth.isProcessText = 'Uploading';
    this.objBack.postFile(this.fileToUpload, heading, person).subscribe(data => {
      this.objAuth.isProcessing = false;
      this.objNotify.success(data.message);
      let heading_more = this.documentHeadings.filter(name=> name.name == heading)[0].more;
      if(heading_more){
        this.documents[heading][person][no] = this.fileToUpload.name;
        this.documents[heading][person].push('');
        this.documentHeadings.filter(name=> name.name == heading)[0].add_enable = false;
      }
      else
        this.documents[heading][person] = this.fileToUpload.name;
      this.saveDocuments();
    }, error => {
      this.objAuth.isProcessing = false;
      this.objNotify.error(error.error.message);
      
    });
  }
  deleteDocument(document: any, heading: any, person: any, no: any) {
    this.objBack.deleteFile(document, heading, person).subscribe(data => {
      // this.objNotify.success(data.message);
      let heading_more = this.documentHeadings.filter(name=> name.name == heading)[0].more;
      if(heading_more){
        this.documents[heading][person].splice(no, 1);
        this.documentHeadings.filter(name=> name.name == heading)[0].add_enable = false;
      }
      else
        this.documents[heading][person] = '';
      this.saveDocuments();
    }, error => {
      this.objNotify.error(error);
    });
  }
  async saveDocuments(){
    
    let promise1 = new Promise((resolve, reject) => {
      try {
        this.objBack.saveDocuments(this.documents, this.user['id'])
          .pipe()
          .subscribe((apiResponse) => {
            this.objBack.individualStatus.documents = true;
            this.objAuth.isProcessing = false;
            resolve('done');
          },
          error => {
            console.log('invalid');
            console.log('error save');
            console.log(error);
            this.objAuth.isProcessing = false;
          });
      }
      catch (err) {
        this.objAuth.isProcessing = false;
      }
    });
    let x = await promise1;
  }
  getImage(imageUrl: string): Observable<Blob> {
    return this.httpClient.get(imageUrl, { responseType: 'blob' });
  }
  enableAdd(heading){
    this.documentHeadings[heading].add_enable = true;
  }
  

}
