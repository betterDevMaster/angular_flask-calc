import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { EditProfileDialogComponent } from 'src/app/_partials/edit-profile-modal/edit-profile.modal.component';
import { User } from 'src/static-data/contents';
@Component({
  selector: 'vex-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userData: User;

  constructor(
    public objAuth: AuthService,
    private objBack: BackService,
  ) { }

  getAdmin() {
    this.objBack.fetchMember(this.objAuth.user.id)
    .subscribe((resp) => {
      if(resp.length) {
        let res = resp[0];
      this.userData.id = res.id;
      this.userData.email = res.email ;
        this.userData.first_name = res.first_name;
        this.userData.last_name = res.last_name;
        this.userData.user_language = res.user_language;
        this.userData.user_country = res.user_country;
      }
    })
  }

  

  ngOnInit() {
  }

}
