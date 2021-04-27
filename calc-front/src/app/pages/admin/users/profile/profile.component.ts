import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import {User} from 'src/static-data/contents';
import { BackService } from 'src/app/utils/services/back/back.service';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector     : 'profile',
    templateUrl  : './profile.component.html',
    styleUrls    : ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    
})
export class ProfileComponent
{
  profile$:Observable<any>;
  userData: User; 
  userId = Number(this.route.snapshot.paramMap.get('id'));
  icMoreVert = icMoreVert;
  products$:Observable<User>;    
  // promise1: Promise<string>|null = null;
  private resolve: Function|null = null;
  public isProcessing: boolean;
  public userRole = {};
  
  totoroDetails$: any;
  constructor(private route: ActivatedRoute,
    public objBack: BackService) {
      this.initProfile();
  }
  ngOnInit() {

  }
  async initProfile(){
    this.objBack.fetchMember(this.userId).subscribe((apiResponse) => {
      this.userData = apiResponse[0];
    });
  }
}
