import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MenuApp, AuthenticationDetails, UserView, VendorUser } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MasterService } from 'app/services/master.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { AttachmentDialogComponent } from 'app/allModules/pages/attachment-dialog/attachment-dialog.component';
import { AttachmentDetails } from 'app/models/task';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { BPCFLIPHeader, BPCFLIPHeaderView, BPCFLIPCost, BPCFLIPItem } from 'app/models/po-flip';
import { POFlipService } from 'app/services/po-flip.service';
import { BPCOFHeader, BPCOFItem } from 'app/models/OrderFulFilment';
import { POService } from 'app/services/po.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-po-flip',
  templateUrl: './po-flip.component.html',
  styleUrls: ['./po-flip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PoFlipComponent implements OnInit {
  MenuItems: string[];
  AllMenuApps: MenuApp[] = [];
  SelectedMenuApp: MenuApp;
  authenticationDetails: AuthenticationDetails;
  CurrentUserID: Guid;
  CurrentUserRole = '';
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  FLIPFormGroup: FormGroup;
  FLIPCostFormGroup: FormGroup;
  FLIPItemFormGroup: FormGroup;
  AllFLIPs: BPCFLIPHeader[] = [];
  SelectedBPCFLIPHeader: BPCFLIPHeader;
  SelectedBPCFLIPHeaderView: BPCFLIPHeaderView;
  FLIPCostByFLIPID: BPCFLIPCost[] = [];
  FLIPCostDisplayedColumns: string[] = [
    'ExpenceType',
    'Amount',
    'Remark',
    'Action'
  ];
  FLIPCostDataSource = new MatTableDataSource<BPCFLIPCost>();
  FLIPItems: BPCFLIPItem[] = [];
  FLIPItemDisplayedColumns: string[] = [
    'Item',
    'MaterialText',
    'DeliveryDate',
    'OrderedQty',
    'HSN',
    'OpenQty',
    'InvoiceQty',
    'Price',
    'Tax',
    'Amount',
  ];
  FLIPItemFormArray: FormArray = this._formBuilder.array([]);
  FLIPItemDataSource = new BehaviorSubject<AbstractControl[]>([]);
  @ViewChild(MatPaginator) flipItemPaginator: MatPaginator;
  @ViewChild(MatSort) flipItemSort: MatSort;
  POHeader: BPCOFHeader;
  POItems: BPCOFItem[] = [];
  SelectedDocNumber: string;
  SelectFLIPID: string;
  searchText = '';
  selection = new SelectionModel<any>(true, []);
  @ViewChild('iDNumber') iDNumber: ElementRef;
  @ViewChild('validUntil') validUntil: ElementRef;
  @ViewChild('accHolderName') accHolderName: ElementRef;
  @ViewChild('accountNo') accountNo: ElementRef;
  @ViewChild('ifsc') ifsc: ElementRef;
  @ViewChild('bankName') bankName: ElementRef;
  @ViewChild('branch') branch: ElementRef;
  @ViewChild('bankCity') bankCity: ElementRef;
  @ViewChild('department') department: ElementRef;
  @ViewChild('title') title: ElementRef;
  @ViewChild('mobile') mobile: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('activityDate') activityDate: ElementRef;
  @ViewChild('activityTime') activityTime: ElementRef;
  @ViewChild('activityText') activityText: ElementRef;
  @ViewChild('aAmount') aAmount: ElementRef;
  fileToUpload: File;
  fileToUploadList: File[] = [];
  AllRoles: string[] = [];
  AllTypes: string[] = [];
  AllCountries: string[] = [];
  AllInvoiceTypes: string[] = [];
  math = Math;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _masterService: MasterService,
    private _pOFlipService: POFlipService,
    private _POService: POService,
    private _router: Router,
    private _route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder
  ) {
    this.SelectedBPCFLIPHeader = new BPCFLIPHeader();
    this.SelectedBPCFLIPHeaderView = new BPCFLIPHeaderView();
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
    this.AllRoles = ['IND'];
    this.AllTypes = ['Service'];
    this.AllCountries = ['India'];
    this.AllInvoiceTypes = [
      'ANDAMAN AND NICOBAR ISLANDS',
      'ANDHRA PRADESH',
      'ARUNACHAL PRADESH',
      'ASSAM',
      'BIHAR',
      'CHANDIGARH',
      'CHHATTISGARH',
      'DADRA AND NAGAR HAVELI',
      'DAMAN AND DIU',
      'DELHI',
      'GOA',
      'GUJARAT',
      'HARYANA',
      'HIMACHAL PRADESH',
      'JAMMU AND KASHMIR',
      'JHARKHAND',
      'KARNATAKA',
      'KERALA',
      'LAKSHADWEEP',
      'MADHYA PRADESH',
      'MAHARASHTRA',
      'MANIPUR',
      'MEGHALAYA',
      'MIZORAM',
      'NAGALAND',
      'ORISSA',
      'PONDICHERRY',
      'PUNJAB',
      'RAJASTHAN',
      'SIKKIM',
      'TAMIL NADU',
      'TELANGANA',
      'TRIPURA',
      'UTTARANCHAL',
      'UTTAR PRADESH',
      'WEST BENGAL'
    ];
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.SelectedDocNumber = params['id'];
    });
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserID = this.authenticationDetails.UserID;
      this.CurrentUserRole = this.authenticationDetails.UserRole;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.MenuItems.indexOf('Flip') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this._router.navigate(['/auth/login']);
      }
      this.GetFLIPBasedOnCondition();
      this.InitializeFLIPFormGroup();
      this.InitializeFLIPCostFormGroup();
      this.InitializeFLIPItemFormGroup();
    } else {
      this._router.navigate(['/auth/login']);
    }
  }

  GetFLIPBasedOnCondition(): void {
    if (this.SelectedDocNumber) {
      this.GetPOByDoc();
      this.GetPOItemsByDoc();
      this.GetFLIPsByDoc();
      this.GetFLIPCostsByFLIPID();
    } else {
      this.GetAllFLIPs();
    }
  }

  // Get PO Header details by PO/DocNumber
  GetPOByDoc(): void {
    this._POService.GetPOByDoc(this.SelectedDocNumber).subscribe(
      (data) => {
        this.POHeader = data as BPCOFHeader;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // Get PO Item details by PO/DocNumber
  GetPOItemsByDoc(): void {
    this._POService.GetPOItemsByDoc(this.SelectedDocNumber).subscribe(
      (data) => {
        this.POItems = data as BPCOFItem[];
        this.ClearFormArray(this.FLIPItemFormArray);
        if (this.POItems && this.POItems.length) {
          this.SelectedBPCFLIPHeader.Client = this.SelectedBPCFLIPHeaderView.Client = this.POItems[0].Client;
          this.SelectedBPCFLIPHeader.Company = this.SelectedBPCFLIPHeaderView.Company = this.POItems[0].Company;
          this.SelectedBPCFLIPHeader.Type = this.SelectedBPCFLIPHeaderView.Type = this.POItems[0].Type;
          this.SelectedBPCFLIPHeader.PatnerID = this.SelectedBPCFLIPHeaderView.PatnerID = this.POItems[0].PatnerID;
          this.SelectedBPCFLIPHeader.DocNumber = this.SelectedBPCFLIPHeaderView.DocNumber = this.POItems[0].DocNumber;
          this.POItems.forEach(x => {
            this.InsertPOItemsFormGroup(x);
          });
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetAllFLIPs(): void {
    this._pOFlipService.GetAllPOFLIPs().subscribe(
      (data) => {
        this.AllFLIPs = data as BPCFLIPHeader[];
        if (this.AllFLIPs && this.AllFLIPs.length) {
          this.LoadSelectedFLIP(this.AllFLIPs[0]);
          // this.SelectedDocNumber = this.AllFLIPs[0].DocNumber;
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetFLIPsByDoc(): void {
    this._pOFlipService.GetPOFLIPsByDoc(this.SelectedDocNumber).subscribe(
      (data) => {
        this.AllFLIPs = data as BPCFLIPHeader[];
        if (this.AllFLIPs && this.AllFLIPs.length) {
          this.LoadSelectedFLIP(this.AllFLIPs[0]);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetFLIPCostsByFLIPID(): void {
    this.IsProgressBarVisibile = true;
    this._pOFlipService.GetFLIPCostsByFLIPID(this.SelectedBPCFLIPHeader.FLIPID).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.FLIPCostByFLIPID = data as BPCFLIPCost[];
        this.FLIPCostDataSource = new MatTableDataSource(this.FLIPCostByFLIPID);
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetFLIPItemsByFLIPID(): void {
    this._pOFlipService.GetFLIPItemsByFLIPID(this.SelectedBPCFLIPHeader.FLIPID).subscribe(
      (data) => {
        this.SelectedBPCFLIPHeaderView.FLIPItems = data as BPCFLIPItem[];
        if (this.SelectedBPCFLIPHeaderView.FLIPItems && this.SelectedBPCFLIPHeaderView.FLIPItems.length) {
          this.ClearFormArray(this.FLIPItemFormArray);
          this.SelectedBPCFLIPHeaderView.FLIPItems.forEach(x => {
            this.InsertFLIPItemsFormGroup(x);
          });
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  InitializeFLIPFormGroup(): void {
    this.FLIPFormGroup = this._formBuilder.group({
      InvoiceNumber: ['', Validators.required],
      InvoiceDate: ['', Validators.required],
      InvoiceAmount: ['', Validators.required],
      InvoiceCurrency: ['', Validators.required],
      InvoiceType: ['', Validators.required],
      IsInvoiceOrCertified: ['', Validators.required],
    });
  }

  InitializeFLIPCostFormGroup(): void {
    this.FLIPCostFormGroup = this._formBuilder.group({
      ExpenceType: ['', Validators.required],
      Amount: ['', Validators.required],
      Remarks: ['', Validators.required],
    });
  }

  InitializeFLIPItemFormGroup(): void {
    this.FLIPItemFormGroup = this._formBuilder.group({
      FLIPItems: this.FLIPItemFormArray
    });
  }

  InsertPOItemsFormGroup(poItem: BPCOFItem): void {
    const row = this._formBuilder.group({
      Item: [poItem.Item],
      Material: [poItem.Material],
      MaterialText: [poItem.MaterialText],
      DeliveryDate: [poItem.DeliveryDate],
      OrderedQty: [poItem.OrderedQty],
      HSN: [poItem.HSN],
      OpenQty: [poItem.OpenQty],
      InvoiceQty: ['', Validators.required],
      Price: ['', Validators.required],
      Tax: [poItem.Tax],
      Amount: ['', Validators.required],
    });
    row.disable();
    row.get('InvoiceQty').enable();
    row.get('Price').enable();
    row.get('Amount').enable();
    this.FLIPItemFormArray.push(row);
    this.FLIPItemDataSource.next(this.FLIPItemFormArray.controls);
    // return row;
  }

  InsertFLIPItemsFormGroup(flipItem: BPCFLIPItem): void {
    const row = this._formBuilder.group({
      Item: [flipItem.Item],
      Material: [flipItem.Material],
      MaterialText: [flipItem.MaterialText],
      DeliveryDate: [flipItem.DeliveryDate],
      OrderedQty: [flipItem.OrderedQty],
      HSN: [flipItem.HSN],
      OpenQty: [flipItem.OpenQty],
      Price: [flipItem.Price, Validators.required],
      InvoiceQty: [flipItem.InvoiceQty, Validators.required],
      Tax: [flipItem.Tax],
      Amount: [flipItem.Amount, Validators.required],
    });
    row.disable();
    row.get('Price').enable();
    row.get('InvoiceQty').enable();
    row.get('Amount').enable();
    this.FLIPItemFormArray.push(row);
    this.FLIPItemDataSource.next(this.FLIPItemFormArray.controls);
    // return row;
  }

  ResetControl(): void {
    this.SelectedBPCFLIPHeader = new BPCFLIPHeader();
    this.SelectedBPCFLIPHeaderView = new BPCFLIPHeaderView();
    this.SelectFLIPID = null;
    this.FLIPFormGroup.reset();
    Object.keys(this.FLIPFormGroup.controls).forEach(key => {
      this.FLIPFormGroup.get(key).enable();
      this.FLIPFormGroup.get(key).markAsUntouched();
    });
    this.fileToUpload = null;
    this.fileToUploadList = [];
    this.ClearFLIPCostFormGroup();
    this.ClearFLIPCostDataSource();
  }

  ClearFLIPCostFormGroup(): void {
    this.FLIPCostFormGroup.reset();
    Object.keys(this.FLIPCostFormGroup.controls).forEach(key => {
      this.FLIPCostFormGroup.get(key).markAsUntouched();
    });
  }

  ClearFLIPCostDataSource(): void {
    this.FLIPCostByFLIPID = [];
    this.FLIPCostDataSource = new MatTableDataSource(this.FLIPCostByFLIPID);
  }

  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  LoadSelectedFLIP(selectedFLIP: BPCFLIPHeader): void {
    this.ResetControl();
    this.SelectedBPCFLIPHeader = selectedFLIP;
    this.SelectFLIPID = selectedFLIP.FLIPID;
    this.GetFLIPItemsByFLIPID();
    this.GetFLIPCostsByFLIPID();
    // this.EnableAllFLIPTypes();
    this.SetFLIPValues();
  }

  SetFLIPValues(): void {
    this.FLIPFormGroup.get('InvoiceNumber').patchValue(this.SelectedBPCFLIPHeader.InvoiceNumber);
    this.FLIPFormGroup.get('InvoiceDate').patchValue(this.SelectedBPCFLIPHeader.InvoiceDate);
    this.FLIPFormGroup.get('InvoiceCurrency').patchValue(this.SelectedBPCFLIPHeader.InvoiceDate);
    this.FLIPFormGroup.get('InvoiceType').patchValue(this.SelectedBPCFLIPHeader.InvoiceType);
    this.FLIPFormGroup.get('IsInvoiceOrCertified').patchValue(this.SelectedBPCFLIPHeader.IsInvoiceOrCertified);
    this.FLIPFormGroup.get('InvoiceAmount').patchValue(this.SelectedBPCFLIPHeader.InvoiceAmount);
  }

  GetFLIPValues(): void {
    this.SelectedBPCFLIPHeader.InvoiceNumber = this.SelectedBPCFLIPHeaderView.InvoiceNumber = this.FLIPFormGroup.get('InvoiceNumber').value;
    this.SelectedBPCFLIPHeader.InvoiceDate = this.SelectedBPCFLIPHeaderView.InvoiceDate = this.FLIPFormGroup.get('InvoiceDate').value;
    this.SelectedBPCFLIPHeader.InvoiceCurrency = this.SelectedBPCFLIPHeaderView.InvoiceCurrency = this.FLIPFormGroup.get('InvoiceCurrency').value;
    this.SelectedBPCFLIPHeader.InvoiceAmount = this.SelectedBPCFLIPHeaderView.InvoiceAmount = this.FLIPFormGroup.get('InvoiceAmount').value;
    this.SelectedBPCFLIPHeader.InvoiceType = this.SelectedBPCFLIPHeaderView.InvoiceType = this.FLIPFormGroup.get('InvoiceType').value;
    this.SelectedBPCFLIPHeader.IsInvoiceOrCertified = this.SelectedBPCFLIPHeaderView.IsInvoiceOrCertified = this.FLIPFormGroup.get('IsInvoiceOrCertified').value;
    this.SelectedBPCFLIPHeader.InvoiceAmount = this.SelectedBPCFLIPHeaderView.InvoiceAmount = this.FLIPFormGroup.get('InvoiceAmount').value;
    if (this.fileToUpload) {
      this.SelectedBPCFLIPHeader.InvoiceAttachmentName = this.SelectedBPCFLIPHeaderView.InvoiceAttachmentName = this.fileToUpload.name;
      this.fileToUploadList.push(this.fileToUpload);
      this.fileToUpload = null;
    }
  }

  GetFLIPItemValues(): void {
    this.SelectedBPCFLIPHeaderView.FLIPItems = [];
    const fLIPItemFormArray = this.FLIPItemFormGroup.get('FLIPItems') as FormArray;
    fLIPItemFormArray.controls.forEach((x, i) => {
      const item: BPCFLIPItem = new BPCFLIPItem();
      item.Item = x.get('Item').value;
      item.Material = x.get('Material').value;
      item.MaterialText = x.get('MaterialText').value;
      item.DeliveryDate = x.get('DeliveryDate').value;
      item.OrderedQty = x.get('OrderedQty').value;
      item.UOM = x.get('UOM').value;
      item.HSN = x.get('HSN').value;
      item.OpenQty = x.get('OpenQty').value;
      item.InvoiceQty = x.get('InvoiceQty').value;
      item.Price = x.get('Price').value;
      item.Tax = x.get('Tax').value;
      item.Amount = x.get('Amount').value;
      this.SelectedBPCFLIPHeaderView.FLIPItems.push(item);
    });
  }

  GetFLIPCostValues(): void {
    this.SelectedBPCFLIPHeaderView.FLIPCosts = [];
    // this.SelectedBPCFLIPHeaderView.BPCFLIPCosts.push(...this.FLIPCostByFLIPID);
    this.FLIPCostByFLIPID.forEach(x => {
      this.SelectedBPCFLIPHeaderView.FLIPCosts.push(x);
    });
  }

  GetFLIPFromPOHeader(): void {
    this.SelectedBPCFLIPHeader.Client = this.SelectedBPCFLIPHeaderView.Client = this.POHeader.Client;
    this.SelectedBPCFLIPHeader.Company = this.SelectedBPCFLIPHeaderView.Company = this.POHeader.Company;
    this.SelectedBPCFLIPHeader.Type = this.SelectedBPCFLIPHeaderView.Type = this.POHeader.Type;
    this.SelectedBPCFLIPHeader.PatnerID = this.SelectedBPCFLIPHeaderView.PatnerID = this.POHeader.PatnerID;
    this.SelectedBPCFLIPHeader.DocNumber = this.SelectedBPCFLIPHeaderView.DocNumber = this.POHeader.DocNumber;
  }

  AddFLIPCostToTable(): void {
    if (this.FLIPCostFormGroup.valid) {
      const bPCFlipCost = new BPCFLIPCost();
      bPCFlipCost.Amount = this.FLIPCostFormGroup.get('Amount').value;
      bPCFlipCost.Remarks = this.FLIPCostFormGroup.get('Remarks').value;
      bPCFlipCost.ExpenceType = this.FLIPCostFormGroup.get('ExpenceType').value;
      if (!this.FLIPCostByFLIPID || !this.FLIPCostByFLIPID.length) {
        this.FLIPCostByFLIPID = [];
      }
      this.FLIPCostByFLIPID.push(bPCFlipCost);
      this.FLIPCostDataSource = new MatTableDataSource(this.FLIPCostByFLIPID);
      this.ClearFLIPCostFormGroup();
    } else {
      this.ShowValidationErrors(this.FLIPCostFormGroup);
    }
  }

  RemoveFLIPCostFromTable(bPCFlipCost: BPCFLIPCost): void {
    const index: number = this.FLIPCostByFLIPID.indexOf(bPCFlipCost);
    if (index > -1) {
      this.FLIPCostByFLIPID.splice(index, 1);
    }
    this.FLIPCostDataSource = new MatTableDataSource(this.FLIPCostByFLIPID);
  }

  AddFLIPItemAfterCalculationToTable(): void {
    // this.SelectedBPCFLIPHeaderView.FLIPItems = [];
    const fLIPItemFormArray = this.FLIPItemFormGroup.get('FLIPItems') as FormArray;
    fLIPItemFormArray.controls.forEach((x, i) => {
      // const item: BPCFLIPItem = new BPCFLIPItem();
      // item.Item = x.get('Item').value;
      // item.Material = x.get('Material').value;
      // item.MaterialText = x.get('MaterialText').value;
      // item.DeliveryDate = x.get('DeliveryDate').value;
      // item.OrderedQty = x.get('OrderedQty').value;
      // item.UOM = x.get('UOM').value;
      // item.HSN = x.get('HSN').value;
      // item.OpenQty = x.get('OpenQty').value;
      // item.InvoiceQty = x.get('InvoiceQty').value;
      // item.Price = x.get('Price').value;
      // item.Tax = x.get('Tax').value;
      // item.Amount = x.get('Amount').value;
      const openQty = x.get('OpenQty').value;
      const tax = x.get('Tax').value;
      const price = x.get('Price').value;
      const amount = this.convertStringToNumber(openQty) * this.convertStringToNumber(tax)
        * this.convertStringToNumber(price);
      if (openQty && tax && price) {
        x.get('InvoiceQty').patchValue(this.convertStringToNumber(openQty));
        x.get('Amount').patchValue(amount);
      }
      // this.SelectedBPCFLIPHeaderView.FLIPItems.push(item);
    });
  }

  SaveClicked(): void {
    if (this.FLIPFormGroup.valid) {
      this.GetFLIPValues();
      this.GetFLIPCostValues();
      this.GetFLIPItemValues();
      this.SetActionToOpenConfirmation();
    } else {
      this.ShowValidationErrors(this.FLIPFormGroup);
    }
  }

  DeleteClicked(): void {
    // if (this.FLIPFormGroup.valid) {
    if (this.SelectedBPCFLIPHeader.FLIPID) {
      const Actiontype = 'Delete';
      const Catagory = 'PO Flip';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    }
    // } else {
    //   this.ShowValidationErrors(this.FLIPFormGroup);
    // }
  }

  SetActionToOpenConfirmation(): void {
    if (this.SelectedBPCFLIPHeader.FLIPID) {
      const Actiontype = 'Update';
      const Catagory = 'PO Flip';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    } else {
      const Actiontype = 'Save';
      const Catagory = 'PO Flip';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    }
  }

  OpenConfirmationDialog(Actiontype: string, Catagory: string): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: Actiontype,
        Catagory: Catagory
      },
      panelClass: 'confirmation-dialog'
    };
    const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          if (Actiontype === 'Save') {
            this.CreatePOFLIP();
          } else if (Actiontype === 'Update') {
            this.UpdatePOFLIP();
          } else if (Actiontype === 'Delete') {
            this.DeletePOFLIP();
          }
        }
      });
  }

  CreatePOFLIP(): void {
    this.GetFLIPFromPOHeader();
    this.SelectedBPCFLIPHeaderView.CreatedBy = this.authenticationDetails.UserID.toString();
    this.IsProgressBarVisibile = true;
    this._pOFlipService.CreatePOFLIP(this.SelectedBPCFLIPHeaderView).subscribe(
      (data) => {
        this.SelectedBPCFLIPHeader.FLIPID = (data as BPCFLIPHeader).FLIPID;
        if (this.fileToUploadList && this.fileToUploadList.length) {
          this._pOFlipService.AddPOFLIPAttachment(this.SelectedBPCFLIPHeader.FLIPID, this.authenticationDetails.UserID.toString(), this.fileToUploadList).subscribe(
            (dat) => {
              this.ResetControl();
              this.notificationSnackBarComponent.openSnackBar('PO Flip Saved successfully', SnackBarStatus.success);
              this.IsProgressBarVisibile = false;
              this.GetFLIPsByDoc();
              this.GetFLIPCostsByFLIPID();
            },
            (err) => {
              this.showErrorNotificationSnackBar(err);
            }
          );
        }
        else {
          this.ResetControl();
          this.notificationSnackBarComponent.openSnackBar('PO Flip Saved successfully', SnackBarStatus.success);
          this.IsProgressBarVisibile = false;
          this.GetFLIPsByDoc();
          this.GetFLIPCostsByFLIPID();
        }
      },
      (err) => {
        this.showErrorNotificationSnackBar(err);
      }
    );
  }

  UpdatePOFLIP(): void {
    this.SelectedBPCFLIPHeaderView.FLIPID = this.SelectedBPCFLIPHeader.FLIPID;
    this.SelectedBPCFLIPHeaderView.ModifiedBy = this.authenticationDetails.UserID.toString();
    this.IsProgressBarVisibile = true;
    this._pOFlipService.UpdatePOFLIP(this.SelectedBPCFLIPHeaderView).subscribe(
      (data) => {
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('PO Flip Updated successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        this.GetFLIPsByDoc();
        this.GetFLIPCostsByFLIPID();
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  DeletePOFLIP(): void {
    this.GetFLIPValues();
    // this.SelectedBPCFLIPHeader.ModifiedBy = this.authenticationDetails.userID.toString();
    this.IsProgressBarVisibile = true;
    this._pOFlipService.DeletePOFLIP(this.SelectedBPCFLIPHeader).subscribe(
      (data) => {
        // console.log(data);
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('PO Flip deleted successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        // this.GetAllFLIPs();
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  POFlipCostEnterKeyDown(): boolean {
    this.bankCity.nativeElement.blur();
    this.AddFLIPCostToTable();
    return true;
  }

  keytab(elementName): void {
    switch (elementName) {
      case 'iDNumber': {
        this.iDNumber.nativeElement.focus();
        break;
      }
      case 'validUntil': {
        this.validUntil.nativeElement.focus();
        break;
      }
      case 'accountNo': {
        this.accountNo.nativeElement.focus();
        break;
      }
      case 'accHolderName': {
        this.accHolderName.nativeElement.focus();
        break;
      }
      case 'ifsc': {
        this.ifsc.nativeElement.focus();
        break;
      }
      case 'bankName': {
        this.bankName.nativeElement.focus();
        break;
      }
      case 'branch': {
        this.branch.nativeElement.focus();
        break;
      }
      case 'bankCity': {
        this.bankCity.nativeElement.focus();
        break;
      }
      case 'department': {
        this.department.nativeElement.focus();
        break;
      }
      case 'title': {
        this.title.nativeElement.focus();
        break;
      }
      case 'mobile': {
        this.mobile.nativeElement.focus();
        break;
      }
      case 'email': {
        this.email.nativeElement.focus();
        break;
      }
      case 'activityDate': {
        this.activityDate.nativeElement.focus();
        break;
      }
      case 'activityTime': {
        this.activityTime.nativeElement.focus();
        break;
      }
      case 'activityText': {
        this.activityText.nativeElement.focus();
        break;
      }
      default: {
        break;
      }
    }
  }

  // typeSelected(event): void {
  //   const selectedType = event.value;
  //   if (event.value) {
  //     this.SelectedBPCFLIPHeader.Type = event.value;
  //   }
  // }

  invoiceTypeSelected(event): void {

  }

  invoiceCurrencySelected(event): void {

  }

  applyFilter(filterValue: string): void {
    this.FLIPCostDataSource.filter = filterValue.trim().toLowerCase();
  }

  EnableAllFLIPTypes(): void {
    Object.keys(this.FLIPFormGroup.controls).forEach(key => {
      this.FLIPFormGroup.get(key).enable();
    });
  }

  showErrorNotificationSnackBar(err: any): void {
    console.error(err);
    this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
    this.IsProgressBarVisibile = false;
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

  handleFileInput(evt): void {
    if (evt.target.files && evt.target.files.length > 0) {
      this.fileToUpload = evt.target.files[0];
      // this.fileToUploadList.push(this.fileToUpload);
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 8 || charCode === 9 || charCode === 13 || charCode === 46
      || charCode === 37 || charCode === 39 || charCode === 123 || charCode === 190) {
      return true;
    }
    else if (charCode < 48 || charCode > 57) {
      return false;
    }
    return true;
  }

  onKey(index: any): void {
    // this.aAmount.nativeElement.focus();
    // const price = event.target.value;
    // if (index) {
    const fLIPItemFormArray = this.FLIPItemFormGroup.get('FLIPItems') as FormArray;
    // fLIPItemFormArray.controls.forEach((x, i) => {
    //   const invoiceQty = x.get('InvoiceQty').value;
    //   const tax = x.get('Tax').value;
    //   const amount = Number(invoiceQty) * +tax * +Number(price);
    //   x.get('Amount').patchValue(amount);
    //   return;
    //   // fLIPItemFormArray.at(i).patchValue(amount);
    // });
    const invoiceQty = fLIPItemFormArray.at(index).get('InvoiceQty').value;
    const tax = fLIPItemFormArray.at(index).get('Tax').value;
    const price = fLIPItemFormArray.at(index).get('Price').value;
    const amount = this.convertStringToNumber(invoiceQty) * this.convertStringToNumber(tax) * this.convertStringToNumber(price);
    fLIPItemFormArray.at(index).get('Amount').patchValue(amount);
    // for (const x of fLIPItemFormArray.controls) {
    //   const invoiceQty = x.get('InvoiceQty').value;
    //   const tax = x.get('Tax').value;
    //   const amount = Number(invoiceQty) * +tax * +Number(price);
    //   x.get('Amount').patchValue(amount);
    //   break;
    // }
    // }
  }

  convertStringToNumber(input: string): number {
    const numeric = Number(input);
    return numeric;
  }
  // GetAttachment(fileName: string, file?: File): void {
  //   if (file && file.size) {
  //     const blob = new Blob([file], { type: file.type });
  //     this.OpenAttachmentDialog(fileName, blob);
  //   } else {
  //     this.IsProgressBarVisibile = true;
  //     this._pOFlipService.DowloandPOFlipImage(fileName).subscribe(
  //       data => {
  //         if (data) {
  //           let fileType = 'image/jpg';
  //           fileType = fileName.toLowerCase().includes('.jpg') ? 'image/jpg' :
  //             fileName.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
  //               fileName.toLowerCase().includes('.png') ? 'image/png' :
  //                 fileName.toLowerCase().includes('.gif') ? 'image/gif' : '';
  //           const blob = new Blob([data], { type: fileType });
  //           this.OpenAttachmentDialog(fileName, blob);
  //         }
  //         this.IsProgressBarVisibile = false;
  //       },
  //       error => {
  //         console.error(error);
  //         this.IsProgressBarVisibile = false;
  //       }
  //     );
  //   }
  // }
  // OpenAttachmentDialog(FileName: string, blob: Blob): void {
  //   const attachmentDetails: AttachmentDetails = {
  //     FileName: FileName,
  //     blob: blob
  //   };
  //   const dialogConfig: MatDialogConfig = {
  //     data: attachmentDetails,
  //     panelClass: 'attachment-dialog'
  //   };
  //   const dialogRef = this.dialog.open(AttachmentDialogComponent, dialogConfig);
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //     }
  //   });
  // }
}




