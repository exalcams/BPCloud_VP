import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { ASNListView } from 'app/models/ASN';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { ASNService } from 'app/services/asn.service';
import { ExcelService } from 'app/services/excel.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-asn-list',
  templateUrl: './asn-list.component.html',
  styleUrls: ['./asn-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AsnListComponent implements OnInit {

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  BGClassName: any;
  fuseConfig: any;
  AllASNList: ASNListView[] = [];
  displayColumn: string[] = ['PatnerID','ASNNumber', 'ASNDate', 'DocNumber', 'AWBNumber', 'VessleNumber', 'Material',
    'MaterialText', 'ASNQty', 'Status', 'Action'];
  TableDetailsDataSource: MatTableDataSource<ASNListView>;
  @ViewChild(MatPaginator) tablePaginator: MatPaginator;
  @ViewChild(MatSort) tableSort: MatSort;
  truck_url = "assets/images/mover-truck.png ";
  ship_url = "assets/images/cargo-ship.png ";
  delivery_url = "assets/images/delivery.png ";
  isExpanded: boolean;
  SearchFormGroup: FormGroup;
  isDateError: boolean;
  DefaultFromDate: Date;
  DefaultToDate: Date;
  SelectValue: string;
  TableSelectValue: string;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private formBuilder: FormBuilder,
    private _asnService: ASNService,
    private _excelService: ExcelService,
    private _router: Router,
    private _datePipe: DatePipe,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
    this.isExpanded = false;
    this.DefaultFromDate = new Date();
    this.DefaultFromDate.setDate(this.DefaultFromDate.getDate() - 30);
    this.DefaultToDate = new Date();
    this.SelectValue = 'All';
    this.TableSelectValue='Action'
  }

  ngOnInit(): void {
    this.SetUserPreference();
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserName = this.authenticationDetails.UserName;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      // if (this.MenuItems.indexOf('AccountStatement') < 0) {
      //   this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
      //   );
      //   this._router.navigate(['/auth/login']);
      // }

    } else {
      this._router.navigate(['/auth/login']);
    }
    this.InitializeSearchForm();
    // this.GetAllASNListByPartnerID();
    this.SearchClicked();
  }
  InitializeSearchForm(): void {
    this.SearchFormGroup = this.formBuilder.group({
      VendorCode:[''],
      ASNNumber: [''],
      DocNumber: [''],
      Material: [''],
      Status: [''],
      ASNFromDate: [this.DefaultFromDate],
      ASNToDate: [this.DefaultToDate]
    });
    

  }
  ResetControl(): void {
    this.AllASNList = [];
    this.ResetFormGroup(this.SearchFormGroup);
  }
  ResetFormGroup(formGroup: FormGroup): void {
    formGroup.reset();
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).enable();
      formGroup.get(key).markAsUntouched();
    });
  }
  GetAllASNList(): void {
    this._asnService.GetAllASNList().subscribe(
      (data) => {
        this.AllASNList = data as ASNListView[];
        this.TableDetailsDataSource = new MatTableDataSource(this.AllASNList);
        this.TableDetailsDataSource.paginator = this.tablePaginator;
        this.TableDetailsDataSource.sort = this.tableSort;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
      }
    );

  }

  DateSelected(): void {
    const FROMDATEVAL = this.SearchFormGroup.get('ASNFromDate').value as Date;
    const TODATEVAL = this.SearchFormGroup.get('ASNToDate').value as Date;
    if (FROMDATEVAL && TODATEVAL && FROMDATEVAL > TODATEVAL) {
      this.isDateError = true;
    } else {
      this.isDateError = false;
    }
  }
  SearchClicked(): void {
    if (this.SearchFormGroup.valid) {
      if (!this.isDateError) {
        const FrDate = this.SearchFormGroup.get('ASNFromDate').value;
        let FromDate = '';
        if (FrDate) {
          FromDate = this._datePipe.transform(FrDate, 'yyyy-MM-dd');
        }
        const TDate = this.SearchFormGroup.get('ASNToDate').value;
        let ToDate = '';
        if (TDate) {
          ToDate = this._datePipe.transform(TDate, 'yyyy-MM-dd');
        }
        const VendorCode = this.SearchFormGroup.get('VendorCode').value;
        const ASNNumber = this.SearchFormGroup.get('ASNNumber').value;
        const DocNumber = this.SearchFormGroup.get('DocNumber').value;
        const Material = this.SearchFormGroup.get('Material').value;
        // const Status = this.SearchFormGroup.get('Status').value;
        this.IsProgressBarVisibile = true;
        this._asnService.FilterASNList(VendorCode, ASNNumber, DocNumber, Material, '', FromDate, ToDate).subscribe(
          (data) => {
            this.AllASNList = data as ASNListView[];
            this.TableDetailsDataSource = new MatTableDataSource(this.AllASNList);
            this.TableDetailsDataSource.paginator = this.tablePaginator;
            this.TableDetailsDataSource.sort = this.tableSort;
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

  SetUserPreference(): void {
    this._fuseConfigService.config
      .subscribe((config) => {
        this.fuseConfig = config;
        this.BGClassName = config;
      });
    // this._fuseConfigService.config = this.fuseConfig;
  }
  exportAsXLSX(): void {
    const currentPageIndex = this.TableDetailsDataSource.paginator.pageIndex;
    const PageSize = this.TableDetailsDataSource.paginator.pageSize;
    const startIndex = currentPageIndex * PageSize;
    const endIndex = startIndex + PageSize;
    const itemsShowed = this.AllASNList.slice(startIndex, endIndex);
    const itemsShowedd = [];
    itemsShowed.forEach(x => {
      const item = {
        'ASN': x.ASNNumber,
        'ASN Date': x.ASNDate ? this._datePipe.transform(x.ASNDate, 'dd-MM-yyyy') : '',
        'PO': x.DocNumber,
        'AWB': x.AWBNumber,
        'Truck': x.VessleNumber,
        'Material': x.Material,
        'Material Text': x.MaterialText,
        'ASN Qty': x.ASNQty,
        'Status': x.Status,
      };
      itemsShowedd.push(item);
    });
    this._excelService.exportAsExcelFile(itemsShowedd, 'accountstatement');
  }
  expandClicked(): void {
    this.isExpanded = !this.isExpanded;
  }
}