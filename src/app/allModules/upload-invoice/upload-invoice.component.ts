import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { AuthenticationDetails, AppUsage } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { AttachmentDialogComponent } from 'app/notifications/attachment-dialog/attachment-dialog.component';
import { AttachmentDetails } from 'app/models/task';
import { fuseAnimations } from '@fuse/animations';
import { BPCFLIPHeader, BPCFLIPHeaderView, BPCFLIPCost, BPCFLIPItem, BPCExpenseTypeMaster } from 'app/models/po-flip';
import { POFlipService } from 'app/services/po-flip.service';
import { BPCOFHeader, BPCOFItem } from 'app/models/OrderFulFilment';
import { POService } from 'app/services/po.service';
import { BehaviorSubject } from 'rxjs';
import { BPCInvoiceAttachment, BPCCurrencyMaster, BPCCountryMaster } from 'app/models/ASN';
import { ASNService } from 'app/services/asn.service';
import { MasterService } from 'app/services/master.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { BPCFact } from 'app/models/fact';
import { FactService } from 'app/services/fact.service';

@Component({
  selector: 'app-upload-invoice',
  templateUrl: './upload-invoice.component.html',
  styleUrls: ['./upload-invoice.component.scss']
})
export class UploadInvoiceComponent implements OnInit {

  fuseConfig: any;
  BGClassName: any;

  menuItems: string[];
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole = '';
  notificationSnackBarComponent: NotificationSnackBarComponent;
  isProgressBarVisibile: boolean;
  SecondTableFormGroup: FormGroup;
  flipFormGroup: FormGroup;
  flipCostFormGroup: FormGroup;
  flipItemFormGroup: FormGroup;
  flips: BPCFLIPHeader[] = [];
  selectedFlip: BPCFLIPHeader;
  selectedFlipView: BPCFLIPHeaderView;
  flipCosts: BPCFLIPCost[] = [];
  flipCostDisplayedColumns: string[] = [
    'ExpenceType',
    'Amount',
    'Remark',
    'Action'
  ];
  flipCostDataSource = new MatTableDataSource<BPCFLIPCost>();
  flipItemDataSource = new MatTableDataSource<BPCFLIPItem>();
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
  // flipItemDataSource = new BehaviorSubject<AbstractControl[]>([]);
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
  currencies: BPCCurrencyMaster[] = [];
  countries: BPCCountryMaster[] = [];
  expenseTypes: BPCExpenseTypeMaster[] = [];
  states: string[] = [];
  invoiceTypes: string[] = [];
  math = Math;
  maxDate: Date;
  ItemTableSelectedIndex = -1;
  ItemTableSelectedItem: BPCFLIPItem;
  SelectedFlipCostTableIndex = -1;
  SelectFlipCostTableRow: BPCFLIPCost;


