import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ContentsIndividual} from 'src/static-data/contents'
import { NotificationService } from 'src/app/utils/services/notification/notification.service';

@Component({
    selector     : 'language-individual',
    templateUrl  : './individual.component.html',
    styleUrls    : ['./individual.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class IndividualComponent implements OnInit
{
    contents = ContentsIndividual;
    public isProcessing: boolean;
    public langs = {};
    public langsPrev = {};
    public langId = 0;
    public changedFlag = false;
    public category = 'individual';
    public content_key = '';
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     */
    constructor(
        private route: ActivatedRoute,
        private objBack: BackService ,
        private objAuth: AuthService,
        private objNotify: NotificationService
    )
    {
        this.initLangs();
    }

    ngOnInit(): void {
    }
    initLangs(){
        this.contents.forEach(page => {
            page.children.forEach(content => {
                this.content_key = this.objBack.getLangKey(page.name, content.name);
                // this.langs[this.content_key] = content.title;
                // this.langs[this.content_key] = '(German)' + content.title;
                // this.langs[this.content_key] = '(Russian)' + content.title;
                this.langsPrev[this.content_key] = '';
            });
        });
        this.langId = +this.route.snapshot.paramMap.get('id');
        this.getLangs(this.langId, this.category); 
    }

    getLangs(lang_id: any, category: string){
        try {
        this.objAuth.isProcessing= true;
        this.objBack.getTranslates(lang_id, category)
            .pipe()
            .subscribe((apiResponse) => {
            if(apiResponse.length > 0){
                apiResponse.forEach(lang => {
                    this.content_key = this.objBack.getLangKey(lang.page, lang.name);
                    this.langs[this.content_key] = lang.val;
                    this.langsPrev[this.content_key] = lang.val;
                });
            }
            this.onChange();       
            this.objAuth.isProcessing = false;
            },
            error => {
            console.log(error,error.message);
            this.objAuth.isProcessing = false;
        });
        }
        catch (err) {
        this.objAuth.isProcessing = false;
        }  
    }
    saveLangs(): void {
        let changedArr = [];
        this.contents.forEach(page => {
            page.children.forEach(content => {
                this.content_key = this.objBack.getLangKey(page.name, content.name);
                if(this.langs[this.content_key] != this.langsPrev[this.content_key]){
                    changedArr.push({lang_id: this.langId, category: this.category, page: page.name, name: content.name, val: this.langs[this.content_key]});
                    this.langsPrev[this.content_key] = this.langs[this.content_key];
                  }
            });
        });
        this.objAuth.isProcessing = true;
        try {
          this.objBack.saveLangs(changedArr)
            .pipe(
              finalize(() => {
              }))
            .subscribe((apiResponse) => {
              this.objAuth.isProcessing = false;
              this.objNotify.success(apiResponse.status);  
              this.onChange();        
            });
        }
        catch (err) {
          this.objAuth.isProcessing = false;
        }
      }
    goBack(){
      }
    onChange(){
        this.changedFlag = this.objBack.getDifference(this.langs, this.langsPrev).length > 0?true:false;
    } 
    
}
