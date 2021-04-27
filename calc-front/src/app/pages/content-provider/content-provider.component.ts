import { Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { AuthService } from 'src/app/utils/services/auth/auth.service'; 
@Component({
  selector: 'app-content-provider',
  templateUrl: './content-provider.component.html',
  styleUrls: ['./content-provider.component.scss']
})
export class ContentProviderComponent implements OnInit {
  user: any;
  public isProcessing: boolean;
  constructor(
    public objAuth: AuthService
  ) {
  }
  ngOnInit() {
    
  }
}

