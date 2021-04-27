import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { User, UserEmpty } from "src/static-data/contents";
import icCalc from '@iconify/icons-fa-solid/calculator';
import theme from 'src/@vex/utils/tailwindcss';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
@Component({
  selector: 'app-individual-basis',
  templateUrl: './basis.component.html',
  styleUrls: ['./basis.component.scss'],
  animations: [
    scaleIn400ms,
    fadeInRight400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ]
})

export class BasisComponent implements OnInit {
  user: User;
  theme = theme;
  icCalc = icCalc;
  constructor(
    public objAuth: AuthService,
    public objLang: LangService,
  ) {
  }
  
  ngOnInit() {
    this.user=this.objAuth.isLoggedIn?this.objAuth.user:UserEmpty;
  }
}
