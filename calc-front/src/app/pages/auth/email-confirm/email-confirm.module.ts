import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailConfirmRoutingModule } from './email-confirm-routing.module';
import { EmailConfirmComponent } from './email-confirm.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '@visurel/iconify-angular';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [EmailConfirmComponent],
  imports: [
    CommonModule,
    EmailConfirmRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    IconModule,
    MatIconModule
  ]
})
export class EmailConfirmModule {
}
