import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  Input,
} from "@angular/core";
import { Subject } from "rxjs";
import { AuthService } from "src/app/utils/services/auth/auth.service";
import { BackService } from "src/app/utils/services/back/back.service";
import { finalize } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { User, UserAddress } from "src/static-data/contents";
import { Link } from "src/@vex/interfaces/link.interface";
import icWork from "@iconify/icons-ic/twotone-work";
import icPhone from "@iconify/icons-ic/twotone-phone";
import { friendSuggestions } from "src/static-data/friend-suggestions";
import icPersonAdd from "@iconify/icons-ic/twotone-person-add";
import icCheck from "@iconify/icons-ic/twotone-check";
import icEdit from "@iconify/icons-ic/twotone-edit";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import icMail from "@iconify/icons-ic/twotone-mail";
import icAccessTime from "@iconify/icons-ic/twotone-access-time";
import icAdd from "@iconify/icons-ic/twotone-add";
import icWhatshot from "@iconify/icons-ic/twotone-whatshot";
import icLanguage from "@iconify/icons-ic/twotone-language";
import icFlag from "@iconify/icons-ic/twotone-flag";
import { MatDialog } from "@angular/material";
import { EditProfileDialogComponent } from "src/app/_partials/edit-profile-modal/edit-profile.modal.component";
import { NotificationService } from "src/app/utils/services/notification/notification.service";

@Component({
  selector: "profile-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInUp400ms, fadeInRight400ms, scaleIn400ms, stagger40ms],
})
export class ProfileAboutComponent implements OnInit, OnDestroy {
  @Input() user: User;
  suggestions = friendSuggestions;
  icWork = icWork;
  icPhone = icPhone;
  icPersonAdd = icPersonAdd;
  icCheck = icCheck;
  icMail = icMail;
  icEdit = icEdit;
  icAccessTime = icAccessTime;
  icAdd = icAdd;
  icWhatshot = icWhatshot;
  icLanguage = icLanguage;
  icFlag = icFlag;
  public isProcessing: boolean;
  public userRole = {};
  public userAddress: UserAddress;
  public userAddressInit: UserAddress;
  public countries: any[];
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   */
  constructor(
    private route: ActivatedRoute,
    private objBack: BackService,
    private dialog: MatDialog,
    private objAuth: AuthService,
    private objNotify: NotificationService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.userRole = this.objAuth.userRole;
    this.objAuth.isProcessing = false;
  }

  openEditDialog(): void{
    this.dialog
      .open(EditProfileDialogComponent, {
        disableClose: false,
        data: {user: this.user, countries: this.countries},
        width: '400px',
      })
      .afterClosed()
      .subscribe((userUpdated) => {
        if (userUpdated) {
          this.objNotify.success("Profile Update Successfully");
          if(userUpdated.id == this.objAuth.user.id){
            this.setAuthUser(userUpdated, this.objAuth.user);
            this.objAuth.setValueToCookie('calcUser', JSON.stringify(this.objAuth.user));
          }
          else{
            this.setAuthUser(userUpdated, this.user);            
          }
        }
      });
  }
  setAuthUser(userUpdated, userPrev): void{
    for(let key in userUpdated){
      userPrev[key] = userUpdated[key];
    }
  }
  getCountries(): void {
    console.log(this.objAuth.isProcessing);

    this.objAuth.isProcessing = true;
    try {
        this.objBack.fetchCountries()
        .pipe(
            finalize(() => {
              this.objAuth.isProcessing = false;
            }))
        .subscribe((apiResponse) => {
            if (apiResponse.length > 0) {
              this.countries = apiResponse;
            }
            this.objAuth.isProcessing = false;
        });
    }
    catch (err) {
        this.objAuth.isProcessing = false;
    }
  }
  ngOnInit(): void {
    setTimeout(() => {
      
      this.getCountries();
    }, 1000);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
