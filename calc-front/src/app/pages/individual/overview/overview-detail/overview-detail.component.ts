import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import icMoreVert from '@iconify/icons-ic/more-vert';
import { User } from 'src/static-data/contents';
export interface PeriodicElement {
  name: string;
  position: number;
  status: string;
  to: string;
}

@Component({
  selector: 'app-overview-detail',
  templateUrl: './overview-detail.component.html',
  styleUrls: ['./overview-detail.component.scss']
})
export class OverviewDetailComponent implements OnInit {
  @Input() user: User;
  icMoreVert = icMoreVert;
  public imgCheck = 'assets/img/checkbox/check2.png';
  public imgUncheck = 'assets/img/checkbox/uncheck2.png';
  public isProcessing = false;
  public isDb = false;
  constructor(
    public objAuth: AuthService,
    public objBack: BackService,
    public objLang: LangService,
    private objNotify: NotificationService
  ) { }

  ngOnInit() {
    this.initData();
  }
  async initData(){
    
  }
  tblClick(val){
    let redirectTo = 'individual/' + val;
    this.objAuth.goPage(redirectTo);
  }
}
