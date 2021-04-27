import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
// import { ProfileAboutComponent } from './language/tabs/user/about.component';
import { ConfigPanelModule } from 'src/@vex/components/config-panel/config-panel.module';
import { SidebarModule } from 'src/@vex/components/sidebar/sidebar.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatMenuModule } from '@angular/material';
import { LanguagesComponent } from './languages.component';
import { AddLanguageDialog } from './languages.component'
import { LanguageComponent } from './language/language.component';
import { GeneralComponent } from './language/tabs/general/general.component';
import { ContentComponent } from './language/tabs/content/content.component';
import { IndividualComponent } from './language/tabs/individual/individual.component';

// import { NgxFlagPickerModule } from 'ngx-flag-picker';
const routes: Routes = [
  {
    path     : 'language/:id',
    component: LanguageComponent 
  },
  {
    path     : '**',
    component: LanguagesComponent
  }
];
@NgModule({
  entryComponents: [LanguagesComponent, AddLanguageDialog],
  declarations: [
    LanguagesComponent,
    AddLanguageDialog,
    LanguageComponent,
    GeneralComponent,
    ContentComponent,
    IndividualComponent,
    // ProfileAboutComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    ConfigPanelModule,
    SidebarModule,
    MatMenuModule,
    // NgxFlagPickerModule
    NgxMatSelectSearchModule
  ]
})
export class LanguagesModule { }
