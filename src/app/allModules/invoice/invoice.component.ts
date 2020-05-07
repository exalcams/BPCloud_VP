import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InvoiceComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserRole: string;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  InvoiceDisplayedColumns: string[] = [
    'InvoiceNo',
    'InvoiceDate',
    'PoReference',
    'InvoiceAmount',
    'PaidAmount',
    'Date',
    'Status',
    'Document'
  ];
  AllInvoices: Invoice[];
  InvoiceDataSource: MatTableDataSource<Invoice>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  SearchFormGroup: FormGroup;
  constructor(private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    public snackBar: MatSnackBar
  ) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.authenticationDetails = new AuthenticationDetails();
    this.IsProgressBarVisibile = false;
  }

  ngOnInit(): void {
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.MenuItems.indexOf('Dashboard') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this._router.navigate(['/auth/login']);
      }

    } else {
      this._router.navigate(['/auth/login']);
    }
    this.InitializeSearchFormGroup();
    this.GetAllInvoices();
  }

  GetAllInvoices(): void {
    this.AllInvoices = [
      { InvoiceNo: 122, InvoiceDate: new Date(), PoReference: 234, InvoiceAmount: 100, PaidAmount: 50, Date: new Date(), Status: 'Approved', Document: 'Software_credentials.pdf' },
      { InvoiceNo: 123, InvoiceDate: new Date(), PoReference: 234, InvoiceAmount: 100, PaidAmount: 50, Date: new Date(), Status: 'Awaiting Approval', Document: 'Software_credentials.pdf' },
      { InvoiceNo: 124, InvoiceDate: new Date(), PoReference: 234, InvoiceAmount: 100, PaidAmount: 50, Date: new Date(), Status: 'Approved', Document: 'Software_credentials.pdf' },
      { InvoiceNo: 125, InvoiceDate: new Date(), PoReference: 234, InvoiceAmount: 100, PaidAmount: 50, Date: new Date(), Status: 'Approved', Document: 'Software_credentials.pdf' },
      { InvoiceNo: 126, InvoiceDate: new Date(), PoReference: 234, InvoiceAmount: 100, PaidAmount: 50, Date: new Date(), Status: 'Pending', Document: 'Software_credentials.pdf' },
    ];
    this.InvoiceDataSource = new MatTableDataSource(this.AllInvoices);
  }

  InitializeSearchFormGroup(): void {
    this.SearchFormGroup = this._formBuilder.group({
      FromDate: ['', Validators.required],
      ToDate: ['', Validators.required],
      PONumber: ['', Validators.required],
      InvoiceNumber: ['', Validators.required],
      Status: ['Open', Validators.required],
    });
  }
  getBackGroundColor(status: string): string {
    switch (status) {
      case 'Approved':
        return '#cdfcd6';
      case 'Awaiting Approval':
        return '#fdffc6';
      case 'Pending':
        return '#fdb9b1';
      default:
        return 'white';
    }
  }
}

export class Invoice {
  InvoiceNo: number;
  InvoiceDate: Date;
  PoReference: number;
  InvoiceAmount: number;
  PaidAmount: number;
  Date: Date;
  Status: string;
  Document: string;
}
