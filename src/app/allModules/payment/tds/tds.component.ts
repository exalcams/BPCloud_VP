import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatPaginator, MatMenuTrigger, MatSort } from '@angular/material';

@Component({
  selector: 'app-tds',
  templateUrl: './tds.component.html',
  styleUrls: ['./tds.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class TDSComponent implements OnInit {
  tableDisplayedColumns: string[] = [
    'CompanyCode',
    'Document',
    'PostingDate',
    'BaseAmount',
    'TDSCategory',
    'TDSAmount',
    'Currency',
    'FinancialYear'
  ];
  tableDataSource: MatTableDataSource<Test2>;
  @ViewChild(MatPaginator) tablePaginator: MatPaginator;
  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;
  @ViewChild(MatSort) tableSort: MatSort;

  constructor() { }

  ngOnInit(): void {
    this.GetTestData();
  }
  GetTestData(): void {
    const TestDatas: Test2[] = [
      {
        CompanyCode: '#545667', Document: 'Invoice.pdf', PostingDate: new Date(), BaseAmount: 675478,
        TDSCategory: 'Interest earned', TDSAmount: 6500, Currency: 'INR', FinancialYear: '2020-2021'
      },
      {
        CompanyCode: '#545667', Document: 'Invoice.pdf', PostingDate: new Date(), BaseAmount: 675478,
        TDSCategory: 'Interest earned', TDSAmount: 6500, Currency: 'INR', FinancialYear: '2020-2021'
      },
      {
        CompanyCode: '#545667', Document: 'Invoice.pdf', PostingDate: new Date(), BaseAmount: 675478,
        TDSCategory: 'Interest earned', TDSAmount: 6500, Currency: 'INR', FinancialYear: '2020-2021'
      },
      {
        CompanyCode: '#545667', Document: 'Invoice.pdf', PostingDate: new Date(), BaseAmount: 675478,
        TDSCategory: 'Interest earned', TDSAmount: 6500, Currency: 'INR', FinancialYear: '2020-2021'
      },
      {
        CompanyCode: '#545667', Document: 'Invoice.pdf', PostingDate: new Date(), BaseAmount: 675478,
        TDSCategory: 'Interest earned', TDSAmount: 6500, Currency: 'INR', FinancialYear: '2020-2021'
      },
      {
        CompanyCode: '#545667', Document: 'Invoice.pdf', PostingDate: new Date(), BaseAmount: 675478,
        TDSCategory: 'Interest earned', TDSAmount: 6500, Currency: 'INR', FinancialYear: '2020-2021'
      },
    ];
    this.tableDataSource = new MatTableDataSource(TestDatas);
    this.tableDataSource.paginator = this.tablePaginator;
    this.tableDataSource.sort = this.tableSort;
  }
}
export class Test2 {
  CompanyCode: string;
  Document: string;
  PostingDate: Date;
  BaseAmount: number;
  TDSCategory: string;
  TDSAmount: number;
  Currency: string;
  FinancialYear: string;
}
