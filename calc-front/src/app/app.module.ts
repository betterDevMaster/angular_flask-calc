import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';
import { CookieService } from 'ngx-cookie-service';
import { SharedModule } from './shared.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { EditProfileDialogComponent } from './_partials/edit-profile-modal/edit-profile.modal.component';
@NgModule({
  declarations: [AppComponent, ProfileComponent, EditProfileDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    ScrollToModule.forRoot(),
    // Vex
    VexModule,
    CustomLayoutModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  entryComponents: [EditProfileDialogComponent]
})
export class AppModule { }
