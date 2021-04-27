import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import icEdit from '@iconify/icons-ic/edit';
import icOpen from '@iconify/icons-ic/open-in-new';
import icCalc from '@iconify/icons-fa-solid/calculator';
import theme from 'src/@vex/utils/tailwindcss';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
import { LangService } from 'src/app/utils/services/language/language.service';
const ELEMENT_DATA: any[] = [
    {id: 'AT 000 000 IAAA', name: 'Wohnhaus neubaugasse', start: "01-01-2021",  end: "01-01-2035", amount: '225 000,00',state:'Aktive'},
    {id: 'AT 000 000 IAAA', name: 'Loan name', start: "01-01-2020",  end: "01-01-2021", amount: '225 000,00',state:'Aktive'},
  ];

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [
      scaleIn400ms,
      fadeInRight400ms,
      stagger40ms,
      fadeInUp400ms,
      scaleFadeIn400ms
    ]
  })
export class DashBoardIndexComponent implements OnInit {
  theme = theme;
  icCalc = icCalc;
  icEdit = icEdit;
  icOpen = icOpen;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [ 'name','id', 'start', 'end', 'amount', 'state',  'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    public objLang: LangService
  ) {
    // Create 100 users
    const data = [];
    

  // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(data);
  }
  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
