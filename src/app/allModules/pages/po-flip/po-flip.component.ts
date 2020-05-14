export class Cost {
  Type: string;
  Amount: string;
  Remarks: string;
}
export class PODetails {
  PO: string;
  MaterialTxt: string;
  HSN: string;
  OpenQty: string;
  InvoiceQty: string;
  Price: string;
  Tax: string;
  Amount: string;
}

import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MenuApp, AuthenticationDetails, UserView, VendorUser } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MasterService } from 'app/services/master.service';
import { Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { AttachmentDialogComponent } from 'app/allModules/pages/attachment-dialog/attachment-dialog.component';
import { AttachmentDetails } from 'app/models/task';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { BPCFLIPHeader, BPCFLIPHeaderView, BPCFLIPCost } from 'app/models/po-flip';
import { POFlipService } from 'app/services/po-flip.service';

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
  poFlipDetailsFormGroup: FormGroup;
  poFlipCostDetailsFormGroup: FormGroup;
  searchText = '';
  AllBPCFLIPs: BPCFLIPHeader[] = [];
  selectID: string;
  SelectedBPCFLIPHeader: BPCFLIPHeader;
  SelectedBPCFLIPHeaderView: BPCFLIPHeaderView;
  POFLIPCostByVOB: BPCFLIPCost[] = [];
  poFlipCostDetailsDisplayedColumns: string[] = [
    'ExpenceType',
    'Amount',
    'Remark',
    'Action'
  ];
  poFlipCostDetailsDataSource = new MatTableDataSource<BPCFLIPCost>();
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
  fileToUpload: File;
  fileToUploadList: File[] = [];
  AllRoles: string[] = [];
  AllTypes: string[] = [];
  AllCountries: string[] = [];
  AllInvoiceTypes: string[] = [];
  math = Math;
  poDetailsDisplayedColumns: string[] = [
    'PO',
    'MaterialTxt',
    'HSN',
    'OpenQty',
    'InvoiceQty',
    'Price',
    'Tax',
    'Amount',
    'Action'
  ];
  poCostDataSource: MatTableDataSource<Cost>;
  poDetailsDataSource: MatTableDataSource<PODetails>;
  PODetails: PODetails[] = [];

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _masterService: MasterService,
    private _pOFlipService: POFlipService,
    private _router: Router,
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
    // Retrive authorizationData
    // const retrievedObject = localStorage.getItem('authorizationData');
    // if (retrievedObject) {
    //     this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    //     this.currentUserID = this.authenticationDetails.UserID;
    //     this.currentUserRole = this.authenticationDetails.UserRole;
    //     this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
    //     if (this.MenuItems.indexOf('POFLIP') < 0) {
    //         this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
    //         );
    //         this._router.navigate(['/auth/login']);
    //     }

    // } else {
    //     this._router.navigate(['/auth/login']);
    // }

    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    }
    this.InitializePOFlipFormGroup();
    this.InitializePOFlipCostDetailsFormGroup();
    this.PODetails = [
      { PO: '10', MaterialTxt: 'Query Tools', HSN: '421836', OpenQty: '20', InvoiceQty: '18', Price: '18929', Tax: '3%', Amount: '18400' },
      { PO: '10', MaterialTxt: 'Query Tools', HSN: '421836', OpenQty: '20', InvoiceQty: '18', Price: '18929', Tax: '18%', Amount: '18400' },
      { PO: '10', MaterialTxt: 'Query Tools', HSN: '421836', OpenQty: '20', InvoiceQty: '18', Price: '18929', Tax: '14%', Amount: '18400' }
    ];
    this.poDetailsDataSource = new MatTableDataSource(this.PODetails);
  }

  InitializePOFlipFormGroup(): void {
    this.poFlipDetailsFormGroup = this._formBuilder.group({
      InvoiceNumber: ['', Validators.required],
      InvoiceDate: ['', Validators.required],
      InvoiceAmount: ['', Validators.required],
      InvoiceCurrency: ['', Validators.required],
      InvoiceType: ['', Validators.required],
      IsInvoiceOrCertified: ['', Validators.required],
    });
  }

  InitializePOFlipCostDetailsFormGroup(): void {
    this.poFlipCostDetailsFormGroup = this._formBuilder.group({
      ExpenceType: ['', Validators.required],
      Amount: ['', Validators.required],
      Remarks: ['', Validators.required],
    });
  }

  ResetControl(): void {
    this.SelectedBPCFLIPHeader = new BPCFLIPHeader();
    this.SelectedBPCFLIPHeaderView = new BPCFLIPHeaderView();
    this.selectID = null;
    this.poFlipDetailsFormGroup.reset();
    Object.keys(this.poFlipDetailsFormGroup.controls).forEach(key => {
      this.poFlipDetailsFormGroup.get(key).enable();
      this.poFlipDetailsFormGroup.get(key).markAsUntouched();
    });
    this.fileToUpload = null;
    this.fileToUploadList = [];
    this.ClearPOFlipCostDetailsFormGroup();
    this.ClearPOFlipCostDetailsDataSource();
  }

  ClearPOFlipCostDetailsFormGroup(): void {
    this.poFlipCostDetailsFormGroup.reset();
    Object.keys(this.poFlipCostDetailsFormGroup.controls).forEach(key => {
      this.poFlipCostDetailsFormGroup.get(key).markAsUntouched();
    });
  }

  ClearPOFlipCostDetailsDataSource(): void {
    this.POFLIPCostByVOB = [];
    this.poFlipCostDetailsDataSource = new MatTableDataSource(this.POFLIPCostByVOB);
  }

  loadSelectedPOFlip(selectedPOFlip: BPCFLIPHeader): void {
    this.ResetControl();
    this.SelectedBPCFLIPHeader = selectedPOFlip;
    this.selectID = selectedPOFlip.FLIPID;
    this.EnableAllPOFLIPTypes();
    this.SetPOFlipValues();
    this.GetPOFlipSubItems();
  }

  // typeSelected(event): void {
  //   const selectedType = event.value;
  //   if (event.value) {
  //     this.SelectedBPCFLIPHeader.Type = event.value;
  //   }
  // }

  invoiceTypeSelected(): void {

  }

  invoiceCurrencySelected(): void {

  }

  applyFilter(filterValue: string): void {
    this.poCostDataSource.filter = filterValue.trim().toLowerCase();
  }

  EnableAllPOFLIPTypes(): void {
    Object.keys(this.poFlipDetailsFormGroup.controls).forEach(key => {
      this.poFlipDetailsFormGroup.get(key).enable();
    });
  }

  SetPOFlipValues(): void {
    this.poFlipDetailsFormGroup.get('InvoiceNumber').patchValue(this.SelectedBPCFLIPHeader.InvoiceNumber);
    this.poFlipDetailsFormGroup.get('InvoiceDate').patchValue(this.SelectedBPCFLIPHeader.InvoiceDate);
    this.poFlipDetailsFormGroup.get('InvoiceCurrency').patchValue(this.SelectedBPCFLIPHeader.InvoiceDate);
    this.poFlipDetailsFormGroup.get('InvoiceType').patchValue(this.SelectedBPCFLIPHeader.InvoiceType);
    this.poFlipDetailsFormGroup.get('IsInvoiceOrCertified').patchValue(this.SelectedBPCFLIPHeader.IsInvoiceOrCertified);
    this.poFlipDetailsFormGroup.get('InvoiceAmount').patchValue(this.SelectedBPCFLIPHeader.InvoiceAmount);
  }

  GetPOFlipSubItems(): void {
    this.GetFLIPCostByVOB();
  }

  GetFLIPCostByVOB(): void {
    this.IsProgressBarVisibile = true;
    this._pOFlipService.GetFLIPCostByVOB(this.SelectedBPCFLIPHeader.FLIPID).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.POFLIPCostByVOB = data as BPCFLIPCost[];
        this.poFlipCostDetailsDataSource = new MatTableDataSource(this.POFLIPCostByVOB);
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  AddPOFlipCostToTable(): void {
    if (this.poFlipCostDetailsFormGroup.valid) {
      const bPCFlipCost = new BPCFLIPCost();
      bPCFlipCost.Amount = this.poFlipCostDetailsFormGroup.get('Amount').value;
      bPCFlipCost.Remarks = this.poFlipCostDetailsFormGroup.get('Remarks').value;
      bPCFlipCost.ExpenceType = this.poFlipCostDetailsFormGroup.get('ExpenceType').value;
      if (!this.POFLIPCostByVOB || !this.POFLIPCostByVOB.length) {
        this.POFLIPCostByVOB = [];
      }
      this.POFLIPCostByVOB.push(bPCFlipCost);
      this.poFlipCostDetailsDataSource = new MatTableDataSource(this.POFLIPCostByVOB);
      this.ClearPOFlipCostDetailsFormGroup();
    } else {
      this.ShowValidationErrors(this.poFlipCostDetailsFormGroup);
    }
  }

  POFlipCostEnterKeyDown(): boolean {
    this.bankCity.nativeElement.blur();
    this.AddPOFlipCostToTable();
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

  RemovePOFlipCostFromTable(bPCFlipCost: BPCFLIPCost): void {
    const index: number = this.POFLIPCostByVOB.indexOf(bPCFlipCost);
    if (index > -1) {
      this.POFLIPCostByVOB.splice(index, 1);
    }
    this.poFlipCostDetailsDataSource = new MatTableDataSource(this.POFLIPCostByVOB);
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
          if (Actiontype === 'Register') {
            this.CreatePOFLIP();
          } else if (Actiontype === 'Update') {
            this.CreatePOFLIP();
          } else if (Actiontype === 'Delete') {
            this.DeletePOFLIP();
          }
        }
      });
  }

  GetPOFlipValues(): void {
    this.SelectedBPCFLIPHeader.InvoiceNumber = this.SelectedBPCFLIPHeaderView.InvoiceNumber = this.poFlipDetailsFormGroup.get('InvoiceNumber').value;
    this.SelectedBPCFLIPHeader.InvoiceDate = this.SelectedBPCFLIPHeaderView.InvoiceDate = this.poFlipDetailsFormGroup.get('InvoiceDate').value;
    this.SelectedBPCFLIPHeader.InvoiceCurrency = this.SelectedBPCFLIPHeaderView.InvoiceCurrency = this.poFlipDetailsFormGroup.get('InvoiceCurrency').value;
    this.SelectedBPCFLIPHeader.InvoiceAmount = this.SelectedBPCFLIPHeaderView.InvoiceAmount = this.poFlipDetailsFormGroup.get('InvoiceAmount').value;
    this.SelectedBPCFLIPHeader.InvoiceType = this.SelectedBPCFLIPHeaderView.InvoiceType = this.poFlipDetailsFormGroup.get('InvoiceType').value;
    this.SelectedBPCFLIPHeader.IsInvoiceOrCertified = this.SelectedBPCFLIPHeaderView.IsInvoiceOrCertified = this.poFlipDetailsFormGroup.get('IsInvoiceOrCertified').value;
    this.SelectedBPCFLIPHeader.InvoiceAmount = this.SelectedBPCFLIPHeaderView.InvoiceAmount = this.poFlipDetailsFormGroup.get('InvoiceAmount').value;
    if (this.fileToUpload) {
      this.SelectedBPCFLIPHeader.InvoiceAttachmentName = this.fileToUpload.name;
      this.fileToUploadList.push(this.fileToUpload);
      this.fileToUpload = null;
    }
  }

  GetPOFlipSubItemValues(): void {
    this.GetBPCFLIPCostValues();
  }

  GetBPCFLIPCostValues(): void {
    this.SelectedBPCFLIPHeaderView.bPCFLIPCosts = [];
    // this.SelectedBPCFLIPHeaderView.BPCFLIPCosts.push(...this.POFLIPCostByVOB);
    this.POFLIPCostByVOB.forEach(x => {
      this.SelectedBPCFLIPHeaderView.bPCFLIPCosts.push(x);
    });
  }

  CreatePOFLIP(): void {
    // this.GetPOFlipValues();
    // this.GetPOFlipSubItemValues();
    this.SelectedBPCFLIPHeaderView.CreatedBy = this.authenticationDetails.UserID.toString();
    this.IsProgressBarVisibile = true;
    this._pOFlipService.CreatePOFLIP(this.SelectedBPCFLIPHeaderView).subscribe(
      (data) => {
        this.SelectedBPCFLIPHeader.FLIPID = (data as BPCFLIPHeader).FLIPID;
        if (this.fileToUploadList && this.fileToUploadList.length) {
          this._pOFlipService.AddPOFLIPAttachment(this.SelectedBPCFLIPHeader.FLIPID, this.SelectedBPCFLIPHeader.CreatedBy, this.fileToUploadList).subscribe(
            (dat) => {
              this.ResetControl();
              this.notificationSnackBarComponent.openSnackBar('PO Flip Saved successfully', SnackBarStatus.success);
              this.IsProgressBarVisibile = false;
            },
            (err) => {
              this.showErrorNotificationSnackBar(err);
            }
          );
        }
      },
      (err) => {
        this.showErrorNotificationSnackBar(err);
      }
    );
  }

  showErrorNotificationSnackBar(err: any): void {
    console.error(err);
    this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
    this.IsProgressBarVisibile = false;
  }

  UpdatePOFLIP(): void {
    // this.GetPOFlipValues();
    // this.GetPOFlipSubItemValues();
    this.SelectedBPCFLIPHeaderView.FLIPID = this.SelectedBPCFLIPHeader.FLIPID;
    // this.SelectedBPCFLIPHeaderView.ModifiedBy = this.authenticationDetails.userID.toString();
    this.IsProgressBarVisibile = true;
    this._pOFlipService.UpdatePOFLIP(this.SelectedBPCFLIPHeaderView).subscribe(
      (data) => {
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('PO Flip Updated successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        // this.GetAllPOFLIPs();
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  DeletePOFLIP(): void {
    this.GetPOFlipValues();
    // this.SelectedBPCFLIPHeader.ModifiedBy = this.authenticationDetails.userID.toString();
    this.IsProgressBarVisibile = true;
    this._pOFlipService.DeletePOFLIP(this.SelectedBPCFLIPHeader).subscribe(
      (data) => {
        // console.log(data);
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('PO Flip deleted successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        // this.GetAllPOFLIPs();
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
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

  SaveClicked(): void {
    if (this.poFlipDetailsFormGroup.valid) {
      // const file: File = this.fileToUpload;
      this.GetPOFlipValues();
      this.GetPOFlipSubItemValues();
      // if (this.SelectedBPCFLIPHeader.Type.toLocaleLowerCase() === 'ui') {
      //   if (this.SelectedBPCFLIPHeaderView.bPIdentities && this.SelectedBPCFLIPHeaderView.bPIdentities.length &&
      //     this.SelectedBPCFLIPHeaderView.bPIdentities.length > 0) {
      //     this.SetActionToOpenConfirmation();
      //   } else {
      //     this.notificationSnackBarComponent.openSnackBar('Please add atleast one record for BPIdentity table', SnackBarStatus.danger);
      //   }
      // } else {
      //   this.SetActionToOpenConfirmation();
      // }
      this.SetActionToOpenConfirmation();
    } else {
      this.ShowValidationErrors(this.poFlipDetailsFormGroup);
    }
  }

  SetActionToOpenConfirmation(): void {
    if (this.SelectedBPCFLIPHeader.FLIPID) {
      const Actiontype = 'Update';
      const Catagory = 'PO Flip';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    } else {
      const Actiontype = 'Register';
      const Catagory = 'PO Flip';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    }
  }

  DeleteClicked(): void {
    // if (this.poFlipDetailsFormGroup.valid) {
    if (this.SelectedBPCFLIPHeader.FLIPID) {
      const Actiontype = 'Delete';
      const Catagory = 'PO Flip';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    }
    // } else {
    //   this.ShowValidationErrors(this.poFlipDetailsFormGroup);
    // }
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




