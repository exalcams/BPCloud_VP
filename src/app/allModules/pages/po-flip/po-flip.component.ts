import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { AttachmentDialogComponent } from 'app/allModules/pages/attachment-dialog/attachment-dialog.component';
import { AttachmentDetails } from 'app/models/task';
import { fuseAnimations } from '@fuse/animations';
import { BPCFLIPHeader, BPCFLIPHeaderView, BPCFLIPCost, BPCFLIPItem } from 'app/models/po-flip';
import { POFlipService } from 'app/services/po-flip.service';
import { BPCOFHeader, BPCOFItem } from 'app/models/OrderFulFilment';
import { POService } from 'app/services/po.service';
import { BehaviorSubject } from 'rxjs';
import { BPCInvoiceAttachment } from 'app/models/ASN';
@Component({
  selector: 'app-po-flip',
  templateUrl: './po-flip.component.html',
  styleUrls: ['./po-flip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PoFlipComponent implements OnInit {
  menuItems: string[];
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserRole = '';
  notificationSnackBarComponent: NotificationSnackBarComponent;
  isProgressBarVisibile: boolean;
  flipFormGroup: FormGroup;
  flipCostFormGroup: FormGroup;
  flipItemFormGroup: FormGroup;
  flips: BPCFLIPHeader[] = [];
  selectedFlip: BPCFLIPHeader;
  selectedFlipHeaderView: BPCFLIPHeaderView;
  flipCosts: BPCFLIPCost[] = [];
  flipCostDisplayedColumns: string[] = [
    'ExpenceType',
    'Amount',
    'Remark',
    'Action'
  ];
  flipCostDataSource = new MatTableDataSource<BPCFLIPCost>();
  flipItems: BPCFLIPItem[] = [];
  flipItemDisplayedColumns: string[] = [
    'Item',
    'MaterialText',
    // 'DeliveryDate',
    'HSN',
    'OrderedQty',
    'OpenQty',
    'InvoiceQty',
    'Price',
    'Tax',
    'Amount',
  ];
  flipItemFormArray: FormArray = this._formBuilder.array([]);
  flipItemDataSource = new BehaviorSubject<AbstractControl[]>([]);
  @ViewChild(MatPaginator) flipItemPaginator: MatPaginator;
  @ViewChild(MatSort) flipItemSort: MatSort;
  poHeader: BPCOFHeader;
  poItems: BPCOFItem[] = [];
  selectedDocNumber: string;
  selectedDocDate: Date;
  selectedFLIPID: string;
  searchText = '';
  selection = new SelectionModel<any>(true, []);
  fileToUpload: File;
  fileToUploadList: File[] = [];
  currencies: string[] = [];
  states: string[] = [];
  invoiceTypes: string[] = [];
  math = Math;
  constructor(
    private _poFlipService: POFlipService,
    private _poService: POService,
    private _router: Router,
    private _route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder
  ) {
    this.selectedFlip = new BPCFLIPHeader();
    this.selectedFlipHeaderView = new BPCFLIPHeaderView();
    this.poHeader = new BPCOFHeader();
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.isProgressBarVisibile = false;
    this.currencies = ['USD', 'INR'];
    this.invoiceTypes = ['Service', 'Registered'];
    this.states = [
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
      this.selectedDocNumber = params['id'];
    });
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.menuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.menuItems.indexOf('Flip') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this._router.navigate(['/auth/login']);
      }
      this.getFlipBasedOnCondition();
      this.initializeFlipFormGroup();
      this.initializeFlipCostFormGroup();
      this.initializeFlipItemFormGroup();
    } else {
      this._router.navigate(['/auth/login']);
    }
  }

  getFlipBasedOnCondition(): void {
    if (this.selectedDocNumber) {
      this.GetPOByDocAndPartnerID();
      this.GetPOItemsByDocAndPartnerID();
      this.GetFlipsByDocAndPartnerID();
      this.GetFlipCostsByFLIPID();
    } else {
      this.GetFlipsByPartnerID();
    }
  }

  // Get PO Header details by DocNumber and PartnerID
  GetPOByDocAndPartnerID(): void {
    this._poService.GetPOByDocAndPartnerID(this.selectedDocNumber, this.authenticationDetails.UserName).subscribe(
      (data) => {
        this.poHeader = data as BPCOFHeader;
        console.log(this.poHeader);
        this.selectedDocDate = this.poHeader.DocDate;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // Get PO Item details by DocNumber and PartnerID
  GetPOItemsByDocAndPartnerID(): void {
    this._poService.GetPOItemsByDocAndPartnerID(this.selectedDocNumber, this.authenticationDetails.UserName).subscribe(
      (data) => {
        this.poItems = data as BPCOFItem[];
        console.log(this.poItems);
        this.clearFormArray(this.flipItemFormArray);
        if (this.poItems && this.poItems.length) {
          // this.selectedFlip.Client = this.selectedFlipHeaderView.Client = this.poItems[0].Client;
          // this.selectedFlip.Company = this.selectedFlipHeaderView.Company = this.poItems[0].Company;
          // this.selectedFlip.Type = this.selectedFlipHeaderView.Type = this.poItems[0].Type;
          // this.selectedFlip.PatnerID = this.selectedFlipHeaderView.PatnerID = this.poItems[0].PatnerID;
          // this.selectedFlip.DocNumber = this.selectedFlipHeaderView.DocNumber = this.poItems[0].DocNumber;
          this.poItems.forEach(x => {
            this.insertPoItemsFormGroup(x);
          });
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetFlipsByPartnerID(): void {
    this._poFlipService.GetPOFLIPsByPartnerID(this.authenticationDetails.UserName).subscribe(
      (data) => {
        this.flips = data as BPCFLIPHeader[];
        if (this.flips && this.flips.length) {
          this.loadSelectedFlip(this.flips[0]);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetFlipsByDocAndPartnerID(): void {
    this._poFlipService.GetPOFLIPsByDocAndPartnerID(this.selectedDocNumber, this.authenticationDetails.UserName).subscribe(
      (data) => {
        this.flips = data as BPCFLIPHeader[];
        if (this.flips && this.flips.length) {
          this.loadSelectedFlip(this.flips[0]);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetFlipCostsByFLIPID(): void {
    this.isProgressBarVisibile = true;
    this._poFlipService.GetFLIPCostsByFLIPID(this.selectedFlip.FLIPID).subscribe(
      (data) => {
        this.isProgressBarVisibile = false;
        this.flipCosts = data as BPCFLIPCost[];
        this.flipCostDataSource = new MatTableDataSource(this.flipCosts);
      },
      (err) => {
        console.error(err);
        this.isProgressBarVisibile = false;
      }
    );
  }

  GetFlipItemsByFLIPID(): void {
    this._poFlipService.GetFLIPItemsByFLIPID(this.selectedFlip.FLIPID).subscribe(
      (data) => {
        this.selectedFlipHeaderView.FLIPItems = data as BPCFLIPItem[];
        console.log(this.selectedFlipHeaderView.FLIPItems);
        if (this.selectedFlipHeaderView.FLIPItems && this.selectedFlipHeaderView.FLIPItems.length) {
          this.clearFormArray(this.flipItemFormArray);
          this.selectedFlipHeaderView.FLIPItems.forEach(x => {
            this.insertFlipItemsFormGroup(x);
          });
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  CreateFlip(): void {
    this.selectedFlipHeaderView.CreatedBy = this.authenticationDetails.UserID.toString();
    this.selectedFlipHeaderView.Client = this.selectedFlip.Client;
    this.selectedFlipHeaderView.Company = this.selectedFlip.Company;
    this.selectedFlipHeaderView.Type = this.selectedFlip.Type;
    this.selectedFlipHeaderView.PatnerID = this.selectedFlip.PatnerID;
    this.selectedFlipHeaderView.DocNumber = this.selectedFlip.DocNumber;
    this.isProgressBarVisibile = true;
    this._poFlipService.CreatePOFLIP(this.selectedFlipHeaderView).subscribe(
      (data) => {
        this.selectedFlip.FLIPID = (data as BPCFLIPHeader).FLIPID;
        if (this.fileToUploadList && this.fileToUploadList.length) {
          this._poFlipService.AddPOFLIPAttachment(this.selectedFlip.FLIPID, this.authenticationDetails.UserID.toString(), this.fileToUploadList).subscribe(
            (dat) => {
              this.resetControl();
              this.notificationSnackBarComponent.openSnackBar('PO Flip Saved successfully', SnackBarStatus.success);
              this.isProgressBarVisibile = false;
              this.GetFlipsByDocAndPartnerID();
            },
            (err) => {
              this.showErrorNotificationSnackBar(err);
            }
          );
        }
        else {
          this.resetControl();
          this.notificationSnackBarComponent.openSnackBar('PO Flip Saved successfully', SnackBarStatus.success);
          this.isProgressBarVisibile = false;
          this.GetFlipsByDocAndPartnerID();
        }
      },
      (err) => {
        this.showErrorNotificationSnackBar(err);
      }
    );
  }

  UpdateFlip(): void {
    this.selectedFlipHeaderView.FLIPID = this.selectedFlip.FLIPID;
    this.selectedFlipHeaderView.ModifiedBy = this.authenticationDetails.UserID.toString();
    this.selectedFlipHeaderView.Client = this.selectedFlip.Client;
    this.selectedFlipHeaderView.Company = this.selectedFlip.Company;
    this.selectedFlipHeaderView.Type = this.selectedFlip.Type;
    this.selectedFlipHeaderView.PatnerID = this.selectedFlip.PatnerID;
    this.selectedFlipHeaderView.DocNumber = this.selectedFlip.DocNumber;
    this.isProgressBarVisibile = true;
    this._poFlipService.UpdatePOFLIP(this.selectedFlipHeaderView).subscribe(
      (data) => {
        this.resetControl();
        this.notificationSnackBarComponent.openSnackBar('PO Flip Updated successfully', SnackBarStatus.success);
        this.isProgressBarVisibile = false;
        this.GetFlipsByDocAndPartnerID();
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.isProgressBarVisibile = false;
      }
    );
  }

  DeleteFlip(): void {
    this.getFlipFormValues();
    this.isProgressBarVisibile = true;
    this._poFlipService.DeletePOFLIP(this.selectedFlip).subscribe(
      (data) => {
        this.resetControl();
        this.notificationSnackBarComponent.openSnackBar('PO Flip deleted successfully', SnackBarStatus.success);
        this.isProgressBarVisibile = false;
        this.GetFlipsByDocAndPartnerID();
        this.GetPOItemsByDocAndPartnerID();
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.isProgressBarVisibile = false;
      }
    );
  }

  initializeFlipFormGroup(): void {
    this.flipFormGroup = this._formBuilder.group({
      InvoiceNumber: ['', Validators.required],
      InvoiceDate: ['', Validators.required],
      InvoiceAmount: ['', Validators.required],
      InvoiceCurrency: ['', Validators.required],
      InvoiceType: ['', Validators.required],
      IsInvoiceOrCertified: ['', Validators.required],
    });
  }

  initializeFlipCostFormGroup(): void {
    this.flipCostFormGroup = this._formBuilder.group({
      ExpenceType: ['', Validators.required],
      Amount: ['', Validators.required],
      Remarks: ['', Validators.required],
    });
  }

  initializeFlipItemFormGroup(): void {
    this.flipItemFormGroup = this._formBuilder.group({
      flipItems: this.flipItemFormArray
    });
  }

  insertPoItemsFormGroup(poItem: BPCOFItem): void {
    const row = this._formBuilder.group({
      Item: [poItem.Item],
      Material: [poItem.Material],
      MaterialText: [poItem.MaterialText],
      // DeliveryDate: [poItem.DeliveryDate],
      HSN: [poItem.HSN],
      OrderedQty: [poItem.OrderedQty],
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
    this.flipItemFormArray.push(row);
    this.flipItemDataSource.next(this.flipItemFormArray.controls);
    // return row;
  }

  insertFlipItemsFormGroup(flipItem: BPCFLIPItem): void {
    const row = this._formBuilder.group({
      Item: [flipItem.Item],
      Material: [flipItem.Material],
      MaterialText: [flipItem.MaterialText],
      // DeliveryDate: [flipItem.DeliveryDate],
      HSN: [flipItem.HSN],
      OrderedQty: [flipItem.OrderedQty],
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
    this.flipItemFormArray.push(row);
    this.flipItemDataSource.next(this.flipItemFormArray.controls);
    // return row;
  }

  resetControl(): void {
    this.selectedFlip = new BPCFLIPHeader();
    this.selectedFlipHeaderView = new BPCFLIPHeaderView();
    this.selectedFLIPID = null;
    this.flipFormGroup.reset();
    Object.keys(this.flipFormGroup.controls).forEach(key => {
      this.flipFormGroup.get(key).enable();
      this.flipFormGroup.get(key).markAsUntouched();
    });
    this.fileToUpload = null;
    this.fileToUploadList = [];
    this.clearFlipCostFormGroup();
    this.clearFlipCostDataSource();
  }

  clearFlipCostFormGroup(): void {
    this.flipCostFormGroup.reset();
    Object.keys(this.flipCostFormGroup.controls).forEach(key => {
      this.flipCostFormGroup.get(key).markAsUntouched();
    });
  }

  clearFlipCostDataSource(): void {
    this.flipCosts = [];
    this.flipCostDataSource = new MatTableDataSource(this.flipCosts);
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  loadSelectedFlip(selectedFLIP: BPCFLIPHeader): void {
    this.resetControl();
    this.selectedFlip = selectedFLIP;
    this.selectedFLIPID = selectedFLIP.FLIPID;
    this.selectedDocNumber = selectedFLIP.DocNumber;
    this.selectedDocDate = selectedFLIP.InvoiceDate;
    this.GetFlipItemsByFLIPID();
    this.GetFlipCostsByFLIPID();
    console.log(this.selectedFlip);
    console.log(this.selectedDocNumber);
    // this.GetPOByFLIPAndPartnerID();
    this.setFlipFormValues();
  }

  setFlipFormValues(): void {
    this.flipFormGroup.get('InvoiceNumber').patchValue(this.selectedFlip.InvoiceNumber);
    this.flipFormGroup.get('InvoiceDate').patchValue(this.selectedFlip.InvoiceDate);
    this.flipFormGroup.get('InvoiceCurrency').patchValue(this.selectedFlip.InvoiceCurrency);
    this.flipFormGroup.get('InvoiceType').patchValue(this.selectedFlip.InvoiceType);
    this.flipFormGroup.get('IsInvoiceOrCertified').patchValue(this.selectedFlip.IsInvoiceOrCertified);
    this.flipFormGroup.get('InvoiceAmount').patchValue(this.selectedFlip.InvoiceAmount);
  }

  getFlipFormValues(): void {
    this.selectedFlip.InvoiceNumber = this.selectedFlipHeaderView.InvoiceNumber = this.flipFormGroup.get('InvoiceNumber').value;
    this.selectedFlip.InvoiceDate = this.selectedFlipHeaderView.InvoiceDate = this.flipFormGroup.get('InvoiceDate').value;
    this.selectedFlip.InvoiceCurrency = this.selectedFlipHeaderView.InvoiceCurrency = this.flipFormGroup.get('InvoiceCurrency').value;
    this.selectedFlip.InvoiceAmount = this.selectedFlipHeaderView.InvoiceAmount = this.flipFormGroup.get('InvoiceAmount').value;
    this.selectedFlip.InvoiceType = this.selectedFlipHeaderView.InvoiceType = this.flipFormGroup.get('InvoiceType').value;
    this.selectedFlip.IsInvoiceOrCertified = this.selectedFlipHeaderView.IsInvoiceOrCertified = this.flipFormGroup.get('IsInvoiceOrCertified').value;
    this.selectedFlip.InvoiceAmount = this.selectedFlipHeaderView.InvoiceAmount = this.flipFormGroup.get('InvoiceAmount').value;
    if (this.fileToUpload) {
      this.selectedFlip.InvoiceAttachmentName = this.selectedFlipHeaderView.InvoiceAttachmentName = this.fileToUpload.name;
      this.fileToUploadList.push(this.fileToUpload);
      this.fileToUpload = null;
    }
  }

  getFlipItemFormValues(): void {
    this.selectedFlipHeaderView.FLIPItems = [];
    const fLIPItemFormArray = this.flipItemFormGroup.get('flipItems') as FormArray;
    fLIPItemFormArray.controls.forEach((x, i) => {
      const item: BPCFLIPItem = new BPCFLIPItem();
      item.Item = x.get('Item').value;
      item.Material = x.get('Material').value;
      item.MaterialText = x.get('MaterialText').value;
      // item.DeliveryDate = x.get('DeliveryDate').value;
      item.HSN = x.get('HSN').value;
      item.OrderedQty = x.get('OrderedQty').value;
      item.OpenQty = x.get('OpenQty').value;
      item.InvoiceQty = x.get('InvoiceQty').value;
      item.Price = x.get('Price').value;
      item.Tax = x.get('Tax').value;
      item.Amount = x.get('Amount').value;
      this.selectedFlipHeaderView.FLIPItems.push(item);
    });
  }

  getFlipCostFormValues(): void {
    this.selectedFlipHeaderView.FLIPCosts = [];
    this.flipCosts.forEach(x => {
      this.selectedFlipHeaderView.FLIPCosts.push(x);
    });
  }

  getFlipFromPoHeader(): void {
    this.selectedFlip.Client = this.selectedFlipHeaderView.Client = this.poHeader.Client;
    this.selectedFlip.Company = this.selectedFlipHeaderView.Company = this.poHeader.Company;
    this.selectedFlip.Type = this.selectedFlipHeaderView.Type = this.poHeader.Type;
    this.selectedFlip.PatnerID = this.selectedFlipHeaderView.PatnerID = this.poHeader.PatnerID;
    this.selectedFlip.DocNumber = this.selectedFlipHeaderView.DocNumber = this.poHeader.DocNumber;
  }

  addFlipCostToTable(): void {
    if (this.flipCostFormGroup.valid) {
      const bPCFlipCost = new BPCFLIPCost();
      bPCFlipCost.Amount = this.flipCostFormGroup.get('Amount').value;
      bPCFlipCost.Remarks = this.flipCostFormGroup.get('Remarks').value;
      bPCFlipCost.ExpenceType = this.flipCostFormGroup.get('ExpenceType').value;
      if (!this.flipCosts || !this.flipCosts.length) {
        this.flipCosts = [];
      }
      this.flipCosts.push(bPCFlipCost);
      this.flipCostDataSource = new MatTableDataSource(this.flipCosts);
      this.clearFlipCostFormGroup();
    } else {
      this.showValidationErrors(this.flipCostFormGroup);
    }
  }

  removeFlipCostFromTable(bPCFlipCost: BPCFLIPCost): void {
    const index: number = this.flipCosts.indexOf(bPCFlipCost);
    if (index > -1) {
      this.flipCosts.splice(index, 1);
    }
    this.flipCostDataSource = new MatTableDataSource(this.flipCosts);
  }

  addFlipItemAfterCalculationToTable(): void {
    // this.selectedFlipHeaderView.flipItems = [];
    const fLIPItemFormArray = this.flipItemFormGroup.get('flipItems') as FormArray;
    fLIPItemFormArray.controls.forEach((x, i) => {
      // const item: BPCFLIPItem = new BPCFLIPItem();
      // item.Item = x.get('Item').value;
      // item.Material = x.get('Material').value;
      // item.MaterialText = x.get('MaterialText').value;
      // item.DeliveryDate = x.get('DeliveryDate').value;
      // item.HSN = x.get('HSN').value;
      // item.OrderedQty = x.get('OrderedQty').value;
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
      // this.selectedFlipHeaderView.flipItems.push(item);
    });
  }

  saveClicked(): void {
    if (this.flipFormGroup.valid) {
      this.getFlipFormValues();
      // this.getFlipFromPoHeader();
      this.getFlipCostFormValues();
      this.getFlipItemFormValues();
      this.setActionToOpenConfirmation();
    } else {
      this.showValidationErrors(this.flipFormGroup);
    }
  }

  deleteClicked(): void {
    if (this.selectedFlip.FLIPID) {
      const Actiontype = 'Delete';
      const Catagory = 'PO Flip';
      this.openConfirmationDialog(Actiontype, Catagory);
    }
  }

  setActionToOpenConfirmation(): void {
    if (this.selectedFlip.FLIPID) {
      const Actiontype = 'Update';
      const Catagory = 'PO Flip';
      this.openConfirmationDialog(Actiontype, Catagory);
    } else {
      const Actiontype = 'Save';
      const Catagory = 'PO Flip';
      this.openConfirmationDialog(Actiontype, Catagory);
    }
  }

  openConfirmationDialog(Actiontype: string, Catagory: string): void {
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
            this.CreateFlip();
          } else if (Actiontype === 'Update') {
            this.UpdateFlip();
          } else if (Actiontype === 'Delete') {
            this.DeleteFlip();
          }
        }
      });
  }

  invoiceTypeSelected(event): void {

  }

  invoiceCurrencySelected(event): void {

  }

  applyFilter(filterValue: string): void {
    this.flipCostDataSource.filter = filterValue.trim().toLowerCase();
  }

  showErrorNotificationSnackBar(err: any): void {
    console.error(err);
    this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
    this.isProgressBarVisibile = false;
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
    const fLIPItemFormArray = this.flipItemFormGroup.get('flipItems') as FormArray;
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

  //   GetInvoiceAttachmentByFLIPID(): void {
  //     this._poFlipService.GetInvoiceAttachmentByASN(this.selectedFlip.FLIPID, this.selectedFlip.DocNumber).subscribe(
  //         (data) => {
  //             this.fileToUpload = data as BPCInvoiceAttachment;
  //         },
  //         (err) => {
  //             console.error(err);
  //         }
  //     );
  // }

}




