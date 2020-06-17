import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatMenuTrigger, MatSort } from '@angular/material';
import { PO } from 'app/models/Dashboard';
import { FormGroup, FormBuilder } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AccountStatementComponent implements OnInit {

  SearchFormGroup: FormGroup;
  isDateError: boolean;
  searchText: string;
  SelectValue: string;
  isExpanded: boolean;
  tableDisplayedColumns: string[] = [
    'Document',
    'DocumentDate',
    'PostingDate',
    'Reference',
    'DebitAmount',
    'CreditAmount',
    'LineItemText'
  ];
  tableDataSource: MatTableDataSource<Test>;
  @ViewChild(MatPaginator) tablePaginator: MatPaginator;
  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;
  @ViewChild(MatSort) tableSort: MatSort;
  constructor(private formBuilder: FormBuilder) {
    this.isDateError = false;
    this.searchText = '';
    this.SelectValue = 'All';
    this.isExpanded = false;
  }

  ngOnInit(): void {
    this.InitializeSearchForm();
    this.GetTestData();
  }

  InitializeSearchForm(): void {
    this.SearchFormGroup = this.formBuilder.group({
      InvoiceNumber: [''],
      FromDate: [''],
      ToDate: ['']
    });
  }
  GetTestData(): void {
    const TestDatas: Test[] = [
      { Document: 'Invoice.pdf', DocumentDate: new Date(), PostingDate: new Date(), Reference: '124', DebitAmount: 123.45, CreditAmount: 345, LineItemText: 'Leasing fee' },
      { Document: 'Invoice.pdf', DocumentDate: new Date(), PostingDate: new Date(), Reference: '124', DebitAmount: 123.45, CreditAmount: 345, LineItemText: 'Leasing fee' },
      { Document: 'Invoice.pdf', DocumentDate: new Date(), PostingDate: new Date(), Reference: '124', DebitAmount: 123.45, CreditAmount: 345, LineItemText: 'Leasing fee' },
      { Document: 'Invoice.pdf', DocumentDate: new Date(), PostingDate: new Date(), Reference: '124', DebitAmount: 123.45, CreditAmount: 345, LineItemText: 'Leasing fee' },
      { Document: 'Invoice.pdf', DocumentDate: new Date(), PostingDate: new Date(), Reference: '124', DebitAmount: 123.45, CreditAmount: 345, LineItemText: 'Leasing fee' },
      { Document: 'Invoice.pdf', DocumentDate: new Date(), PostingDate: new Date(), Reference: '124', DebitAmount: 123.45, CreditAmount: 345, LineItemText: 'Leasing fee' },
    ];
    this.tableDataSource = new MatTableDataSource(TestDatas);
    this.tableDataSource.paginator = this.tablePaginator;
    this.tableDataSource.sort = this.tableSort;
  }
  DateSelected(): void {
    const FROMDATEVAL = this.SearchFormGroup.get('FromDate').value as Date;
    const TODATEVAL = this.SearchFormGroup.get('ToDate').value as Date;
    if (FROMDATEVAL && TODATEVAL && FROMDATEVAL > TODATEVAL) {
      this.isDateError = true;
    } else {
      this.isDateError = false;
    }
  }
  SearchClicked(): void {

  }
  exportAsXLSX(): void {

  }
  expandClicked(): void {
    this.isExpanded = !this.isExpanded;
  }
}

export class Test {
  Document: string;
  DocumentDate: Date;
  PostingDate: Date;
  Reference: string;
  DebitAmount: number;
  CreditAmount: number;
  LineItemText: string;
}
