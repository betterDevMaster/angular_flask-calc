import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import icClose from "@iconify/icons-ic/twotone-close";
import { finalize } from "rxjs/operators";
import { AuthService } from "src/app/utils/services/auth/auth.service";
import { BackService } from "src/app/utils/services/back/back.service";
import { LangService } from "src/app/utils/services/language/language.service";
import { NotificationService } from "src/app/utils/services/notification/notification.service";
import { User } from "src/static-data/contents";


export class ProfileModel {
  id: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    user_role: string;
    user_country: string;
    user_language: string;
}

@Component({
  selector: "edit-profile-modal",
  templateUrl: "./edit-profile-modal.component.html",
})
export class EditProfileDialogComponent implements OnInit {
  icClose = icClose;

  submitLoading: boolean;

  languages: any[] = [];

  countries: any[];
  userData: User = {
    id: 1,
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    user_role: '',
    user_country: '',
    user_language: '',
    language: '',
    country: '',
    fx: '',
    street: '',
    nr: '',
    zipcode: '',
    city: '',
  };
  
  constructor(
    private objAuth: AuthService,
    private objBack: BackService,
    private objNotify: NotificationService,
    public objLang: LangService,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private dialogRef: MatDialogRef<EditProfileDialogComponent>
  ) {}
  
  ngOnInit() {
    this.getData();
  }
  getData(): void {
    for (let key in this.data['user']){
      this.userData[key] = this.data['user'][key];
    }
    this.countries = this.data['countries'];
  }

  close(data: boolean) {
    if(!data) {
    this.dialogRef.close(null);
    } else {

    }
  }

  onSubmit(): void {
    this.objAuth.isProcessing = true;
    this.objAuth.isProcessText = 'Updating profiel';
    this.submitLoading = true;
    this.objBack
    .updateMembers(this.userData)
    .subscribe((resp) => {
      this.objAuth.isProcessing = false;
      this.submitLoading = false;
      this.dialogRef.close(this.userData);
    },(err) => {
      this.objAuth.isProcessing = false;
      this.submitLoading = false;
      this.objNotify.error('Some Error Occurred!');
    })
  }

  
  
}
