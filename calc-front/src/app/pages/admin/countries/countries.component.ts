import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { finalize, filter } from 'rxjs/operators';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { CountryData } from './country';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import icEdit from '@iconify/icons-ic/edit';
import icDelete from '@iconify/icons-ic/delete';
import icMoreVert from '@iconify/icons-ic/more-vert';

import { NotificationService } from 'src/app/utils/services/notification/notification.service';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {
  icEdit = icEdit;
  icDelete = icDelete;
  icMoreVert = icMoreVert;
  // displayedColumns: string[] = ['id', 'country', 'currency', 'fx', 'land_register', 'right_of_lien', 'solvency', 'abstract_lr', 'valuation_fee', 'solvency_rate', 'reference_1', 'reference_2', 'stamp_duty', 'country_costs', 'actions'];
  displayedColumns: string[] = ['id', 'country', 'currency', 'fx', 'land_register', 'right_of_lien', 'solvency', 'abstract_lr', 'actions'];
  public dataSource: MatTableDataSource<CountryData>;
  public isProcessing: boolean;
  public countries = [];
  public userRole = [];
  public countryData : {};
  public countryDecimal : {};
  public tableOptionsCountries = {
    total: 0,
    pageIndex: 0,
    previousPageIndex: 0,
    pageSize: 100
  };
  
  public newId = 0;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public dialog: MatDialog,
    private objAuth: AuthService,
    private objBack: BackService,
    public snackBar: MatSnackBar,
    public objNotify: NotificationService) {
    
    // Create 100 users
    const countries = [];

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(countries);
  }
  resetCountryData(): void {
    this.countryData = {
      id: 0,
      name: '',
      currency: '',
      fx: '',
      land_register: '',
      right_of_lien: '',
      solvency: '',
      abstract_lr: '',
      valuation_fee: '',
      solvency_rate: '',
      reference_1: '',
      reference_2: '',
      stamp_duty: '',
      country_costs: ''
    }
  }
  openAddDialog(): void {
    this.resetCountryData();
    const dialogRef = this.dialog.open(DialogCountry, {
      width: '500px',
      data: ["New", this.newId],
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'update')
        this.getCountries();
    });
  }
  openEditDialog(id): void {
    const dialogRef = this.dialog.open(DialogCountry, {
      width: '500px',
      data: ["Update", this.dataSource.data[id]],
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'update')
        this.getCountries();
    });
  }
  // delete langauge
  deleteCountry(id): void {
    this.objBack.deleteCountry(id)
    .pipe(
      finalize(() => {
        this.objAuth.isProcessing = false;
      }))
    .subscribe((apiResponse) => {
      this.objNotify.success(apiResponse.status);
      this.getCountries();
    });
  }
  private resetTableCountries(): void {
    this.countries = [];
    this.dataSource = new MatTableDataSource(this.countries);
  }
  getCountries(): void {
    this.resetTableCountries();
    try {
      this.objAuth.isProcessing = true;

      this.objBack.fetchCountries()
        .pipe(
          finalize(() => {
            this.objAuth.isProcessing = false;
          }))
        .subscribe((apiResponse) => {
          if (apiResponse.length > 0) {
            this.dataSource = new MatTableDataSource(apiResponse);
            this.newId = apiResponse.length + 1;
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
  ngOnInit() {
    this.objAuth.checkRoleNaviate('admin');
    this.getCountries();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


@Component({
  selector: 'dialog-country',
  templateUrl: 'dialog-country.html',
})
export class DialogCountry {
  countryForm: FormGroup;
  public flagChanged: boolean;
  private dataChanged: any;
  public countryDecimal: any;
  public landDecimal: number;
  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
  */
  constructor(
    public dialogRef: MatDialogRef<DialogCountry>,
    private _formBuilder: FormBuilder,
    private objBack: BackService,
    private objNotify: NotificationService,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: CountryData
    ) {
      // init Form
      this.countryForm = this._formBuilder.group({
        id: [0,Validators.required],
        name: ['', Validators.required],
        currency   : ['', Validators.required],
        fx: ['', Validators.required],
        land_register: ['',Validators.required],
        right_of_lien: ['',Validators.required],
        solvency: ['',Validators.required],
        abstract_lr: ['',Validators.required],
        valuation_fee: ['',Validators.required],
        solvency_rate: ['',Validators.required],
        reference_1: ['',Validators.required],
        reference_2: ['',Validators.required],
        stamp_duty: ['',Validators.required],
        country_costs: ['',Validators.required],
      });
      this.countryDecimal = {
        land_register: 0,
        right_of_lien: 0,
        solvency: 0,
        abstract_lr: 0,
        valuation_fee: 0,
        solvency_rate: 0,
        reference_1: 0,
        reference_2: 0,
        stamp_duty: 0,
        country_costs: 0
      }
      this.landDecimal = 1;
      // get data from parent
      if(this.data[0]=="Update")
      {
        this.countryForm.setValue(this.data[1]);
        for (const key in this.countryDecimal) {
          this.onChangeEvent(this.data[1][key], key);
        }
      }

      else{
        this.countryForm.get('id').setValue(data[1]);
      }
      this.onChanges();
    }
    onChanges(): void {
      this.countryForm.valueChanges.subscribe(val => {
        this.dataChanged = this.getDifference(this.countryForm.value, this.data[1]);
        if(this.dataChanged.length > 0){
          this.flagChanged = false;
        }
        else{
          this.flagChanged = true;
        }
      });
    }
    getDifference(object, base) {
      var difference = Object.keys(object).filter(k => object[k] !== base[k]);
      return difference;
    }
    onNoClick(): void {
      // this.data[1] = this.countryForm.value;
      this.dialogRef.close('cancel');
    }
    saveCountry(): void {
      this.objBack.addCountry(this.countryForm.value)
        .pipe(
          finalize(() => {
            
          }))
        .subscribe((apiResponse) => {
          this.objNotify.success(apiResponse.status); 
          this.dialogRef.close('update');
        },
        error => {
          console.log(error.error.message);
        });
    }
    ngOnInit() {
      this.flagChanged = true;
    }
    countDecimals(value: any) {
      if((Math.floor(value) === value) || (value == '') || (value.toString().split(".").length < 2)) 
        return 1;
      var decimalLength = (value.toString().split(".")[1].length || 0);
      var decimalLengthNegative = decimalLength * -1;
      var decimalUnit = Math.pow(10, decimalLength);
      var decimalUnitNegative = Math.pow(10, decimalLengthNegative);
      return Math.round(decimalUnitNegative*decimalUnit)/decimalUnit;
    }
    onChangeEvent(event: any, key: string){
      var decimalNumber = this.countDecimals(event);
      let offset = Math.round(this.countryDecimal[key] / decimalNumber * 10)/10;
      if(offset != 0.1)
        this.countryDecimal[key] = decimalNumber;
    }

}
