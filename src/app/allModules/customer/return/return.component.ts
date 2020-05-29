import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationDetails, UserWithRole } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { BPCRetHeader, BPCRetView, BPCPIItem } from 'app/models/customer';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { BPCOFHeader, BPCOFItem } from 'app/models/OrderFulFilment';
import { BehaviorSubject } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { BPCInvoiceAttachment, DocumentCenter, BPCCountryMaster, BPCCurrencyMaster, BPCDocumentCenterMaster } from 'app/models/ASN';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { MasterService } from 'app/services/master.service';
import { FactService } from 'app/services/fact.service';
import { POService } from 'app/services/po.service';
import { CustomerService } from 'app/services/customer.service';
import { ASNService } from 'app/services/asn.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { AttachmentDetails } from 'app/models/task';
import { AttachmentDialogComponent } from 'app/allModules/pages/attachment-dialog/attachment-dialog.component';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss']
})
export class ReturnComponent implements OnInit {

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  AllReturnHeaders: BPCRetHeader[] = [];
  ReturnFormGroup: FormGroup;
  ReturnItemFormGroup: FormGroup;
  InvoiceDetailsFormGroup: FormGroup;
  DocumentCenterFormGroup: FormGroup;
  AllUserWithRoles: UserWithRole[] = [];
  SelectedDocNumber: string;
  PO: BPCOFHeader;
  POItems: BPCOFItem[] = [];
  SelectedReturnHeader: BPCRetHeader;
  SelectedReturnNumber: string;
  SelectedReturnView: BPCRetView;
  ReturnItems: BPCPIItem[] = [];
  ReturnItemDisplayedColumns: string[] = [
    'Item',
    'Material',
    'MaterialText',
    'DeliveryDate',
    'OrderedQty',
    'GRQty',
    'PipelineQty',
    'OpenQty',
    'ReturnQty',
    'Batch',
    'ManufactureDate',
    'ExpiryDate'
  ];
  ReturnItemFormArray: FormArray = this._formBuilder.array([]);
  ReturnItemDataSource = new BehaviorSubject<AbstractControl[]>([]);
  @ViewChild(MatPaginator) ReturnItemPaginator: MatPaginator;
  @ViewChild(MatSort) ReturnItemSort: MatSort;
  invoiceAttachment: File;
  invAttach: BPCInvoiceAttachment;
  fileToUpload: File;
  fileToUploadList: File[] = [];
  math = Math;
  minDate: Date;
  maxDate: Date;
  AllDocumentCenters: DocumentCenter[] = [];
  DocumentCenterDisplayedColumns: string[] = [
    'DocumentType',
    'DocumentTitle',
    'Filename',
    'Action'
  ];
  DocumentCenterDataSource: MatTableDataSource<DocumentCenter>;
  @ViewChild(MatPaginator) DocumentCenterPaginator: MatPaginator;
  @ViewChild(MatSort) DocumentCenterSort: MatSort;

  selection = new SelectionModel<any>(true, []);
  searchText = '';

