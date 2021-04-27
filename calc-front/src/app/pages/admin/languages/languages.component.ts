import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import { FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { BackService } from 'src/app/utils/services/back/back.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { AuthService } from 'src/app/utils/services/auth/auth.service'
import {MatSnackBar,MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition,} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import icMoreVert from '@iconify/icons-ic/more-vert';
import icEdit from '@iconify/icons-ic/edit';
import icDelete from '@iconify/icons-ic/delete';
import { countries } from "country-flags-svg";
import {Country} from 'src/static-data/contents';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
export interface LangData {
  id: string;
  name: string;
  foreign: string;
  status: string;
}
/**
 * @title Data table with sorting, pagination, and filtering.
 */

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {
  icEdit = icEdit;
  icDelete = icDelete;
  icMoreVert = icMoreVert;
  displayedColumns: string[] = ['id', 'name', 'foreign', 'status', 'actions'];
  dataSource: MatTableDataSource<LangData>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  public languages = [];
  public isProcessing: boolean;
  public newId = 0;
  public successMsg = '';
  public titleForm = {id: 0, name: '', foreign: '', flag: {}, status: false};
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  

  constructor(
    private objBack: BackService,
    private objLang: LangService,
    private objAuth: AuthService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private objNotify: NotificationService
  ) {}
  
  private resetTableLanguages(): void {
    this.languages = [];
    this.dataSource = new MatTableDataSource(this.languages);
  }
  getLangs(): void {
    this.resetTableLanguages();

    try {
      this.objAuth.isProcessing = true;
      this.objBack.fetchLangs()
        .pipe(
          finalize(() => {
            this.objAuth.isProcessing = false;
          }))
        .subscribe((apiResponse) => {
          if (apiResponse.length > 0) {
            this.languages = apiResponse;
            this.dataSource = new MatTableDataSource(this.languages);
            this.newId = apiResponse[apiResponse.length - 1].id + 1;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
          else{
            this.newId = 1;
          }
        });
    }
    catch (err) {
      this.objAuth.isProcessing = false;
    }
  }
  // delete langauge
  deleteLang(id): void {
    if(id == this.dataSource.data[0].id)
      this.objNotify.warning("English is default language.");
    else{
      try {
        this.objAuth.isProcessing = true;
        this.objBack.deleteLangDetails(id)
        .pipe(
          finalize(() => {
            this.objAuth.isProcessing = false;
          }))
        .subscribe((apiResponse) => {
          this.objNotify.success(apiResponse.status);
          this.getLangs();
          this.objLang.getLangs();
        });
      }
      catch (err) {
        this.objAuth.isProcessing = false;
      }
    }
    
  }
  onActiveChange(event, id, name): void {
    this.objBack.activeLang(id, event.checked)
      .pipe(
        finalize(() => {
          this.objAuth.isProcessing = false;
        }))
      .subscribe((apiResponse) => {
        if(event.checked)
          this.successMsg = name + ' is activated.';
        else
          this.successMsg = name + ' is deactivated.';
        this.objNotify.success(this.successMsg);
      });
  }
  ngOnInit() {
    this.getLangs();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddLanguageDialog, {
      data: {langs: this.languages}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

@Component({
  selector: 'add-language',
  templateUrl: 'add-language.html',
  styleUrls: ['./languages.component.scss']
})
export class AddLanguageDialog {
  // public titleForm = {id: 0, name: '', foreign: '', status: true};
  public titleForm = {id: 0, name: '', foreign: '', flag: {}, status: true};
  public enableCreate = false;
  public langExist = false;
  public isProcessing = false;
  // variables for flag
  public countrySelected = countries[0];
  public countryCtrl: FormControl = new FormControl();
  /** control for the MatSelect filter keyword */
  public countryFilterCtrl: FormControl = new FormControl();
   /** list of banks filtered by search keyword */
   public filteredCountries: ReplaySubject<Country[]> = new ReplaySubject<Country[]>(1);
   protected _onDestroy = new Subject<void>();
   protected countries: Country[] = countries;

  constructor( 
    public dialogRef: MatDialogRef<AddLanguageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {langs: any},
    public objBack: BackService,
    public objAuth: AuthService,
    private objNotify: NotificationService
    
  ) {
    this.titleForm.id = data.langs[data.langs.length - 1].id + 1;
    this.titleForm.flag = countries[0];
    // set initial selection
    this.countryCtrl.setValue(this.countries[0]);
    // load the initial bank list
    this.filteredCountries.next(this.countries.slice());
     this.countryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCountries();
      }); 
  }
  protected filterCountries() {
    if (!this.countries) {
      return;
    }
    // get the search keyword
    let search = this.countryFilterCtrl.value;
    if (!search) {
      this.filteredCountries.next(this.countries.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCountries.next(
      this.countries.filter(country => country.name.toLowerCase().indexOf(search) > -1)
    );
  }
  createLang(){
    let i = 0, langExist = false;
    for(let lang of this.data.langs){
      if(lang.name == this.titleForm.name || lang.foreign == this.titleForm.foreign){
        langExist = true;
        break;
      }
    }
    if(langExist)
      this.objNotify.error('This language already exists!');
    this.saveLangTitle();
  }
  saveLangTitle(): void {
    try {
      this.objAuth.isProcessing = true;
      this.objBack.addLang(this.titleForm)
        .pipe()
        .subscribe((apiResponse) => {
          this.objNotify.success(apiResponse.status);
          // this.objAuth.goPage('admin/languages/language/'+apiResponse.new_id);
          // this.dialogRef.close('saved');
        },
        error => {
          console.log(error,error.message);
          this.objAuth.isProcessing = false;
      });
    }
    catch (err) {
      this.objAuth.isProcessing = false;
    }  
  }
  onChange(){
    this.enableCreate = (this.titleForm.name != '' && this.titleForm.foreign != '')?true:false;
  }
}

