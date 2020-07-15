import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatMenuTrigger, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { PO } from 'app/models/Dashboard';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { BPCPayAccountStatement } from 'app/models/Payment.model';
import { AuthenticationDetails, AppUsage } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { Router } from '@angular/router';
import { PaymentService } from 'app/services/payment.service';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { BPCPayment } from 'app/models/ReportModel';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'app/services/excel.service';
import { MasterService } from 'app/services/master.service';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AccountStatementComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  AccountStatements: BPCPayAccountStatement[] = [];
  SearchFormGroup: FormGroup;
  isDateError: boolean;
  DefaultFromDate: Date;
  DefaultToDate: Date;
  searchText: string;
  SelectValue: string;
  isExpanded: boolean;
  tableDisplayedColumns: string[] = [
    'DocumentID',
    'DocumentDate',
    'PostingDate',
    'RefID',
    'DebitAmount',
    'CreditAmount',
    'ItemText'
  ];
  tableDataSource: MatTableDataSource<BPCPayAccountStatement>;
  @ViewChild(MatPaginator) tablePaginator: MatPaginator;
  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;
  @ViewChild(MatSort) tableSort: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private paymentService: PaymentService,
    private _masterService: MasterService,
    private _datePipe: DatePipe,
    private _excelService: ExcelService,
  ) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
    this.isDateError = false;
    this.searchText = '';
    this.SelectValue = 'All';
    this.isExpanded = false;
    this.DefaultFromDate = new Date();
    this.DefaultFromDate.setDate(this.DefaultFromDate.getDate() - 30);
    this.DefaultToDate = new Date();
  }

  ngOnInit(): void {
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserName = this.authenticationDetails.UserName;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.MenuItems.indexOf('AccountStatement') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this._router.navigate(['/auth/login']);
      }

    } else {
      this._router.navigate(['/auth/login']);
    }
    this.CreateAppUsage();
    this.InitializeSearchForm();
    // this.GetAccountStatementByPatnerID();
    this.SearchClicked();
  }

  CreateAppUsage(): void {
    const appUsage: AppUsage = new AppUsage();
    appUsage.UserID = this.currentUserID;
    appUsage.AppName = 'Account Statement';
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

  InitializeSearchForm(): void {
    this.SearchFormGroup = this.formBuilder.group({
      DocumentID: [''],
      FromDate: [this.DefaultFromDate],
      ToDate: [this.DefaultToDate]
    });
  }
  ResetControl(): void {
    this.AccountStatements = [];
    this.ResetFormGroup(this.SearchFormGroup);
  }
  ResetFormGroup(formGroup: FormGroup): void {
    formGroup.reset();
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).enable();
      formGroup.get(key).markAsUntouched();
    });
  }
  GetAccountStatementByPatnerID(): void {
    this.IsProgressBarVisibile = true;
    this.paymentService.GetAccountStatementByPartnerID(this.currentUserName).subscribe(
      (data) => {
        this.AccountStatements = data as BPCPayAccountStatement[];
        this.tableDataSource = new MatTableDataSource(this.AccountStatements);
        this.tableDataSource.paginator = this.tablePaginator;
        this.tableDataSource.sort = this.tableSort;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        console.error(err);
      }
    );
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
    if (this.SearchFormGroup.valid) {
      if (!this.isDateError) {
        const FrDate = this.SearchFormGroup.get('FromDate').value;
        let FromDate = '';
        if (FrDate) {
          FromDate = this._datePipe.transform(FrDate, 'yyyy-MM-dd');
        }
        const TDate = this.SearchFormGroup.get('ToDate').value;
        let ToDate = '';
        if (TDate) {
          ToDate = this._datePipe.transform(TDate, 'yyyy-MM-dd');
        }
        const DocumentID = this.SearchFormGroup.get('DocumentID').value;
        this.IsProgressBarVisibile = true;
        this.paymentService.FilterAccountStatementByPartnerID(this.currentUserName, DocumentID, FromDate, ToDate).subscribe(
          (data) => {
            this.AccountStatements = data as BPCPayAccountStatement[];
            this.tableDataSource = new MatTableDataSource(this.AccountStatements);
            this.tableDataSource.paginator = this.tablePaginator;
            this.tableDataSource.sort = this.tableSort;
            this.IsProgressBarVisibile = false;
          },
          (err) => {
            console.error(err);
            this.IsProgressBarVisibile = false;
          }
        );
      }
    } else {
      this.ShowValidationErrors(this.SearchFormGroup);
    }
  }
  ShowValidationErrors(formGroup: FormGroup): void {
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
    const currentPageIndex = this.tableDataSource.paginator.pageIndex;
    const PageSize = this.tableDataSource.paginator.pageSize;
    const startIndex = currentPageIndex * PageSize;
    const endIndex = startIndex + PageSize;
    const itemsShowed = this.AccountStatements.slice(startIndex, endIndex);
    const itemsShowedd = [];
    itemsShowed.forEach(x => {
      const item = {
        'Document': x.DocumentID,
        'Document Date': x.DocumentDate ? this._datePipe.transform(x.DocumentDate, 'dd-MM-yyyy') : '',
        'Posting Date': x.PostingDate ? this._datePipe.transform(x.PostingDate, 'dd-MM-yyyy') : '',
        'Reference': x.RefID,
        'Debit Amount': x.DebitAmount,
        'Credit Amount': x.CreditAmount,
        'Line Item text': x.ItemText,
      };
      itemsShowedd.push(item);
    });
    this._excelService.exportAsExcelFile(itemsShowedd, 'accountstatement');
  }
  expandClicked(): void {
    this.isExpanded = !this.isExpanded;
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
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
