import { Injectable } from '@angular/core';
import { NavigationDropdown, NavigationItem, NavigationLink, NavigationSubheading } from '../interfaces/navigation-item.interface';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icSupervisorAccount from '@iconify/icons-ic/supervisor-account';
import icLanguage from '@iconify/icons-ic/language';
import icFlag from '@iconify/icons-ic/flag';
import icCalc from '@iconify/icons-fa-solid/calculator';
import icHome from '@iconify/icons-fa-solid/home';
import icBook from '@iconify/icons-fa-solid/book';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  xyz = '3';
  items: NavigationItem[] = [];
  itemsInit: NavigationItem[] = [
    {
      type: 'link',
      label: 'home',
      route: '/home',
      icon: icHome
    },
    {
      type: 'subheading',
      label: 'free_trial',
      children: [
        {
          type: 'link',
          label: 'basis_data',
          route: '/individual/basis',
          icon: icCalc
        },
        {
          type: 'link',
          label: 'individual_data',
          route: '/individual/individual',
          icon: icCalc
        }
      ]
    }
  ];
  itemsIndividual: NavigationItem[] = [
    {
      type: 'link',
      label: 'home',
      route: '/home',
      icon: icHome
    },
    {
      type: 'link',
      label: 'dashboard',
      route: '/dashboard/index',
      icon: icHome
    },
    {
      type: 'link',
      label: 'overview',
      route: '/individual/overview',
      icon: icLayers
    },
    {
      type: 'subheading',
      label: 'calculation',
      isMega: true,
      children: [
        {
          type: 'link',
          label: 'basis',
          route: '/individual/basis',
          icon: icCalc,
        },
        {
          type: 'link',
          label: 'individual',
          route: '/individual/individual',
          icon: icCalc
        },
        {
          type: 'link',
          label: 'household',
          route: '/individual/household',
          icon: icCalc
        },
        {
          type: 'link',
          label: 'documents',
          route: '/individual/documents',
          icon: icBook
        },
        {
          type: 'link',
          label: 'special',
          route: '/individual/special',
          icon: icCalc
        },
        
        {
          type: 'link',
          label: 'livingspace',
          route: '/individual/livingspace',
          icon: icCalc
        },
        {
          type: 'link',
          label: 'projectcost',
          route: '/individual/projectcost',
          icon: icCalc
        }
      ]
    }
  ];
  itemsContent: NavigationItem[] = [
    {
      type: 'link',
      label: 'home',
      route: '/home',
      icon: icHome
    },
    {
      type: 'link',
      label: 'contents',
      route: '/content-provider',
      icon: icLayers
    }
  ];
  itemsAdmin: NavigationItem[] = [
    {
      type: 'link',
      label: 'home',
      route: '/home',
      icon: icHome
    },
    {
      type: 'link',
      label: 'users',
      route: '/admin/users',
      icon: icSupervisorAccount
    },
    {
      type: 'link',
      label: 'languages',
      route: '/admin/languages',
      icon: icLanguage
    },
    {
      type: 'link',
      label: 'countries',
      route: '/admin/countries',
      icon: icFlag
    }
  ];
  private _openChangeSubject = new Subject<NavigationDropdown>();
  openChange$ = this._openChangeSubject.asObservable();

  constructor(
    private objAuth: AuthService
  ) {
    this.items = this.itemsInit;
  }

  triggerOpenChange(item: NavigationDropdown) {
    this._openChangeSubject.next(item);
  }

  isLink(item: NavigationItem): item is NavigationLink {
    return item.type === 'link';
  }

  isDropdown(item: NavigationItem): item is NavigationDropdown {
    return item.type === 'dropdown';
  }

  isSubheading(item: NavigationItem): item is NavigationSubheading {
    return item.type === 'subheading';
  }
  setNav(role: string){
    switch(role){
      case 'individual':
        this.items = this.itemsIndividual;
        break;
      case 'content':
        this.items = this.itemsContent;
        break;
      case 'admin':
        this.items = this.itemsAdmin;
        break;
      default:
        this.items = this.itemsInit;
        break;
    }
  }
}