  constructor(
    private _fuseConfigService: FuseConfigService,
    private _poFlipService: POFlipService,
    private _poService: POService,
    private _ASNService: ASNService,
    private _masterService: MasterService,
    private _router: Router,
    private _route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _factService:FactService
  ) {
    this.selectedFlip = new BPCFLIPHeader();
    this.selectedFlipView = new BPCFLIPHeaderView();
    this.selectedFLIPID = '';
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.isProgressBarVisibile = false;
    // this.currencies = ['USD', 'INR'];
    this.invoiceTypes = ['Service', 'Registered'];

    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.SetUserPreference();
    this._route.queryParams.subscribe(params => {
      this.selectedDocNumber = params['id'];
    });
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserName = this.authenticationDetails.UserName;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.menuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.menuItems.indexOf('UploadInvoice') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this._router.navigate(['/auth/login']);
      }
      // this.CreateAppUsage();
      // this.getFlipBasedOnCondition();
      this.initializeFlipFormGroup();
      this.initializeFlipCostFormGroup();
      // this.initializeFlipItemFormGroup();
      this.initialize2ndTableFormGroup();
      this.GetCurrencyMasters();
      this.GetCountryMasters();
      this.GetExpenseTypeMasters();
      this.GetPOPartnerID();
      this.GetFlipsByPartnerID();
    } else {
      this._router.navigate(['/auth/login']);
    }
  }
  CreateAppUsage(): void {
    const appUsage: AppUsage = new AppUsage();
    appUsage.UserID = this.currentUserID;
    appUsage.AppName = 'PO Flip';
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
  loadSelectedFlip(selectedFLIP: BPCFLIPHeader): void {
    this.selectedFlip = selectedFLIP;
    console.log("selectedFlip",this.selectedFlip);
    this.selectedFlipView.FLIPID = this.selectedFlip.FLIPID;
    this.selectedFLIPID = selectedFLIP.FLIPID;
    this.selectedDocDate = selectedFLIP.InvoiceDate;
    // this.GetPOByDocAndPartnerID(this.selectedFlip.DocNumber);
    this.GetFlipItemsByFLIPID();
    this.GetFlipCostsByFLIPID();
    this.setFlipFormValues();
    this.GetFlipAttachmentByDocNumber();
  }
  GetFlipAttachmentByDocNumber(){
    this.isProgressBarVisibile=true;
    this._poFlipService.GetFlipAttachmentByDocNumber(this.selectedFlip.DocNumber,this.selectedFlip.InvoiceAttachmentName).subscribe(
      (data) => {
        if (data) {
          const fileName=this.selectedFlip.InvoiceAttachmentName; 
          const Files=new File([data],fileName);
          this.fileToUpload=Files;
          this.isProgressBarVisibile=false;
        }
      },
      (err)=>{
        // this.notificationSnackBarComponent.openSnackBar(err,SnackBarStatus.danger);
        console.log(err);
        this.isProgressBarVisibile=false;
        this.fileToUpload=null;
      });
  }
  OpenAttachmentDialog(): void {
    const FileName=this.fileToUpload.name;
    let fileType = 'image/jpg';
          fileType = FileName.toLowerCase().includes('.jpg') ? 'image/jpg' :
          FileName.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
          FileName.toLowerCase().includes('.png') ? 'image/png' :
          FileName.toLowerCase().includes('.gif') ? 'image/gif' :
                FileName.toLowerCase().includes('.pdf') ? 'application/pdf' : '';
    const blob=new Blob([this.fileToUpload],{type:fileType});
    const attachmentDetails: AttachmentDetails = {
      FileName: FileName,
      blob: blob
    };
    const dialogConfig: MatDialogConfig = {
      data: attachmentDetails,
      panelClass: 'attachment-dialog'
    };
    const dialogRef = this.dialog.open(AttachmentDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
  GetFlipItemsByFLIPID(): void {
    this._poFlipService.GetFLIPItemsByFLIPID(this.selectedFlip.FLIPID).subscribe(
      (data) => {
        this.selectedFlipView.FLIPItems = data as BPCFLIPItem[];
        this.flipItems=[];
        if (this.selectedFlipView.FLIPItems && this.selectedFlipView.FLIPItems.length) {
          this.selectedFlipView.FLIPItems.forEach(x => {
            this.flipItems.push(x);
          });
          this.flipItemDataSource=new MatTableDataSource<BPCFLIPItem>(this.flipItems);
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
        this.flipCostDataSource = new MatTableDataSource<BPCFLIPCost>(this.flipCosts);
      },
      (err) => {
        console.error(err);
        this.isProgressBarVisibile = false;
      }
    );
  }
  GetPOPartnerID(): void {
    this._factService.GetFactByPartnerID(this.authenticationDetails.UserName).subscribe(
      (data) => { 
        const fact=data as BPCFact;
        this.poHeader = new BPCOFHeader();

        this.poHeader.Client =this.selectedFlip.Client = fact.Client;
        this.poHeader.Type =this.selectedFlip.Type= fact.Type;
        this.poHeader.PatnerID =this.selectedFlip.PatnerID= fact.PatnerID;
        this.poHeader.Company = this.selectedFlip.Company=fact.Company;
        this.selectedDocDate = this.poHeader.DocDate as Date;
        if (this.selectedDocNumber && !this.selectedFlip.FLIPID) {
          // this.GetPOItemsByDocAndPartnerID();
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }
  CreateFlip(): void {
    this.selectedFlipView.CreatedBy = this.authenticationDetails.UserID.toString();
    console.log("selectedFlipView",this.selectedFlipView);

    this.isProgressBarVisibile = true;
    this._poFlipService.CreatePOFLIP(this.selectedFlipView).subscribe(
      (data) => {
        this.selectedFlip.FLIPID = (data as BPCFLIPHeader).FLIPID;
        if (this.selectedFlip.FLIPID) {
          if (this.fileToUploadList && this.fileToUploadList.length) {
            this._poFlipService.AddPOFLIPAttachment(this.selectedFlip.FLIPID, this.authenticationDetails.UserID.toString(), this.fileToUploadList).subscribe(
              (dat) => {
                this.resetControl();
                this.notificationSnackBarComponent.openSnackBar('PO Flip Saved successfully', SnackBarStatus.success);
                this.GetFlipsByPartnerID();
                this.isProgressBarVisibile = false;
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
            // this.getFlipBasedOnCondition();
          }
        }
      },
      (err) => {
        this.showErrorNotificationSnackBar(err);
      }
    );
  }
  CreateUploadInvoice():void{
    this.resetControl();
    this.selectedFlip= new BPCFLIPHeader;
    this.selectedFlipView=new BPCFLIPHeaderView;
    this.GetPOPartnerID();
  }
  UpdateFlip(): void {
    this.selectedFlipView.FLIPID = this.selectedFlip.FLIPID;
    this.selectedFlipView.ModifiedBy = this.authenticationDetails.UserID.toString();
    console.log('UpdateFlip',this.selectedFlipView);
    this.isProgressBarVisibile = true;
    this._poFlipService.UpdatePOFLIP(this.selectedFlipView).subscribe(
      (data) => {
        this.selectedFlip.FLIPID = (data as BPCFLIPHeader).FLIPID;
        if (this.fileToUploadList && this.fileToUploadList.length) {
          this._poFlipService.AddPOFLIPAttachment(this.selectedFlip.FLIPID, this.authenticationDetails.UserID.toString(), this.fileToUploadList).subscribe(
            (dat) => {
              this.resetControl();
              this.notificationSnackBarComponent.openSnackBar('PO Flip Updated successfully', SnackBarStatus.success);
              this.isProgressBarVisibile = false;
              this.GetFlipsByPartnerID();
            },
            (err) => {
              this.showErrorNotificationSnackBar(err);
            }
          );
        }
        else {
          this.resetControl();
          this.notificationSnackBarComponent.openSnackBar('PO Flip Updated successfully', SnackBarStatus.success);
          this.isProgressBarVisibile = false;
          // this.getFlipBasedOnCondition();
        }
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
        this.GetFlipsByPartnerID();
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.isProgressBarVisibile = false;
      }
    );
  }

  GetCountryMasters(): void {
    this._ASNService.GetAllBPCCountryMasters().subscribe(
      (data) => {
        this.countries = data as BPCCountryMaster[];
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetCurrencyMasters(): void {
    this._ASNService.GetAllBPCCurrencyMasters().subscribe(
      (data) => {
        this.currencies = data as BPCCurrencyMaster[];
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetExpenseTypeMasters(): void {
    this._poFlipService.GetExpenseTypeMasters().subscribe(
      (data) => {
        this.expenseTypes = data as BPCExpenseTypeMaster[];
      },
      (err) => {
        console.error(err);
      }
    );
  }
  initialize2ndTableFormGroup(): void {
    this.SecondTableFormGroup = this._formBuilder.group({
      Item: ['', Validators.required],
      MaterialText: ['', Validators.required],
      HSN: ['', Validators.required],
      OrderedQty: ['', [Validators.required,Validators.pattern('^([1-9][0-9]{0,9})')]],
      OpenQty: ['', [Validators.required,Validators.pattern('^([1-9][0-9]{0,9})')]],
      InvoiceQty: ['', [Validators.required,Validators.pattern('^([1-9][0-9]{0,9})')]],
      Price: ['', [Validators.required,Validators.pattern('^([1-9][0-9]{0,9})')]],
      Tax: ['', [Validators.required,Validators.pattern('^([1-9][0-9]{0,9})')]],
      Amount: ['', [Validators.required,Validators.pattern('^([1-9][0-9]{0,9})([.][0-9]{1,2})?$')]],
    });
  }

  initializeFlipFormGroup(): void {
    this.flipFormGroup = this._formBuilder.group({
      DocumentNumber: ['', Validators.required],
      InvoiceNumber: ['', [Validators.minLength(1), Validators.maxLength(16)]],
      InvoiceDate: ['', Validators.required],
      InvoiceAmount: ['', [Validators.pattern('^([1-9][0-9]{0,9})([.][0-9]{1,2})?$')]],
      InvoiceCurrency: ['', Validators.required],
      InvoiceType: ['', Validators.required],
      IsInvoiceOrCertified: ['', Validators.required],
    });
  }

  initializeFlipCostFormGroup(): void {
    this.flipCostFormGroup = this._formBuilder.group({
      ExpenceType: ['', Validators.required],
      Amount: ['', [Validators.pattern('^([1-9][0-9]{0,9})([.][0-9]{1,2})?$')]],
      Remarks: ['', Validators.required],
    });
  }

  // initializeFlipItemFormGroup(): void {
  //   this.flipItemFormGroup = this._formBuilder.group({
  //     flipItems: this.flipItemFormArray
  //   });
  // }

  resetControl(): void {
    this.selectedFlip = new BPCFLIPHeader();
    this.selectedFlipView = new BPCFLIPHeaderView();
    this.selectedFLIPID = '';
    this.clearFlipFormGroup();
    this.fileToUpload = null;
    this.fileToUploadList = [];
    this.clearFlipCostFormGroup();
    this.clearFlipCostDataSource();
    this.clearFlipItemDataSource();

  }
  clearFlipItemDataSource():void{
    this.flipItems=[];
    this.flipItemDataSource=new MatTableDataSource<BPCFLIPItem>(this.flipItems);
  }
  clearFlipFormGroup(): void {
    this.flipFormGroup.reset();
    Object.keys(this.flipFormGroup.controls).forEach(key => {
      this.flipFormGroup.get(key).enable();
      this.flipFormGroup.get(key).markAsUntouched();
    });
  }
  clear2ndTableFormGroup(): void {
    this.SecondTableFormGroup.reset();
    Object.keys(this.SecondTableFormGroup.controls).forEach(key => {
      this.SecondTableFormGroup.get(key).markAsUntouched();
    });
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



  setFlipFormValues(): void {
    this.flipFormGroup.get('DocumentNumber').patchValue(this.selectedFlip.DocNumber);
    this.flipFormGroup.get('InvoiceNumber').patchValue(this.selectedFlip.InvoiceNumber);
    this.flipFormGroup.get('InvoiceDate').patchValue(this.selectedFlip.InvoiceDate);
    this.flipFormGroup.get('InvoiceCurrency').patchValue(this.selectedFlip.InvoiceCurrency);
    this.flipFormGroup.get('InvoiceType').patchValue(this.selectedFlip.InvoiceType);
    this.flipFormGroup.get('IsInvoiceOrCertified').patchValue(this.selectedFlip.IsInvoiceOrCertified);
    this.flipFormGroup.get('InvoiceAmount').patchValue(this.selectedFlip.InvoiceAmount);
  }

  getFlipFormValues(): void {
    this.selectedFlip.DocNumber = this.selectedFlipView.DocNumber = this.flipFormGroup.get('DocumentNumber').value;
    this.selectedFlip.InvoiceNumber = this.selectedFlipView.InvoiceNumber = this.flipFormGroup.get('InvoiceNumber').value;
    this.selectedFlip.InvoiceDate = this.selectedFlipView.InvoiceDate = this.flipFormGroup.get('InvoiceDate').value;
    this.selectedFlip.InvoiceCurrency = this.selectedFlipView.InvoiceCurrency = this.flipFormGroup.get('InvoiceCurrency').value;
    this.selectedFlip.InvoiceAmount = this.selectedFlipView.InvoiceAmount = this.flipFormGroup.get('InvoiceAmount').value;
    this.selectedFlip.InvoiceType = this.selectedFlipView.InvoiceType = this.flipFormGroup.get('InvoiceType').value;
    this.selectedFlip.IsInvoiceOrCertified = this.selectedFlipView.IsInvoiceOrCertified = this.flipFormGroup.get('IsInvoiceOrCertified').value;
    this.getFlipValuesFromPoHeaderOrSelectedFlip();
    if (this.fileToUpload) {
      this.selectedFlip.InvoiceAttachmentName = this.selectedFlipView.InvoiceAttachmentName = this.fileToUpload.name;
      this.fileToUploadList.push(this.fileToUpload);
      this.fileToUpload = null;
    }
  }

  // getFlipItemFormValues(): void {
  //   this.selectedFlipView.FLIPItems = [];
  //   const fLIPItemFormArray = this.flipItemFormGroup.get('flipItems') as FormArray;
  //   fLIPItemFormArray.controls.forEach((x, i) => {
  //     const item: BPCFLIPItem = new BPCFLIPItem();
  //     item.Item = x.get('Item').value;
  //     item.Material = x.get('Material').value;
  //     item.MaterialText = x.get('MaterialText').value;
  //     // item.DeliveryDate = x.get('DeliveryDate').value;
  //     item.HSN = x.get('HSN').value;
  //     item.OrderedQty = x.get('OrderedQty').value;
  //     item.OpenQty = x.get('OpenQty').value;
  //     item.InvoiceQty = x.get('InvoiceQty').value;
  //     item.Price = x.get('Price').value;
  //     item.Tax = x.get('Tax').value;
  //     item.Amount = x.get('Amount').value;
  //     if (this.selectedDocNumber && this.poHeader) {
  //       item.Client = this.poHeader.Client;
  //       item.Company = this.poHeader.Company;
  //       item.Type = this.poHeader.Type;
  //       item.PatnerID = this.poHeader.PatnerID;
  //     } else {
  //       item.Client = this.selectedFlip.Client;
  //       item.Company = this.selectedFlip.Company;
  //       item.Type = this.selectedFlip.Type;
  //       item.PatnerID = this.selectedFlip.PatnerID;
  //     }
  //     this.selectedFlipView.FLIPItems.push(item);
  //   });
  // }

  getFlipCostFormValues(): void {
    this.selectedFlipView.FLIPCosts = [];
    this.flipCosts.forEach(x => {
      x.Client=this.selectedFlip.Client;
      x.Company=this.selectedFlip.Company;
      x.Type=this.selectedFlip.Type;
      x.PatnerID=this.selectedFlip.PatnerID;
      this.selectedFlipView.FLIPCosts.push(x);
    });
  }

  getFlipValuesFromPoHeaderOrSelectedFlip(): void {
    this.selectedFlip.DocNumber = this.selectedFlipView.DocNumber = this.selectedDocNumber ? this.selectedDocNumber : this.selectedFlip.DocNumber;
    if (this.selectedDocNumber && this.poHeader) {
      this.selectedFlip.Client = this.selectedFlipView.Client = this.poHeader.Client;
      this.selectedFlip.Company = this.selectedFlipView.Company = this.poHeader.Company;
      this.selectedFlip.Type = this.selectedFlipView.Type = this.poHeader.Type;
      this.selectedFlip.PatnerID = this.selectedFlipView.PatnerID = this.poHeader.PatnerID;
    } else {
      this.selectedFlip.Client = this.selectedFlipView.Client = this.selectedFlip.Client;
      this.selectedFlip.Company = this.selectedFlipView.Company = this.selectedFlip.Company;
      this.selectedFlip.Type = this.selectedFlipView.Type = this.selectedFlip.Type;
      this.selectedFlip.PatnerID = this.selectedFlipView.PatnerID = this.selectedFlip.PatnerID;
    }
  }

  addFlipCostToTable(): void {
    if (this.flipCostFormGroup.valid) {
      if (this.SelectedFlipCostTableIndex >= 0) {
        this.flipCosts[this.SelectedFlipCostTableIndex].Amount = this.flipCostFormGroup.get('Amount').value;
        this.flipCosts[this.SelectedFlipCostTableIndex].Remarks = this.flipCostFormGroup.get('Remarks').value;

        this.flipCosts[this.SelectedFlipCostTableIndex].ExpenceType = this.flipCostFormGroup.get('ExpenceType').value;
        this.flipCostDataSource = new MatTableDataSource<BPCFLIPCost>(this.flipCosts);
        this.SelectedFlipCostTableIndex = -1;
        this.clearFlipCostFormGroup();
      }
      else {
        const bPCFlipCost = new BPCFLIPCost();
        bPCFlipCost.Amount = this.flipCostFormGroup.get('Amount').value;
        bPCFlipCost.Remarks = this.flipCostFormGroup.get('Remarks').value;
        bPCFlipCost.ExpenceType = this.flipCostFormGroup.get('ExpenceType').value;
        this.flipCosts.push(bPCFlipCost);
        this.flipCostDataSource = new MatTableDataSource<BPCFLIPCost>(this.flipCosts);
        this.clearFlipCostFormGroup();
      }
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
    // this.selectedFlipView.flipItems = [];
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
      const amount = this.convertStringToNumber(openQty) *
        this.convertStringToNumber(price) + this.convertStringToNumber(tax);
      if (openQty && tax && price) {
        x.get('InvoiceQty').patchValue(this.convertStringToNumber(openQty));
        x.get('Amount').patchValue(amount);
      }
      // this.selectedFlipView.flipItems.push(item);
    });
  }

  saveClicked(): void {
    if (this.flipFormGroup.valid) {
      this.getFlipFormValues();
      this.getFlipCostFormValues();
      this.getFlipItemFormValues();
      this.setActionToOpenConfirmation();
    } else {
      this.showValidationErrors(this.flipFormGroup);
    }
  }
  getFlipItemFormValues():void {
    this.selectedFlipView.FLIPItems = [];
    this.flipItems.forEach(x => {
      x.Client=this.selectedFlip.Client;
      x.Company=this.selectedFlip.Company;
      x.Type=this.selectedFlip.Type;
      x.PatnerID=this.selectedFlip.PatnerID;
      this.selectedFlipView.FLIPItems.push(x);
    });
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
      const Catagory = 'Invoice';
      this.openConfirmationDialog(Actiontype, Catagory);
    } else {
      const Actiontype = 'Save';
      const Catagory = 'Invoice';
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

  decimalOnly(event): boolean {
    // this.AmountSelected();
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
    const amount = this.convertStringToNumber(invoiceQty) * this.convertStringToNumber(price) + this.convertStringToNumber(tax);
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
  SetUserPreference(): void {
    this._fuseConfigService.config
      .subscribe((config) => {
        this.fuseConfig = config;
        this.BGClassName = config;
      });
    // this._fuseConfigService.config = this.fuseConfig;
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

  addTo2ndTable(): void {
    if (this.SecondTableFormGroup.valid) {
      if (this.ItemTableSelectedIndex >= 0) {
        const itemIndex = this.flipItems.findIndex(x => x.Item === this.ItemTableSelectedItem.Item && x.MaterialText === this.ItemTableSelectedItem.MaterialText);
        this.flipItems[this.ItemTableSelectedIndex].Item = this.SecondTableFormGroup.get('Item').value;
        this.flipItems[this.ItemTableSelectedIndex].MaterialText = this.SecondTableFormGroup.get('MaterialText').value;
        this.flipItems[this.ItemTableSelectedIndex].HSN = this.SecondTableFormGroup.get('HSN').value;
        this.flipItems[this.ItemTableSelectedIndex].OrderedQty = this.SecondTableFormGroup.get('OrderedQty').value;
        this.flipItems[this.ItemTableSelectedIndex].OpenQty = this.SecondTableFormGroup.get('OpenQty').value;
        this.flipItems[this.ItemTableSelectedIndex].InvoiceQty = this.SecondTableFormGroup.get('InvoiceQty').value;
        this.flipItems[this.ItemTableSelectedIndex].Price = this.SecondTableFormGroup.get('Price').value;
        this.flipItems[this.ItemTableSelectedIndex].Tax = this.SecondTableFormGroup.get('Tax').value;
        this.flipItems[this.ItemTableSelectedIndex].Amount = this.SecondTableFormGroup.get('Amount').value;

        this.flipItemDataSource = new MatTableDataSource<BPCFLIPItem>(this.flipItems);
        this.clear2ndTableFormGroup();
        this.ItemTableSelectedIndex = -1;
      }
      else {
        const items = new BPCFLIPItem();
        items.Item = this.SecondTableFormGroup.get('Item').value;
        items.MaterialText = this.SecondTableFormGroup.get('MaterialText').value;
        items.HSN = this.SecondTableFormGroup.get('HSN').value;
        items.OrderedQty = this.SecondTableFormGroup.get('OrderedQty').value;
        items.OpenQty = this.SecondTableFormGroup.get('OpenQty').value;
        items.InvoiceQty = this.SecondTableFormGroup.get('InvoiceQty').value;
        items.Price = this.SecondTableFormGroup.get('Price').value;
        items.Tax = this.SecondTableFormGroup.get('Tax').value;
        items.Amount = this.SecondTableFormGroup.get('Amount').value;
        this.flipItems.push(items);
        this.flipItemDataSource = new MatTableDataSource<BPCFLIPItem>(this.flipItems);
        this.clear2ndTableFormGroup();
      }
    }
    else {
      this.showValidationErrors(this.SecondTableFormGroup);
    }
  }
  ItemTableClicked(index: any, row: BPCFLIPItem): void {
    this.ItemTableSelectedIndex = index;
    this.ItemTableSelectedItem = row;
    this.SecondTableFormGroup.get('Item').patchValue(this.ItemTableSelectedItem.Item);
    this.SecondTableFormGroup.get('MaterialText').patchValue(this.ItemTableSelectedItem.MaterialText);
    this.SecondTableFormGroup.get('HSN').patchValue(this.ItemTableSelectedItem.HSN);
    this.SecondTableFormGroup.get('OrderedQty').patchValue(this.ItemTableSelectedItem.OrderedQty);
    this.SecondTableFormGroup.get('OpenQty').patchValue(this.ItemTableSelectedItem.OpenQty);
    this.SecondTableFormGroup.get('InvoiceQty').patchValue(this.ItemTableSelectedItem.InvoiceQty);
    this.SecondTableFormGroup.get('Price').patchValue(this.ItemTableSelectedItem.Price);
    this.SecondTableFormGroup.get('Tax').patchValue(this.ItemTableSelectedItem.Tax);
    this.SecondTableFormGroup.get('Amount').patchValue(this.ItemTableSelectedItem.Amount);
  }
  SelectFlipCostTable(index: any, row: BPCFLIPCost): void {
    this.SelectedFlipCostTableIndex = index;
    this.SelectFlipCostTableRow = row;
    this.flipCostFormGroup.get('Amount').patchValue(this.SelectFlipCostTableRow.Amount);
    this.flipCostFormGroup.get('Remarks').patchValue(this.SelectFlipCostTableRow.Remarks);
    this.flipCostFormGroup.get('ExpenceType').patchValue(this.SelectFlipCostTableRow.ExpenceType);

  }
  
}