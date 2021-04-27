import { Component, Input, OnInit } from "@angular/core";
import {
  NavigationItem,
  NavigationLink,
} from "../../interfaces/navigation-item.interface";
import { filter, map, startWith } from "rxjs/operators";
import { NavigationEnd, Router } from "@angular/router";
import { trackByRoute } from "../../utils/track-by";
import { NavigationService } from "../../services/navigation.service";
import { AuthService } from "src/app/utils/services/auth/auth.service";
import { LangService } from "src/app/utils/services/language/language.service";
import { BackService } from "src/app/utils/services/back/back.service";
@Component({
  selector: "vex-navigation-item",
  templateUrl: "./navigation-item.component.html",
  styleUrls: ["./navigation-item.component.scss"],
})
export class NavigationItemComponent implements OnInit {
  @Input() item: any;

  isActive$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() => (item: NavigationItem) => this.hasActiveChilds(item))
  );

  isLink = this.navigationService.isLink;
  isDropdown = this.navigationService.isDropdown;
  isSubheading = this.navigationService.isSubheading;
  trackByRoute = trackByRoute;

  // pageStatus: any[] = [
  //   { id: 1, name: "Basis data", status: false, to: "basis" },
  //   { id: 2, name: "Individual data", status: false, to: "individual" },
  //   { id: 3, name: "Special data", status: false, to: "special" },
  //   { id: 4, name: "Household bill", status: false, to: "household" },
  //   { id: 5, name: "Living space", status: false, to: "livingspace" },
  //   { id: 6, name: "Project cost", status: false, to: "projectcost" },
  // ];
  public imgCheck = "assets/img/checkbox/check2.png";
  public imgUncheck = "assets/img/checkbox/uncheck2.png";

  constructor(
    private navigationService: NavigationService,
    private router: Router,
    public objLang: LangService,
    public backservice: BackService,
    public objAuth: AuthService
  ) {}

  ngOnInit() {
    // if (this.item && this.objAuth.isLoggedIn) {
    //   if (this.item.hasOwnProperty("children") && this.objAuth.user.user_role == 'individual') {
    //     for (let i = 0; i < this.item.children.length; i++) {
    //       let data = this.backservice.pageStatus.filter(name => name.name == this.item.children[i].label);
    //       this.item.children = this.item.children.map(e => ({...e, can: this.backservice.individualStatus[data[0].name]}));
    //     }
    //   }
    // }
  }

  hasActiveChilds(parent: NavigationItem): boolean {
    if (this.isLink(parent)) {
      return this.router.isActive(parent.route as string, false);
    }

    if (this.isDropdown(parent) || this.isSubheading(parent)) {
      return parent.children.some((child) => {
        if (this.isDropdown(child)) {
          return this.hasActiveChilds(child);
        }

        if (this.isLink(child) && !this.isFunction(child.route)) {
          return this.router.isActive(child.route as string, false);
        }

        return false;
      });
    }

    return false;
  }

  features: any[] = [];

  isFunction(prop: NavigationLink["route"]) {
    return prop instanceof Function;
  }
}
