import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatPaginator, MatMenuTrigger, MatSort } from '@angular/material';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PaymentsComponent implements OnInit {

  tableDisplayedColumns: string[] = [
    'PaymentDate',
    'PaymentType',
    'PaidAmount',
    'BankName',
    'BankAccount',
    'CIDoc'
  ];
  tableDataSource: MatTableDataSource<Test3>;
  @ViewChild(MatPaginator) tablePaginator: MatPaginator;
  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;
  @ViewChild(MatSort) tableSort: MatSort;

  constructor() { }

  ngOnInit(): void {
    this.GetTestData();
  }
  GetTestData(): void {
    const TestDatas: Test3[] = [
      {
        PaymentDate: new Date(), PaymentType: 'Cheque',
        BankName: 'IOB Bank', PaidAmount: 6500, BankAccount: 'Savings Account', CIDoc: 'Invoice'
      },
      {
        PaymentDate: new Date(), PaymentType: 'Cheque',
        BankName: 'IOB Bank', PaidAmount: 6500, BankAccount: 'Savings Account', CIDoc: 'Invoice'
      },
      {
        PaymentDate: new Date(), PaymentType: 'Cheque',
        BankName: 'IOB Bank', PaidAmount: 6500, BankAccount: 'Savings Account', CIDoc: 'Invoice'
      },
      {
        PaymentDate: new Date(), PaymentType: 'Cheque',
        BankName: 'IOB Bank', PaidAmount: 6500, BankAccount: 'Savings Account', CIDoc: 'Invoice'
      },
      {
        PaymentDate: new Date(), PaymentType: 'Cheque',
        BankName: 'IOB Bank', PaidAmount: 6500, BankAccount: 'Savings Account', CIDoc: 'Invoice'
      },
      {
        PaymentDate: new Date(), PaymentType: 'Cheque',
        BankName: 'IOB Bank', PaidAmount: 6500, BankAccount: 'Savings Account', CIDoc: 'Invoice'
      },
    ];
    this.tableDataSource = new MatTableDataSource(TestDatas);
    this.tableDataSource.paginator = this.tablePaginator;
    this.tableDataSource.sort = this.tableSort;
  }
}
export class Test3 {
  PaymentDate: Date;
  PaymentType: string;
  BankName: string;
  PaidAmount: number;
  BankAccount: string;
  CIDoc: string;
}
