import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { BackService } from 'src/app/utils/services/back/back.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { UserData } from './user';
import icRemoveRedEye from '@iconify/icons-ic/remove-red-eye';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})


export class UsersComponent implements OnInit {
  icRemoveRedEye = icRemoveRedEye;
  icMoreVert = icMoreVert;
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'email', 'role', 'country', 'language', 'profile'];
  public dataSource: MatTableDataSource<UserData>;


  public isProcessing: boolean;
  public members = [];
  public userRole: any;
  public tableOptionsMembers = {
    total: 0,
    pageIndex: 0,
    previousPageIndex: 0,
    pageSize: 100
  };
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private objBack: BackService, 
    private objAuth: AuthService) {}
  private resetTableMembers(): void {
    this.members = [];
    this.dataSource = new MatTableDataSource(this.members);
  }
  getMembers(): void {
    this.resetTableMembers();

    try {
      this.objAuth.isProcessing = true;

      this.objBack.fetchMembers()
        .pipe(
          finalize(() => {
            this.objAuth.isProcessing = false;
          }))
        .subscribe((apiResponse) => {
          if (apiResponse) {
            this.dataSource = new MatTableDataSource(apiResponse);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        });
    }
    catch (err) {
      this.objAuth.isProcessing = false;
    }
  }
  ngOnInit() {
    this.objAuth.checkRoleNaviate('admin');
    this.userRole = this.objAuth.userRole;
    this.getMembers();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
