import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import icMoreVert from '@iconify/icons-ic/more-vert';
export interface PeriodicElement {
  name: string;
  position: number;
  status: string;
  to: string;
}

@Component({
  selector: 'app-individual-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  constructor(
    public objAuth: AuthService,
    public objBack: BackService,
    public objLang: LangService,
    private objNotify: NotificationService
  ) { }

  ngOnInit() {
  }
  
}
