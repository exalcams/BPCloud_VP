import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ReportService } from 'app/services/report.service';
import { BPCReportOV, OverviewReportOption } from 'app/models/ReportModel';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js';
import * as XLSX from 'xlsx';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { colorSets } from '@swimlane/ngx-charts/release/utils';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { AuthenticationDetails, AppUsage } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatPaginator, MatMenuTrigger, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'app/services/excel.service';
import { MasterService } from 'app/services/master.service';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class OverviewComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  menuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  isProgressBarVisibile: boolean;
  searchFormGroup: FormGroup;
  isDateError: boolean;
  searchText: string;
  selectValue: string;
  isExpanded: boolean;
  defaultFromDate: Date;
  defaultToDate: Date;
  overviewReportDisplayedColumns: string[] = ['Material', 'MaterialText', 'InputQty', 'AccQty', 'RejQty', 'RejPercentage'];
  overviewReportDataSource: MatTableDataSource<BPCReportOV>;
  overviewReports: BPCReportOV[] = [];
  @ViewChild(MatPaginator) overviewPaginator: MatPaginator;
  @ViewChild(MatSort) overviewSort: MatSort;
  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;

  // DoughnutChart
  public doughnutChartData: Array<number> = [33, 33];
  public doughnutChartDataSets: Array<any> = [
    {
      data: this.doughnutChartData,
    }
  ];
  public doughnutChartOptions: any = {
    maintainAspectRatio: false,
    responsive: false,
    legend: false,
    cutoutPercentage: 65,
    plugins: {
      deferred: false
    },

  };
  public doughnutChartColors: Array<any> = [{
    backgroundColor: ['#fb9e61', '#3c9cdf']
  }];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartLegend = false;

  // BarChart
  public barChartColors: Array<any> = [{
    backgroundColor: ['#3c9cdf', '#3c9cdf', '#3c9cdf', '#3c9cdf', '#3c9cdf']
  }];
  public barChartOptions: ChartOptions = {
    responsive: false,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawTicks: false,
          display: false
        },
      }], yAxes: [{

      }]
    },
  };
  public barChartLabels: any[] = ['2006', '2007', '2008', '2009', '2010'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartData: ChartDataSets[] = [
    {
      data: [11, 12, 80, 81, 56], label: 'Rejected Material',
      barPercentage: 0.5,
    }

  ];

  constructor(
    private _reportservice: ReportService,
    private formBuilder: FormBuilder,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _masterService: MasterService,
    private _datePipe: DatePipe,
    private _excelService: ExcelService) {
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.isProgressBarVisibile = false;
    this.isDateError = false;
    this.searchText = '';
    this.selectValue = 'All';
    this.isExpanded = false;
    this.defaultFromDate = new Date();
    this.defaultFromDate.setDate(this.defaultFromDate.getDate() - 30);
    this.defaultToDate = new Date();
  }

  ngOnInit(): void {
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserName = this.authenticationDetails.UserName;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.menuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.menuItems.indexOf('Overview') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.GetOverviewReports();
    this.initializeSearchForm();
    // this.searchButtonClicked();
  }

  CreateAppUsage(): void {
    const appUsage: AppUsage = new AppUsage();
    appUsage.UserID = this.currentUserID;
    appUsage.AppName = 'Payables';
    appUsage.UsageCount = 1;
    appUsage.CreatedBy = this.currentUserName;
    appUsage.ModifiedBy = this.currentUserName;
    this._masterService.CreateAppUsage(appUsage).subscribe(
      (data) => {
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetOverviewReports(): void {
    this.isProgressBarVisibile = true;
    this._reportservice.GetOverviewReports(this.currentUserName).subscribe(
      (data) => {
        this.overviewReports = data as BPCReportOV[];
        this.overviewReportDataSource = new MatTableDataSource(this.overviewReports);
        this.overviewReportDataSource.paginator = this.overviewPaginator;
        this.overviewReportDataSource.sort = this.overviewSort;
        this.isProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.isProgressBarVisibile = false;
      }
    );
  }

  GetOverviewReportByOption(overviewReportOption: OverviewReportOption): void {
    this.isProgressBarVisibile = true;
    this._reportservice.GetOverviewReportByOption(overviewReportOption).subscribe(
      (data) => {
        this.overviewReports = data as BPCReportOV[];
        this.overviewReportDataSource = new MatTableDataSource(this.overviewReports);
        this.overviewReportDataSource.paginator = this.overviewPaginator;
        this.overviewReportDataSource.sort = this.overviewSort;
        this.isProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.isProgressBarVisibile = false;
      }
    );
  }

  GetOverviewReportByStatus(overviewReportOption: OverviewReportOption): void {
    this.isProgressBarVisibile = true;
    this._reportservice.GetOverviewReportByStatus(overviewReportOption).subscribe(
      (data) => {
        this.overviewReports = data as BPCReportOV[];
        this.overviewReportDataSource = new MatTableDataSource(this.overviewReports);
        this.overviewReportDataSource.paginator = this.overviewPaginator;
        this.overviewReportDataSource.sort = this.overviewSort;
        this.isProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.isProgressBarVisibile = false;
      }
    );
  }

  GetOverviewReportByDate(overviewReportOption: OverviewReportOption): void {
    this.isProgressBarVisibile = true;
    this._reportservice.GetOverviewReportByDate(overviewReportOption).subscribe(
      (data) => {
        this.overviewReports = data as BPCReportOV[];
        this.overviewReportDataSource = new MatTableDataSource(this.overviewReports);
        this.overviewReportDataSource.paginator = this.overviewPaginator;
        this.overviewReportDataSource.sort = this.overviewSort;
        this.isProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.isProgressBarVisibile = false;
      }
    );
  }

  initializeSearchForm(): void {
    this.searchFormGroup = this.formBuilder.group({
      PONumber: [''],
      Material: ['']
      // FromDate: [this.defaultFromDate],
      // ToDate: [this.defaultToDate]
    });
  }

  resetControl(): void {
    this.overviewReports = [];
    this.resetFormGroup(this.searchFormGroup);
  }

  resetFormGroup(formGroup: FormGroup): void {
    formGroup.reset();
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).enable();
      formGroup.get(key).markAsUntouched();
    });
  }

  // dateSelected(): void {
  //   const FROMDATEVAL = this.searchFormGroup.get('FromDate').value as Date;
  //   const TODATEVAL = this.searchFormGroup.get('ToDate').value as Date;
  //   if (FROMDATEVAL && TODATEVAL && FROMDATEVAL > TODATEVAL) {
  //     this.isDateError = true;
  //   } else {
  //     this.isDateError = false;
  //   }
  // }

  searchButtonClicked(): void {
    if (this.searchFormGroup.valid) {
      // if (!this.isDateError) {
      // const FrDate = this.searchFormGroup.get('FromDate').value;
      // let FromDate = '';
      // if (FrDate) {
      //   FromDate = this._datePipe.transform(FrDate, 'yyyy-MM-dd');
      // }
      // const TDate = this.searchFormGroup.get('ToDate').value;
      // let ToDate = '';
      // if (TDate) {
      //   ToDate = this._datePipe.transform(TDate, 'yyyy-MM-dd');
      // }
      const poNumber = this.searchFormGroup.get('PONumber').value;
      const material = this.searchFormGroup.get('Material').value;
      const overviewReportOption = new OverviewReportOption();
      overviewReportOption.Material = material;
      overviewReportOption.PO = poNumber;
      // overviewReportOption.FromDate = FromDate;
      // overviewReportOption.ToDate = ToDate;
      overviewReportOption.PartnerID = this.currentUserName;
      this.GetOverviewReportByOption(overviewReportOption);
      // }
    } else {
      this.showValidationErrors(this.searchFormGroup);
    }
  }

  showValidationErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      if (!formGroup.get(key).valid) {
        console.log(key);
      }
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
      if (formGroup.get(key) instanceof FormArray) {
        const FormArrayControls = formGroup.get(key) as FormArray;
        Object.keys(FormArrayControls.controls).forEach(key1 => {
          if (FormArrayControls.get(key1) instanceof FormGroup) {
            const FormGroupControls = FormArrayControls.get(key1) as FormGroup;
            Object.keys(FormGroupControls.controls).forEach(key2 => {
              FormGroupControls.get(key2).markAsTouched();
              FormGroupControls.get(key2).markAsDirty();
              if (!FormGroupControls.get(key2).valid) {
                console.log(key2);
              }
            });
          } else {
            FormArrayControls.get(key1).markAsTouched();
            FormArrayControls.get(key1).markAsDirty();
          }
        });
      }
    });

  }

  exportAsXLSX(): void {
    const currentPageIndex = this.overviewReportDataSource.paginator.pageIndex;
    const PageSize = this.overviewReportDataSource.paginator.pageSize;
    const startIndex = currentPageIndex * PageSize;
    const endIndex = startIndex + PageSize;
    const itemsShowed = this.overviewReports.slice(startIndex, endIndex);
    const itemsShowedd = [];
    itemsShowed.forEach(x => {
      const item = {
        'Material': x.Material,
        // 'Material': x.InvoiceDate ? this._datePipe.transform(x.InvoiceDate, 'dd-MM-yyyy') : '',
        // 'Posted on': x.PostedOn ? this._datePipe.transform(x.PostedOn, 'dd-MM-yyyy') : '',
        'Material Text': x.MaterialText,
        'Input Quantity': x.InputQty,
        'Accepted Quantity': x.AccQty,
        'Rejected Quantity': x.RejQty,
        'Rejected Percentage': x.RejPercentage,
      };
      itemsShowedd.push(item);
    });
    this._excelService.exportAsExcelFile(itemsShowedd, 'overview');
  }

  expandClicked(): void {
    this.isExpanded = !this.isExpanded;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.overviewReportDataSource.filter = filterValue.trim().toLowerCase();
  }

}
