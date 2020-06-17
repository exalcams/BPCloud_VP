import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatMenuTrigger, MatSort } from '@angular/material';
import { PO } from 'app/models/Dashboard';
import { FormGroup, FormBuilder } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { ChartType } from 'chart.js';


@Component({
  selector: 'app-payable',
  templateUrl: './payable.component.html',
  styleUrls: ['./payable.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PayableComponent implements OnInit {

  SearchFormGroup: FormGroup;
  isDateError: boolean;
  searchText: string;
  SelectValue: string;
  isExpanded: boolean;
  tableDisplayedColumns: string[] = [
    'Vendor',
    'Invoice',
    'InvoiceBooking',
    'InvoiceDate',
    'DueDate',
    'AdvAmount',
    'Amount',
    'Balance'
  ];
  tableDataSource: MatTableDataSource<Test1>;
  @ViewChild(MatPaginator) tablePaginator: MatPaginator;
  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;
  @ViewChild(MatSort) tableSort: MatSort;

  public doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'left',
      labels: {
        fontSize: 10,
        padding: 20,
        usePointStyle: true
      }
    },
    cutoutPercentage: 80,
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    plugins: {
      labels: {
        // tslint:disable-next-line:typedef
        render: function (args) {
          return args.value + '%';
        },
        fontColor: '#000',
        position: 'outside'
      }
    }
  };
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartLabels: any[] = ['0 - 30', '31 - 60', '61 - 90', '91 - above'];
  public doughnutChartData: any[] = [
      [40, 20, 30, 10]
  ];
  public colors: any[] = [{ backgroundColor: ['#716391', '#9ae9d9', '#fbe300', '#f66861'] }];


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
    const TestDatas: Test1[] = [
      { Vendor: 'ACC Cements', Invoice: '#1234', InvoiceBooking: 'Booking done', InvoiceDate: new Date(), DueDate: new Date(), AdvAmount: 6500, Amount: 96500, Balance: 78000 },
      { Vendor: 'ACC Cements', Invoice: '#1234', InvoiceBooking: 'Booking done', InvoiceDate: new Date(), DueDate: new Date(), AdvAmount: 6500, Amount: 96500, Balance: 78000 },
      { Vendor: 'ACC Cements', Invoice: '#1234', InvoiceBooking: 'Booking done', InvoiceDate: new Date(), DueDate: new Date(), AdvAmount: 6500, Amount: 96500, Balance: 78000 },
      { Vendor: 'ACC Cements', Invoice: '#1234', InvoiceBooking: 'Booking done', InvoiceDate: new Date(), DueDate: new Date(), AdvAmount: 6500, Amount: 96500, Balance: 78000 },
      { Vendor: 'ACC Cements', Invoice: '#1234', InvoiceBooking: 'Booking done', InvoiceDate: new Date(), DueDate: new Date(), AdvAmount: 6500, Amount: 96500, Balance: 78000 },
      { Vendor: 'ACC Cements', Invoice: '#1234', InvoiceBooking: 'Booking done', InvoiceDate: new Date(), DueDate: new Date(), AdvAmount: 6500, Amount: 96500, Balance: 78000 },
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

export class Test1 {
  Vendor: string;
  Invoice: string;
  InvoiceBooking: string;
  InvoiceDate: Date;
  DueDate: Date;
  AdvAmount: number;
  Amount: number;
  Balance: number;
}
