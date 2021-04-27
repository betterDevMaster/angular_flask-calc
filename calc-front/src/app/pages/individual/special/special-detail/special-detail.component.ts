import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import { User } from "src/static-data/contents";
import icLock from '@iconify/icons-ic/outline-lock';

@Component({
  selector: 'app-special-detail',
  templateUrl: './special-detail.component.html',
  styleUrls: ['./special-detail.component.scss']
})
export class SpecialDetailComponent implements OnInit {
  @Input() user: User;
  icLock = icLock;  
  constructor(
    public objAuth: AuthService,
    public objBack: BackService,
    public objLang: LangService,
    private objNotify: NotificationService
  ) { }
  public isProcessing: boolean;
  public specialInputs = {
    user_id: 0,
    natural_disasters: [
      {name: 'flood_vulnerability', title: 'Flood vulnerability', status: false, val: ''},
      {name: 'storm_hazard', title: 'Storm hazard', status: false, val: ''},
      {name: 'avalanche_mudstream', title: 'Avalanche/mudstream risk', status: false, val: ''},
      {name: 'forest_fire', title: 'Forest fire risk', status: false, val: ''}
    ],
    areas: [
      {name: 'building', title: 'Building ground',  val: ''},
      {name: 'green', title: 'Green area', val: ''},
      {name: 'wood', title: 'Wood', val: ''},
      {name: 'others', title: 'Others', val: ''}
    ],
    additions: [
      {name: 'alarm', title: 'Alarm system', status: false},
      {name: 'underfloor_heating', title: 'Underfloor heating', status: false},
      {name: 'home_ventilation', title: 'Home ventilation system', status: false},
      {name: 'heat_pump', title: 'Heat pump', status: false},
      {name: 'solar_photo', title: 'Solar power system/photo voltatic system', status: false},
      {name: 'swimming', title: 'Swimming pool/pond', status: false},
      {name: 'smart_home', title: 'Smart Home', status: false},
      {name: 'window_shadowing', title: 'Window shadowing', status: false, val: ''},
      {name: 'garge', title: 'Garage/Carport', status: false, val: ''},
      {name: 'terrace', title: 'Terrace/ balcony', status: false, val: ''}
    ],
  };
  ngOnInit() {
    this.initData();
  }
  async initData() {
    this.specialInputs.user_id = this.user['id'];
    try {
      this.objBack.fetchIndividualSpecial(this.specialInputs.user_id)
        .subscribe((apiResponse) => {
          if(apiResponse.length > 0){
            let tempObj = apiResponse[0];
            for(let key in tempObj)
              this.specialInputs[key] = JSON.parse(tempObj[key]); 
          }
        });
    }
    catch (err) {
      this.objAuth.isProcessing = false;
    }
  }
  
  async saveSpecial(){
    this.objAuth.isProcessing = true;
    this.objAuth.isProcessText = 'Saving';
    this.specialInputs.user_id = this.user['id'];
    try {
      this.objBack.saveSpecial(this.specialInputs, this.user)
        .pipe()
        .subscribe((apiResponse) => {
          this.objAuth.isProcessing = false;
          if(apiResponse.status == 'success'){
            this.objNotify.success('Saved successfully!');    
            this.objBack.individualStatus.special = true;   
            // update user info
            if(this.user.id == this.objAuth.user.id){
              for(let key in this.user){
                this.objAuth.user[key] = this.user[key];
                this.objAuth.setValueToCookie('calcUser', JSON.stringify(this.objAuth.user));
              }
            } 
          }
        },
        error => {
          console.log('invalid')
          this.objAuth.isProcessing = false;
        });
    }
    catch (err) {
      this.objAuth.isProcessing = false;
    }
  }
}
