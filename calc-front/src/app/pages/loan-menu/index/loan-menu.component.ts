import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as echarts from 'echarts';
@Component({
  selector: 'app-loan-menu',
  templateUrl: './loan-menu.component.html',
  styleUrls: ['./loan-menu.component.scss']
})
export class LoanMenuComponent implements OnInit {
  ngOnInit(): void {
  }

  pages: any[] = [
    {
      name: 'Loan Data',
      url : '/individual/basis'
    },
    {
      name: 'Project Data',
      url : '/individual/special'
    },
    {
      name: 'Project Cost',
      url : '/individual/projectcost'
    },
    {
      name: 'Personal Data',
      url : '/individual/individual'
    },
    {
      name: 'House Hold Bill',
      url : '/individual/household'
    },
    {
      name: 'Results',
      url : ''
    },
    {
      name: 'Documents',
      url : '/individual/documents'
    },
    {
      name: 'Applications',
      url : ''
    }];
}