  AllCountries: BPCCountryMaster[] = [];
  AllCurrencies: BPCCurrencyMaster[] = [];
  AllDocumentCenterMaster: BPCDocumentCenterMaster[] = [];
  isWeightError: boolean;
  @ViewChild('fileInput1') fileInput: ElementRef<HTMLElement>;
  selectedDocCenterMaster: BPCDocumentCenterMaster;
  ArrivalDateInterval: number;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _masterService: MasterService,
    private _FactService: FactService,
    private _POService: POService,
    private _CustomerService: CustomerService,
    private _ASNService: ASNService,
    private _datePipe: DatePipe,
    private _route: ActivatedRoute,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
    this.PO = new BPCOFHeader();
    this.SelectedReturnHeader = new BPCRetHeader();
    this.SelectedReturnView = new BPCRetView();
    this.SelectedReturnNumber = '';
    this.invAttach = new BPCInvoiceAttachment();
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.maxDate = new Date();
    this.isWeightError = false;
    this.selectedDocCenterMaster = new BPCDocumentCenterMaster();
    this.ArrivalDateInterval = 1;
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
      // if (this.MenuItems.indexOf('Return') < 0) {
      //     this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
      //     );
      //     this._router.navigate(['/auth/login']);
      // }

    } else {
      this._router.navigate(['/auth/login']);
    }
    this._route.queryParams.subscribe(params => {
      this.SelectedDocNumber = params['id'];
    });
    this.InitializeReturnFormGroup();
    this.InitializeReturnItemFormGroup();
    this.InitializeInvoiceDetailsFormGroup();
    this.InitializeDocumentCenterFormGroup();
    this.GetAllBPCCountryMasters();
    this.GetAllBPCCurrencyMasters();
    this.GetAllDocumentCenterMaster();
    // this.GetReturnBasedOnCondition();
  }

  InitializeReturnFormGroup(): void {
    this.ReturnFormGroup = this._formBuilder.group({
      Text: ['', Validators.required],
      Date: [new Date(), Validators.required],
      InvoiceDoc: ['', Validators.required],
      // NetAmount: ['', [Validators.required, Validators.pattern('^([0-9]*[1-9][0-9]*(\\.[0-9]+)?|[0]*\\.[0-9]*[1-9][0-9]*)$')]],
      // GrossAmount: ['', [Validators.required, Validators.pattern('^([0-9]*[1-9][0-9]*(\\.[0-9]+)?|[0]*\\.[0-9]*[1-9][0-9]*)$')]],
    });
  }
  // SetInitialValueForReturnFormGroup(): void {
  //     this.ReturnFormGroup.get('Date').patchValue('Road');
  //     this.ReturnFormGroup.get('AWBDate').patchValue(new Date());
  //     this.ReturnFormGroup.get('NetWeightUOM').patchValue('KG');
  //     this.ReturnFormGroup.get('GrossWeightUOM').patchValue('KG');
  //     this.ReturnFormGroup.get('DepartureDate').patchValue(new Date());
  //     this.ReturnFormGroup.get('ArrivalDate').patchValue(this.minDate);
  //     this.ReturnFormGroup.get('CountryOfOrigin').patchValue('IND');
  // }
  InitializeReturnItemFormGroup(): void {
    this.ReturnItemFormGroup = this._formBuilder.group({
      ReturnItems: this.ReturnItemFormArray
    });
  }
  InitializeInvoiceDetailsFormGroup(): void {
    this.InvoiceDetailsFormGroup = this._formBuilder.group({
      InvoiceNumber: ['', [Validators.minLength(16), Validators.maxLength(16), Validators.pattern('^[1-9][0-9]*$')]],
      InvoiceAmount: ['', [Validators.pattern('^([1-9][0-9]*)([.][0-9]{1,2})?$')]],
      InvoiceAmountUOM: [''],
      InvoiceDate: [''],
      InvoiceAttachment: [''],
    });
  }

  InitializeDocumentCenterFormGroup(): void {
    this.DocumentCenterFormGroup = this._formBuilder.group({
      DocumentType: ['', Validators.required],
      DocumentTitle: ['', Validators.required],
      Filename: [''],
    });
  }

  ResetControl(): void {
    this.SelectedReturnHeader = new BPCRetHeader();
    this.SelectedReturnView = new BPCRetView();
    this.SelectedReturnNumber = '';
    this.ResetReturnFormGroup();
    // this.SetInitialValueForReturnFormGroup();
    this.ResetInvoiceDetailsFormGroup();
    this.ResetDocumentCenterFormGroup();
    this.ResetAttachments();
    this.AllDocumentCenters = [];
    this.DocumentCenterDataSource = new MatTableDataSource(this.AllDocumentCenters);
    this.isWeightError = false;
    this.selectedDocCenterMaster = new BPCDocumentCenterMaster();
  }

  ResetReturnFormGroup(): void {
    this.ResetFormGroup(this.ReturnFormGroup);
  }
  ResetInvoiceDetailsFormGroup(): void {
    this.ResetFormGroup(this.InvoiceDetailsFormGroup);
  }
  ResetDocumentCenterFormGroup(): void {
    this.ResetFormGroup(this.DocumentCenterFormGroup);
  }

  ResetFormGroup(formGroup: FormGroup): void {
    formGroup.reset();
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).enable();
      formGroup.get(key).markAsUntouched();
    });
  }
  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  ResetAttachments(): void {
    this.fileToUpload = null;
    this.fileToUploadList = [];
    this.invoiceAttachment = null;
  }

  // GetReturnBasedOnCondition(): void {
  //   if (this.SelectedDocNumber) {
  //     this.GetReturnByDocAndPartnerID();
  //     this.GetPOByDocAndPartnerID(this.SelectedDocNumber);
  //     this.GetPOItemsByDocAndPartnerID();
  //     this.GetArrivalDateIntervalByPOAndPartnerID();
  //   } else {
  //     this.GetAllReturnByPartnerID();
  //   }
  // }

  DateSelected(event): void {
    const selectedType = event.value;
    if (event.value) {
      // this.SelectedTask.Type = event.value;
    }
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
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 8 || charCode === 9 || charCode === 13 || charCode === 46
      || charCode === 37 || charCode === 39 || charCode === 123) {
      return true;
    }
    else if (charCode < 48 || charCode > 57) {
      return false;
    }
    return true;
  }

  handleFileInput1(evt): void {
    if (evt.target.files && evt.target.files.length > 0) {
      if (this.invoiceAttachment && this.invoiceAttachment.name) {
        this.notificationSnackBarComponent.openSnackBar('Maximum one attachment is allowed, old is attachment is replaced', SnackBarStatus.warning);
      }
      if (this.invAttach && this.invAttach.AttachmentName) {
        this.notificationSnackBarComponent.openSnackBar('Maximum one attachment is allowed, old is attachment is replaced', SnackBarStatus.warning);
      }
      this.invoiceAttachment = evt.target.files[0];
      this.invAttach = new BPCInvoiceAttachment();
    }
  }
  handleFileInput(evt): void {
    if (evt.target.files && evt.target.files.length > 0) {
      const fil = evt.target.files[0] as File;
      if (fil.type.includes(this.selectedDocCenterMaster.Extension)) {
        const fileSize = this.math.round(fil.size / 1024);
        if (fileSize <= this.selectedDocCenterMaster.SizeInKB) {
          this.fileToUpload = fil;
          // this.fileToUploadList.push(this.fileToUpload);
          this.DocumentCenterFormGroup.get('Filename').patchValue(this.fileToUpload.name);
        } else {
          this.notificationSnackBarComponent.openSnackBar(`Maximum allowed file size is ${this.selectedDocCenterMaster.SizeInKB} KB only`, SnackBarStatus.danger);
        }
      } else {
        this.notificationSnackBarComponent.openSnackBar(`Please select only ${this.selectedDocCenterMaster.Extension} file`, SnackBarStatus.danger);
      }
    }
  }

  DocumentTypeSelected(event): void {
    if (event.value) {
      this.selectedDocCenterMaster = this.AllDocumentCenterMaster.filter(x => x.DocumentType === event.value)[0];
      if (this.selectedDocCenterMaster) {
        if (this.selectedDocCenterMaster.Mandatory) {
          this.AddDocumentCenterFileValidator();
        } else {
          this.RemoveDocumentCenterFileValidator();
        }
      }
    }
  }

  AddDocumentCenterFileValidator(): void {
    this.DocumentCenterFormGroup.get('Filename').setValidators(Validators.required);
    this.DocumentCenterFormGroup.get('Filename').updateValueAndValidity();
  }
  RemoveDocumentCenterFileValidator(): void {
    this.DocumentCenterFormGroup.get('Filename').clearValidators();
    this.DocumentCenterFormGroup.get('Filename').updateValueAndValidity();
  }

  // AddDocCenterAttClicked(): void {
  //     const DocumentTypeVal = this.DocumentCenterFormGroup.get('DocumentType').value;
  //     if (DocumentTypeVal) {
  //         // const el: HTMLElement = this.fileInput.nativeElement;
  //         // el.click();
  //         const event = new MouseEvent('click', {bubbles: false});
  //         this.fileInput.nativeElement.dispatchEvent(event);
  //     } else {
  //         this.notificationSnackBarComponent.openSnackBar('Please selected Document type', SnackBarStatus.danger);
  //     }
  // }

  AddDocumentCenterToTable(): void {
    if (this.DocumentCenterFormGroup.valid) {
      const documentCenter = new DocumentCenter();
      documentCenter.DocumentType = this.DocumentCenterFormGroup.get('DocumentType').value;
      documentCenter.DocumentTitle = this.DocumentCenterFormGroup.get('DocumentTitle').value;
      if (this.fileToUpload) {
        documentCenter.Filename = this.fileToUpload.name;
        this.fileToUploadList.push(this.fileToUpload);
        this.fileToUpload = null;
      }
      if (!this.AllDocumentCenters || !this.AllDocumentCenters.length) {
        this.AllDocumentCenters = [];
      }
      this.AllDocumentCenters.push(documentCenter);
      this.DocumentCenterDataSource = new MatTableDataSource(this.AllDocumentCenters);
      this.ResetDocumentCenterFormGroup();
      this.selectedDocCenterMaster = new BPCDocumentCenterMaster();
    } else {
      this.ShowValidationErrors(this.DocumentCenterFormGroup);
    }
  }

  RemoveDocumentCenterFromTable(doc: DocumentCenter): void {
    const index: number = this.AllDocumentCenters.indexOf(doc);
    if (index > -1) {
      this.AllDocumentCenters.splice(index, 1);
      const indexx = this.fileToUploadList.findIndex(x => x.name === doc.Filename);
      if (indexx > -1) {
        this.fileToUploadList.splice(indexx, 1);
      }
    }
    this.DocumentCenterDataSource = new MatTableDataSource(this.AllDocumentCenters);
  }

  GetAllBPCCountryMasters(): void {
    this._ASNService.GetAllBPCCountryMasters().subscribe(
      (data) => {
        this.AllCountries = data as BPCCountryMaster[];
      },
      (err) => {
        console.error(err);
      }
    );
  }
  GetAllDocumentCenterMaster(): void {
    this._ASNService.GetAllDocumentCenterMaster().subscribe(
      (data) => {
        this.AllDocumentCenterMaster = data as BPCDocumentCenterMaster[];
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetAllBPCCurrencyMasters(): void {
    this._ASNService.GetAllBPCCurrencyMasters().subscribe(
      (data) => {
        this.AllCurrencies = data as BPCCurrencyMaster[];
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetAllReturnByPartnerID(): void {
    this._CustomerService.GetAllReturnsByPartnerID(this.currentUserName).subscribe(
      (data) => {
        this.AllReturnHeaders = data as BPCRetHeader[];
        if (this.AllReturnHeaders && this.AllReturnHeaders.length) {
          this.LoadSelectedReturn(this.AllReturnHeaders[0]);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // GetReturnByDocAndPartnerID(): void {
  //   this._CustomerService.GetReturnByDocAndPartnerID(this.SelectedDocNumber, this.currentUserName).subscribe(
  //     (data) => {
  //       this.AllReturnHeaders = data as BPCRetHeader[];
  //     },
  //     (err) => {
  //       console.error(err);
  //     }
  //   );
  // }
  GetPOByDocAndPartnerID(selectedDocNumber: string): void {
    this._POService.GetPOByDocAndPartnerID(selectedDocNumber, this.currentUserName).subscribe(
      (data) => {
        this.PO = data as BPCOFHeader;
        if (this.SelectedDocNumber) {
          this.InvoiceDetailsFormGroup.get('InvoiceAmountUOM').patchValue(this.PO.Currency);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetPOItemsByDocAndPartnerID(): void {
    this._POService.GetPOItemsByDocAndPartnerID(this.SelectedDocNumber, this.currentUserName).subscribe(
      (data) => {
        this.POItems = data as BPCOFItem[];
        this.ClearFormArray(this.ReturnItemFormArray);
        if (this.POItems && this.POItems.length) {
          this.SelectedReturnHeader.Client = this.SelectedReturnView.Client = this.POItems[0].Client;
          this.SelectedReturnHeader.Company = this.SelectedReturnView.Company = this.POItems[0].Company;
          this.SelectedReturnHeader.Type = this.SelectedReturnView.Type = this.POItems[0].Type;
          this.SelectedReturnHeader.PatnerID = this.SelectedReturnView.PatnerID = this.POItems[0].PatnerID;
          // this.SelectedReturnHeader.RetReqID = this.SelectedReturnView.RetReqID = this.POItems[0].RetReqID;
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

  

  LoadSelectedReturn(seletedReturn: BPCRetHeader): void {
    this.SelectedReturnHeader = seletedReturn;
    this.SelectedReturnView.RetReqID = this.SelectedReturnHeader.RetReqID;
    this.SelectedReturnNumber = this.SelectedReturnHeader.RetReqID;
    // this.GetPOByDocAndPartnerID(this.SelectedReturnHeader.DocNumber);
    // this.GetReturnItemsByReturn();
    // this.GetDocumentCentersByReturn();
    // this.GetInvoiceAttachmentByReturn();
    this.SetReturnHeaderValues();
    // this.SetInvoiceDetailValues();
  }

  // GetReturnItemsByReturn(): void {
  //   this._CustomerService.GetReturnItemsByReturn(this.SelectedReturnHeader.ReturnNumber).subscribe(
  //     (data) => {
  //       this.SelectedReturnView.ReturnItems = data as BBPCPIItem[];
  //       this.ClearFormArray(this.ReturnItemFormArray);
  //       if (this.SelectedReturnView.ReturnItems && this.SelectedReturnView.ReturnItems.length) {
  //         this.SelectedReturnView.ReturnItems.forEach(x => {
  //           this.InsertReturnItemsFormGroup(x);
  //         });
  //       }
  //     },
  //     (err) => {
  //       console.error(err);
  //     }
  //   );
  // }

  // GetDocumentCentersByReturn(): void {
  //   this._CustomerService.GetDocumentCentersByReturn(this.SelectedReturnHeader.ReturnNumber).subscribe(
  //     (data) => {
  //       this.AllDocumentCenters = data as DocumentCenter[];
  //       this.DocumentCenterDataSource = new MatTableDataSource(this.AllDocumentCenters);
  //     },
  //     (err) => {
  //       console.error(err);
  //     }
  //   );
  // }
  // GetInvoiceAttachmentByReturn(): void {
  //   this._CustomerService.GetInvoiceAttachmentByReturn(this.SelectedReturnHeader.ReturnNumber, this.SelectedReturnHeader.InvDocReferenceNo).subscribe(
  //     (data) => {
  //       this.invAttach = data as BPCInvoiceAttachment;
  //     },
  //     (err) => {
  //       console.error(err);
  //     }
  //   );
  // }

  SetReturnHeaderValues(): void {
    this.ReturnFormGroup.get('Text').patchValue(this.SelectedReturnHeader.Text);
    this.ReturnFormGroup.get('Date').patchValue(this.SelectedReturnHeader.Date);
    this.ReturnFormGroup.get('InvoiceDoc').patchValue(this.SelectedReturnHeader.InvoiceDoc);
    // this.ReturnFormGroup.get('GrossAmount').patchValue(this.SelectedReturnHeader.GrossAmount);
    // this.ReturnFormGroup.get('NetAmount').patchValue(this.SelectedReturnHeader.NetAmount);

  }

  InsertPOItemsFormGroup(poItem: BPCOFItem): void {
    const row = this._formBuilder.group({
      Item: [poItem.Item],
      Material: [poItem.Material],
      MaterialText: [poItem.MaterialText],
      DeliveryDate: [poItem.DeliveryDate],
      OrderedQty: [poItem.OrderedQty],
      GRQty: [poItem.CompletedQty],
      PipelineQty: [poItem.TransitQty],
      OpenQty: [poItem.OpenQty],
      ReturnQty: [poItem.OpenQty, [Validators.required, Validators.pattern('^([1-9][0-9]*)([.][0-9]{1,3})?$')]],
      UOM: [poItem.UOM],
      Batch: [''],
      ManufactureDate: [''],
      ExpiryDate: [''],
    });
    row.disable();
    row.get('ReturnQty').enable();
    row.get('Batch').enable();
    row.get('ManufactureDate').enable();
    row.get('ExpiryDate').enable();
    this.ReturnItemFormArray.push(row);
    this.ReturnItemDataSource.next(this.ReturnItemFormArray.controls);
    // return row;
  }

  // InsertReturnItemsFormGroup(ReturnItem: BBPCPIItem): void {
  //   const row = this._formBuilder.group({
  //     Item: [ReturnItem.Item],
  //     Material: [ReturnItem.Material],
  //     MaterialText: [ReturnItem.MaterialText],
  //     DeliveryDate: [ReturnItem.DeliveryDate],
  //     OrderedQty: [ReturnItem.OrderedQty],
  //     GRQty: [ReturnItem.CompletedQty],
  //     PipelineQty: [ReturnItem.TransitQty],
  //     OpenQty: [ReturnItem.OpenQty],
  //     ReturnQty: [ReturnItem.ReturnQty, [Validators.required, Validators.pattern('^([1-9][0-9]*)([.][0-9]{1,3})?$')]],
  //     UOM: [ReturnItem.UOM],
  //     Batch: [ReturnItem.Batch],
  //     ManufactureDate: [ReturnItem.ManufactureDate],
  //     ExpiryDate: [ReturnItem.ExpiryDate],
  //   });
  //   row.disable();
  //   row.get('ReturnQty').enable();
  //   row.get('Batch').enable();
  //   row.get('ManufactureDate').enable();
  //   row.get('ExpiryDate').enable();
  //   this.ReturnItemFormArray.push(row);
  //   this.ReturnItemDataSource.next(this.ReturnItemFormArray.controls);
  //   // return row;
  // }

  // SetInvoiceDetailValues(): void {
  //   this.InvoiceDetailsFormGroup.get('InvoiceNumber').patchValue(this.SelectedReturnHeader.InvoiceNumber);
  //   this.InvoiceDetailsFormGroup.get('InvoiceDate').patchValue(this.SelectedReturnHeader.InvoiceDate);
  //   this.InvoiceDetailsFormGroup.get('InvoiceAmount').patchValue(this.SelectedReturnHeader.InvoiceAmount);
  //   this.InvoiceDetailsFormGroup.get('InvoiceAmountUOM').patchValue(this.SelectedReturnHeader.InvoiceAmountUOM);
  // }

  GetReturnValues(): void {
    this.SelectedReturnHeader.Text = this.SelectedReturnView.Text = this.ReturnFormGroup.get('Text').value;
    const depDate = this.ReturnFormGroup.get('Date').value;
    if (depDate) {
      this.SelectedReturnHeader.Date = this.SelectedReturnView.Date = this._datePipe.transform(depDate, 'yyyy-MM-dd HH:mm:ss');
    } else {
      this.SelectedReturnHeader.Date = this.SelectedReturnView.Date = this.ReturnFormGroup.get('Date').value;
    }
    this.SelectedReturnHeader.InvoiceDoc = this.SelectedReturnView.InvoiceDoc = this.ReturnFormGroup.get('InvoiceDoc').value;
    if (this.SelectedDocNumber && this.PO) {
      this.SelectedReturnHeader.Client = this.SelectedReturnView.Client = this.PO.Client;
      this.SelectedReturnHeader.Company = this.SelectedReturnView.Company = this.PO.Company;
      this.SelectedReturnHeader.Type = this.SelectedReturnView.Type = this.PO.Type;
      this.SelectedReturnHeader.PatnerID = this.SelectedReturnView.PatnerID = this.PO.PatnerID;
    } else {
      this.SelectedReturnHeader.Client = this.SelectedReturnView.Client = this.SelectedReturnHeader.Client;
      this.SelectedReturnHeader.Company = this.SelectedReturnView.Company = this.SelectedReturnHeader.Company;
      this.SelectedReturnHeader.Type = this.SelectedReturnView.Type = this.SelectedReturnHeader.Type;
      this.SelectedReturnHeader.PatnerID = this.SelectedReturnView.PatnerID = this.SelectedReturnHeader.PatnerID;
    }
  }

  calculateDiff(sentDate): number {
    const dateSent: Date = new Date(sentDate);
    const currentDate: Date = new Date();
    return Math.floor((Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) -
      Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24));
  }

  // GetReturnItemValues(): void {
  //   this.SelectedReturnView.ReturnItems = [];
  //   const ReturnItemFormArray = this.ReturnItemFormGroup.get('ReturnItems') as FormArray;
  //   ReturnItemFormArray.controls.forEach((x, i) => {
  //     const item: BBPCPIItem = new BBPCPIItem();
  //     item.Item = x.get('Item').value;
  //     item.Material = x.get('Material').value;
  //     item.MaterialText = x.get('MaterialText').value;
  //     item.DeliveryDate = x.get('DeliveryDate').value;
  //     item.OrderedQty = x.get('OrderedQty').value;
  //     item.UOM = x.get('UOM').value;
  //     item.CompletedQty = x.get('GRQty').value;
  //     item.TransitQty = x.get('PipelineQty').value;
  //     item.OpenQty = x.get('OpenQty').value;
  //     item.ReturnQty = x.get('ReturnQty').value;
  //     item.Batch = x.get('Batch').value;
  //     const manufDate = x.get('ManufactureDate').value;
  //     if (manufDate) {
  //       item.ManufactureDate = this._datePipe.transform(manufDate, 'yyyy-MM-dd HH:mm:ss');
  //     } else {
  //       item.ManufactureDate = x.get('ManufactureDate').value;
  //     }
  //     const expDate = x.get('ExpiryDate').value;
  //     if (expDate) {
  //       item.ExpiryDate = this._datePipe.transform(expDate, 'yyyy-MM-dd HH:mm:ss');
  //     } else {
  //       item.ExpiryDate = x.get('ExpiryDate').value;
  //     }
  //     if (this.SelectedDocNumber && this.PO) {
  //       item.Client = this.PO.Client;
  //       item.Company = this.PO.Company;
  //       item.Type = this.PO.Type;
  //       item.PatnerID = this.PO.PatnerID;
  //     } else {
  //       item.Client = this.SelectedReturnHeader.Client;
  //       item.Company = this.SelectedReturnHeader.Company;
  //       item.Type = this.SelectedReturnHeader.Type;
  //       item.PatnerID = this.SelectedReturnHeader.PatnerID;
  //     }
  //     this.SelectedReturnView.ReturnItems.push(item);
  //   });
  // }

  // GetInvoiceDetailValues(): void {
  //   this.SelectedReturnHeader.RetReqID = this.SelectedReturnView.RetReqID = this.InvoiceDetailsFormGroup.get('RetReqID').value;
  //   const invDate = this.InvoiceDetailsFormGroup.get('InvoiceDate').value;
  //   if (invDate) {
  //     this.SelectedReturnHeader.InvoiceDate = this.SelectedReturnView.InvoiceDate = this._datePipe.transform(invDate, 'yyyy-MM-dd HH:mm:ss');
  //   } else {
  //     this.SelectedReturnHeader.InvoiceDate = this.SelectedReturnView.InvoiceDate = this.InvoiceDetailsFormGroup.get('InvoiceDate').value;
  //   }
  //   this.SelectedReturnHeader.InvoiceAmountUOM = this.SelectedReturnView.InvoiceAmountUOM = this.InvoiceDetailsFormGroup.get('InvoiceAmountUOM').value;
  //   this.SelectedReturnHeader.InvoiceAmount = this.SelectedReturnView.InvoiceAmount = this.InvoiceDetailsFormGroup.get('InvoiceAmount').value;
  // }

  // GetDocumentCenterValues(): void {
  //   this.SelectedReturnView.DocumentCenters = [];
  //   // this.SelectedBPVendorOnBoardingView.BPBanks.push(...this.BanksByVOB);
  //   this.AllDocumentCenters.forEach(x => {
  //     this.SelectedReturnView.DocumentCenters.push(x);
  //   });
  // }

  SaveClicked(): void {
    if (this.ReturnFormGroup.valid) {
      if (!this.isWeightError) {
        if (this.ReturnItemFormGroup.valid) {
          if (this.InvoiceDetailsFormGroup.valid) {
            this.GetReturnValues();
            // this.GetReturnItemValues();
            // this.GetInvoiceDetailValues();
            // this.GetDocumentCenterValues();
            // this.SelectedReturnView.IsSubmitted = false;
            this.SetActionToOpenConfirmation('Save');
          } else {
            this.ShowValidationErrors(this.InvoiceDetailsFormGroup);
          }

        } else {
          this.ShowValidationErrors(this.ReturnItemFormGroup);
        }
      }

    } else {
      this.ShowValidationErrors(this.ReturnFormGroup);
    }
  }
  SubmitClicked(): void {
    if (this.ReturnFormGroup.valid) {
      if (!this.isWeightError) {
        if (this.ReturnItemFormGroup.valid) {
          if (this.InvoiceDetailsFormGroup.valid) {
            this.GetReturnValues();
            // this.GetReturnItemValues();
            // this.GetInvoiceDetailValues();
            // this.GetDocumentCenterValues();
            // this.SelectedReturnView.IsSubmitted = true;
            this.SetActionToOpenConfirmation('Submit');
          } else {
            this.ShowValidationErrors(this.InvoiceDetailsFormGroup);
          }

        } else {
          this.ShowValidationErrors(this.ReturnItemFormGroup);
        }
      }

    } else {
      this.ShowValidationErrors(this.ReturnFormGroup);
    }
  }
  DeleteClicked(): void {
    if (this.SelectedReturnHeader.RetReqID) {
      const Actiontype = 'Delete';
      const Catagory = 'Return';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    }
  }
  SetActionToOpenConfirmation(Actiontype: string): void {
    // if (this.SelectedReturnHeader.ReturnNumber) {
    //     const Catagory = 'Return';
    //     this.OpenConfirmationDialog(Actiontype, Catagory);
    // } else {
    //     const Catagory = 'Return';
    //     this.OpenConfirmationDialog(Actiontype, Catagory);
    // }
    const Catagory = 'Return';
    this.OpenConfirmationDialog(Actiontype, Catagory);
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
          if (Actiontype === 'Save' || Actiontype === 'Submit') {
            if (this.SelectedReturnHeader.RetReqID) {
              this.UpdateReturn(Actiontype);
            } else {
              this.CreateReturn(Actiontype);
            }
          } else if (Actiontype === 'Delete') {
            this.DeleteReturn();
          }
        }
      });
  }


  CreateReturn(Actiontype: string): void {
    // this.GetReturnValues();
    // this.GetBPReturnSubItemValues();
    // this.SelectedReturnView.CreatedBy = this.authenticationDetails.UserID.toString();
    this.IsProgressBarVisibile = true;
    this._CustomerService.CreateReturn(this.SelectedReturnView).subscribe(
      (data) => {
        this.SelectedReturnHeader.RetReqID = (data as BPCRetHeader).RetReqID;
        // if (this.invoiceAttachment) {
        //   this.AddInvoiceAttachment(Actiontype);
        // } else {
        //   if (this.fileToUploadList && this.fileToUploadList.length) {
        //     this.AddDocumentCenterAttachment(Actiontype);
        //   } else {
        //     this.ResetControl();
        //     this.notificationSnackBarComponent.openSnackBar(`Return ${Actiontype === 'Submit' ? 'submitted' : 'saved'} successfully`, SnackBarStatus.success);
        //     this.IsProgressBarVisibile = false;
        //     this.GetReturnBasedOnCondition();
        //   }
        // }
      },
      (err) => {
        this.showErrorNotificationSnackBar(err);
      }
    );
  }

  // AddInvoiceAttachment(Actiontype: string): void {
  //   this._CustomerService.AddInvoiceAttachment(this.SelectedReturnHeader.ReturnNumber, this.currentUserID.toString(), this.invoiceAttachment).subscribe(
  //     (dat) => {
  //       if (this.fileToUploadList && this.fileToUploadList.length) {
  //         this.AddDocumentCenterAttachment(Actiontype);
  //       } else {
  //         this.ResetControl();
  //         this.notificationSnackBarComponent.openSnackBar(`Return ${Actiontype === 'Submit' ? 'submitted' : 'saved'} successfully`, SnackBarStatus.success);
  //         this.IsProgressBarVisibile = false;
  //         this.GetReturnBasedOnCondition();
  //       }
  //     },
  //     (err) => {
  //       this.showErrorNotificationSnackBar(err);
  //     });
  // }
  // AddDocumentCenterAttachment(Actiontype: string): void {
  //   this._CustomerService.AddDocumentCenterAttachment(this.SelectedReturnHeader.ReturnNumber, this.currentUserID.toString(), this.fileToUploadList).subscribe(
  //     (dat) => {
  //       this.ResetControl();
  //       this.notificationSnackBarComponent.openSnackBar(`Return ${Actiontype === 'Submit' ? 'submitted' : 'saved'} successfully`, SnackBarStatus.success);
  //       this.IsProgressBarVisibile = false;
  //       this.GetReturnBasedOnCondition();
  //     },
  //     (err) => {
  //       this.showErrorNotificationSnackBar(err);
  //     }
  //   );
  // }

  showErrorNotificationSnackBar(err: any): void {
    console.error(err);
    this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
    this.IsProgressBarVisibile = false;
  }

  UpdateReturn(Actiontype: string): void {
    // this.GetReturnValues();
    // this.GetBPReturnSubItemValues();
    // this.SelectedBPReturnView.TransID = this.SelectedBPReturn.TransID;
    // this.SelectedReturnView.ModifiedBy = this.authenticationDetails.UserID.toString();
    this.IsProgressBarVisibile = true;
    this._CustomerService.UpdateReturn(this.SelectedReturnView).subscribe(
      (data) => {
        this.SelectedReturnHeader.RetReqID = (data as BPCRetHeader).RetReqID;
        // if (this.invoiceAttachment) {
        //   this.AddInvoiceAttachment(Actiontype);
        // } else {
        //   if (this.fileToUploadList && this.fileToUploadList.length) {
        //     this.AddDocumentCenterAttachment(Actiontype);
        //   } else {
        //     this.ResetControl();
        //     this.notificationSnackBarComponent.openSnackBar(`Return ${Actiontype === 'Submit' ? 'submitted' : 'saved'} successfully`, SnackBarStatus.success);
        //     this.IsProgressBarVisibile = false;
        //     this.GetReturnBasedOnCondition();
        //   }
        // }
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  DeleteReturn(): void {
    this.GetReturnValues();
    // this.SelectedBPReturn.ModifiedBy = this.authenticationDetails.userID.toString();
    this.IsProgressBarVisibile = true;
    this._CustomerService.DeleteReturn(this.SelectedReturnHeader).subscribe(
      (data) => {
        // console.log(data);
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('Return deleted successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        // this.GetReturnBasedOnCondition();
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

  // GetInvoiceAttachment(fileName: string, file?: File): void {
  //   if (file && file.size) {
  //     const blob = new Blob([file], { type: file.type });
  //     this.OpenAttachmentDialog(fileName, blob);
  //   } else {
  //     this.IsProgressBarVisibile = true;
  //     this._CustomerService.DowloandInvoiceAttachment(fileName, this.SelectedReturnHeader.ReturnNumber).subscribe(
  //       data => {
  //         if (data) {
  //           let fileType = 'image/jpg';
  //           fileType = fileName.toLowerCase().includes('.jpg') ? 'image/jpg' :
  //             fileName.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
  //               fileName.toLowerCase().includes('.png') ? 'image/png' :
  //                 fileName.toLowerCase().includes('.gif') ? 'image/gif' :
  //                   fileName.toLowerCase().includes('.pdf') ? 'application/pdf' : '';
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

  // GetDocumentCenterAttachment(fileName: string): void {
  //   const file = this.fileToUploadList.filter(x => x.name === fileName)[0];
  //   if (file && file.size) {
  //     const blob = new Blob([file], { type: file.type });
  //     this.OpenAttachmentDialog(fileName, blob);
  //   } else {
  //     this.IsProgressBarVisibile = true;
  //     this._CustomerService.DowloandDocumentCenterAttachment(fileName, this.SelectedReturnHeader.ReturnNumber).subscribe(
  //       data => {
  //         if (data) {
  //           let fileType = 'image/jpg';
  //           fileType = fileName.toLowerCase().includes('.jpg') ? 'image/jpg' :
  //             fileName.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
  //               fileName.toLowerCase().includes('.png') ? 'image/png' :
  //                 fileName.toLowerCase().includes('.gif') ? 'image/gif' :
  //                   fileName.toLowerCase().includes('.pdf') ? 'application/pdf' : '';
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

  OpenAttachmentDialog(FileName: string, blob: Blob): void {
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

  AmountSelected(): void {
    const GrossWeightVAL = +this.ReturnFormGroup.get('GrossWeight').value;
    const NetWeightVAL = + this.ReturnFormGroup.get('NetWeight').value;
    if (GrossWeightVAL && GrossWeightVAL && GrossWeightVAL <= NetWeightVAL) {
      this.isWeightError = true;
    } else {
      this.isWeightError = false;
    }
  }

}
