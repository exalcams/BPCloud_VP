import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationDetails, UserWithRole } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { BPCOFHeader, BPCOFItem } from 'app/models/OrderFulFilment';
import { BehaviorSubject } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { MasterService } from 'app/services/master.service';
import { FactService } from 'app/services/fact.service';
import { POService } from 'app/services/po.service';
import { VendorMasterService } from 'app/services/vendor-master.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { AttachmentDetails } from 'app/models/task';
import { AttachmentDialogComponent } from 'app/allModules/pages/attachment-dialog/attachment-dialog.component';
import { BPCPIHeader, BPCPIView, BPCPIItem } from 'app/models/customer';
import { BPCInvoiceAttachment, DocumentCenter, BPCCountryMaster, BPCCurrencyMaster, BPCDocumentCenterMaster } from 'app/models/ASN';
import { CustomerService } from 'app/services/customer.service';
import { ASNService } from 'app/services/asn.service';

@Component({
  selector: 'app-purchase-indent',
  templateUrl: './purchase-indent.component.html',
  styleUrls: ['./purchase-indent.component.scss']
})
export class PurchaseIndentComponent {
// implements OnInit {

//   authenticationDetails: AuthenticationDetails;
//     currentUserID: Guid;
//     currentUserName: string;
//     currentUserRole: string;
//     MenuItems: string[];
//     notificationSnackBarComponent: NotificationSnackBarComponent;
//     IsProgressBarVisibile: boolean;
//     AllPurchaseIndentHeaders: BPCPIHeader[] = [];
//     PurchaseIndentFormGroup: FormGroup;
//     PurchaseIndentItemFormGroup: FormGroup;
//     InvoiceDetailsFormGroup: FormGroup;
//     DocumentCenterFormGroup: FormGroup;
//     AllUserWithRoles: UserWithRole[] = [];
//     SelectedDocNumber: string;
//     PO: BPCOFHeader;
//     POItems: BPCOFItem[] = [];
//     SelectedPurchaseIndentHeader: BPCPIHeader;
//     SelectedPurchaseIndentNumber: string;
//     SelectedPurchaseIndentView: BPCPIView;
//     PurchaseIndentItems: BPCPIItem[] = [];
//     PurchaseIndentItemDisplayedColumns: string[] = [
//         'Item',
//         'Material',
//         'MaterialText',
//         'DeliveryDate',
//         'OrderedQty',
//         'GRQty',
//         'PipelineQty',
//         'OpenQty',
//         'PurchaseIndentQty',
//         'Batch',
//         'ManufactureDate',
//         'ExpiryDate'
//     ];
//     PurchaseIndentItemFormArray: FormArray = this._formBuilder.array([]);
//     PurchaseIndentItemDataSource = new BehaviorSubject<AbstractControl[]>([]);
//     @ViewChild(MatPaginator) PurchaseIndentItemPaginator: MatPaginator;
//     @ViewChild(MatSort) PurchaseIndentItemSort: MatSort;
//     invoiceAttachment: File;
//     invAttach: BPCInvoiceAttachment;
//     fileToUpload: File;
//     fileToUploadList: File[] = [];
//     math = Math;
//     minDate: Date;
//     maxDate: Date;
//     AllDocumentCenters: DocumentCenter[] = [];
//     DocumentCenterDisplayedColumns: string[] = [
//         'DocumentType',
//         'DocumentTitle',
//         'Filename',
//         'Action'
//     ];
//     DocumentCenterDataSource: MatTableDataSource<DocumentCenter>;
//     @ViewChild(MatPaginator) DocumentCenterPaginator: MatPaginator;
//     @ViewChild(MatSort) DocumentCenterSort: MatSort;

//     selection = new SelectionModel<any>(true, []);
//     searchText = '';

//     AllCountries: BPCCountryMaster[] = [];
//     AllCurrencies: BPCCurrencyMaster[] = [];
//     AllDocumentCenterMaster: BPCDocumentCenterMaster[] = [];
//     isWeightError: boolean;
//     @ViewChild('fileInput1') fileInput: ElementRef<HTMLElement>;
//     selectedDocCenterMaster: BPCDocumentCenterMaster;
//     ArrivalDateInterval: number;

//     constructor(
//         private _fuseConfigService: FuseConfigService,
//         private _masterService: MasterService,
//         private _FactService: FactService,
//         private _POService: POService,
//         private _CustomerService: CustomerService,
//         private _ASNService: ASNService,
//         private _datePipe: DatePipe,
//         private _route: ActivatedRoute,
//         private _router: Router,
//         public snackBar: MatSnackBar,
//         private dialog: MatDialog,
//         private _formBuilder: FormBuilder) {
//         this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
//         this.authenticationDetails = new AuthenticationDetails();
//         this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
//         this.IsProgressBarVisibile = false;
//         this.PO = new BPCOFHeader();
//         this.SelectedPurchaseIndentHeader = new BPCPIHeader();
//         this.SelectedPurchaseIndentView = new BPCPIView();
//         this.SelectedPurchaseIndentNumber = '';
//         this.invAttach = new BPCInvoiceAttachment();
//         this.minDate = new Date();
//         this.minDate.setDate(this.minDate.getDate() + 1);
//         this.maxDate = new Date();
//         this.isWeightError = false;
//         this.selectedDocCenterMaster = new BPCDocumentCenterMaster();
//         this.ArrivalDateInterval = 1;
//     }

//     ngOnInit(): void {
//         // Retrive authorizationData
//         const retrievedObject = localStorage.getItem('authorizationData');
//         if (retrievedObject) {
//             this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
//             this.currentUserID = this.authenticationDetails.UserID;
//             this.currentUserName = this.authenticationDetails.UserName;
//             this.currentUserRole = this.authenticationDetails.UserRole;
//             this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
//             // if (this.MenuItems.indexOf('PurchaseIndent') < 0) {
//             //     this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
//             //     );
//             //     this._router.navigate(['/auth/login']);
//             // }

//         } else {
//             this._router.navigate(['/auth/login']);
//         }
//         this._route.queryParams.subscribe(params => {
//             this.SelectedDocNumber = params['id'];
//         });
//         this.InitializePurchaseIndentFormGroup();
//         this.InitializePurchaseIndentItemFormGroup();
//         this.InitializeInvoiceDetailsFormGroup();
//         this.InitializeDocumentCenterFormGroup();
//         this.GetAllBPCCountryMasters();
//         this.GetAllBPCCurrencyMasters();
//         this.GetAllDocumentCenterMaster();
//         this.GetPurchaseIndentBasedOnCondition();
//     }

//     InitializePurchaseIndentFormGroup(): void {
//         this.PurchaseIndentFormGroup = this._formBuilder.group({
//             DocDate: [new Date(), Validators.required],
//             ReferenceDoc: ['', Validators.required],
//             Currency: ['', Validators.required],
//             NetAmount: ['', [Validators.required, Validators.pattern('^([0-9]*[1-9][0-9]*(\\.[0-9]+)?|[0]*\\.[0-9]*[1-9][0-9]*)$')]],
//             GrossAmount: ['', [Validators.required, Validators.pattern('^([0-9]*[1-9][0-9]*(\\.[0-9]+)?|[0]*\\.[0-9]*[1-9][0-9]*)$')]],
//         });
//         // this.DynamicallyAddAcceptedValidation();
//     }
//     // SetInitialValueForPurchaseIndentFormGroup(): void {
//     //     this.PurchaseIndentFormGroup.get('DocDate').patchValue('Road');
//     //     this.PurchaseIndentFormGroup.get('AWBDate').patchValue(new Date());
//     //     this.PurchaseIndentFormGroup.get('NetWeightUOM').patchValue('KG');
//     //     this.PurchaseIndentFormGroup.get('GrossWeightUOM').patchValue('KG');
//     //     this.PurchaseIndentFormGroup.get('DepartureDate').patchValue(new Date());
//     //     this.PurchaseIndentFormGroup.get('ArrivalDate').patchValue(this.minDate);
//     //     this.PurchaseIndentFormGroup.get('CountryOfOrigin').patchValue('IND');
//     // }
//     InitializePurchaseIndentItemFormGroup(): void {
//         this.PurchaseIndentItemFormGroup = this._formBuilder.group({
//             PurchaseIndentItems: this.PurchaseIndentItemFormArray
//         });
//     }
//     InitializeInvoiceDetailsFormGroup(): void {
//         this.InvoiceDetailsFormGroup = this._formBuilder.group({
//             InvoiceNumber: ['', [Validators.minLength(16), Validators.maxLength(16), Validators.pattern('^[1-9][0-9]*$')]],
//             InvoiceAmount: ['', [Validators.pattern('^([1-9][0-9]*)([.][0-9]{1,2})?$')]],
//             InvoiceAmountUOM: [''],
//             InvoiceDate: [''],
//             InvoiceAttachment: [''],
//         });
//         // this.DynamicallyAddAcceptedValidation();
//     }

//     InitializeDocumentCenterFormGroup(): void {
//         this.DocumentCenterFormGroup = this._formBuilder.group({
//             DocumentType: ['', Validators.required],
//             DocumentTitle: ['', Validators.required],
//             Filename: [''],
//         });
//         // this.DynamicallyAddAcceptedValidation();
//     }

//     ResetControl(): void {
//         this.SelectedPurchaseIndentHeader = new BPCPIHeader();
//         this.SelectedPurchaseIndentView = new BPCPIView();
//         this.SelectedPurchaseIndentNumber = '';
//         this.ResetPurchaseIndentFormGroup();
//         this.SetInitialValueForPurchaseIndentFormGroup();
//         this.ResetInvoiceDetailsFormGroup();
//         this.ResetDocumentCenterFormGroup();
//         this.ResetAttachments();
//         this.AllDocumentCenters = [];
//         this.DocumentCenterDataSource = new MatTableDataSource(this.AllDocumentCenters);
//         this.isWeightError = false;
//         this.selectedDocCenterMaster = new BPCDocumentCenterMaster();
//     }

//     ResetPurchaseIndentFormGroup(): void {
//         this.ResetFormGroup(this.PurchaseIndentFormGroup);
//     }
//     ResetInvoiceDetailsFormGroup(): void {
//         this.ResetFormGroup(this.InvoiceDetailsFormGroup);
//     }
//     ResetDocumentCenterFormGroup(): void {
//         this.ResetFormGroup(this.DocumentCenterFormGroup);
//     }

//     ResetFormGroup(formGroup: FormGroup): void {
//         formGroup.reset();
//         Object.keys(formGroup.controls).forEach(key => {
//             formGroup.get(key).enable();
//             formGroup.get(key).markAsUntouched();
//         });
//     }
//     ClearFormArray = (formArray: FormArray) => {
//         while (formArray.length !== 0) {
//             formArray.removeAt(0);
//         }
//     }

//     ResetAttachments(): void {
//         this.fileToUpload = null;
//         this.fileToUploadList = [];
//         this.invoiceAttachment = null;
//     }

//     GetPurchaseIndentBasedOnCondition(): void {
//         if (this.SelectedDocNumber) {
//             this.GetPurchaseIndentByDocAndPartnerID();
//             this.GetPOByDocAndPartnerID(this.SelectedDocNumber);
//             this.GetPOItemsByDocAndPartnerID();
//             this.GetArrivalDateIntervalByPOAndPartnerID();
//         } else {
//             this.GetAllPurchaseIndentByPartnerID();
//         }
//     }

//     DocDateSelected(event): void {
//         const selectedType = event.value;
//         if (event.value) {
//             // this.SelectedTask.Type = event.value;
//         }
//     }

//     decimalOnly(event): boolean {
//         // this.AmountSelected();
//         const charCode = (event.which) ? event.which : event.keyCode;
//         if (charCode === 8 || charCode === 9 || charCode === 13 || charCode === 46
//             || charCode === 37 || charCode === 39 || charCode === 123 || charCode === 190) {
//             return true;
//         }
//         else if (charCode < 48 || charCode > 57) {
//             return false;
//         }
//         return true;
//     }
//     numberOnly(event): boolean {
//         const charCode = (event.which) ? event.which : event.keyCode;
//         if (charCode === 8 || charCode === 9 || charCode === 13 || charCode === 46
//             || charCode === 37 || charCode === 39 || charCode === 123) {
//             return true;
//         }
//         else if (charCode < 48 || charCode > 57) {
//             return false;
//         }
//         return true;
//     }

//     handleFileInput1(evt): void {
//         if (evt.target.files && evt.target.files.length > 0) {
//             if (this.invoiceAttachment && this.invoiceAttachment.name) {
//                 this.notificationSnackBarComponent.openSnackBar('Maximum one attachment is allowed, old is attachment is replaced', SnackBarStatus.warning);
//             }
//             if (this.invAttach && this.invAttach.AttachmentName) {
//                 this.notificationSnackBarComponent.openSnackBar('Maximum one attachment is allowed, old is attachment is replaced', SnackBarStatus.warning);
//             }
//             this.invoiceAttachment = evt.target.files[0];
//             this.invAttach = new BPCInvoiceAttachment();
//         }
//     }
//     handleFileInput(evt): void {
//         if (evt.target.files && evt.target.files.length > 0) {
//             const fil = evt.target.files[0] as File;
//             if (fil.type.includes(this.selectedDocCenterMaster.Extension)) {
//                 const fileSize = this.math.round(fil.size / 1024);
//                 if (fileSize <= this.selectedDocCenterMaster.SizeInKB) {
//                     this.fileToUpload = fil;
//                     // this.fileToUploadList.push(this.fileToUpload);
//                     this.DocumentCenterFormGroup.get('Filename').patchValue(this.fileToUpload.name);
//                 } else {
//                     this.notificationSnackBarComponent.openSnackBar(`Maximum allowed file size is ${this.selectedDocCenterMaster.SizeInKB} KB only`, SnackBarStatus.danger);
//                 }
//             } else {
//                 this.notificationSnackBarComponent.openSnackBar(`Please select only ${this.selectedDocCenterMaster.Extension} file`, SnackBarStatus.danger);
//             }
//         }
//     }
    
//     DocumentTypeSelected(event): void {
//         if (event.value) {
//             this.selectedDocCenterMaster = this.AllDocumentCenterMaster.filter(x => x.DocumentType === event.value)[0];
//             if (this.selectedDocCenterMaster) {
//                 if (this.selectedDocCenterMaster.Mandatory) {
//                     this.AddDocumentCenterFileValidator();
//                 } else {
//                     this.RemoveDocumentCenterFileValidator();
//                 }
//             }
//         }
//     }

//     AddDocumentCenterFileValidator(): void {
//         this.DocumentCenterFormGroup.get('Filename').setValidators(Validators.required);
//         this.DocumentCenterFormGroup.get('Filename').updateValueAndValidity();
//     }
//     RemoveDocumentCenterFileValidator(): void {
//         this.DocumentCenterFormGroup.get('Filename').clearValidators();
//         this.DocumentCenterFormGroup.get('Filename').updateValueAndValidity();
//     }

//     // AddDocCenterAttClicked(): void {
//     //     const DocumentTypeVal = this.DocumentCenterFormGroup.get('DocumentType').value;
//     //     if (DocumentTypeVal) {
//     //         // const el: HTMLElement = this.fileInput.nativeElement;
//     //         // el.click();
//     //         const event = new MouseEvent('click', {bubbles: false});
//     //         this.fileInput.nativeElement.dispatchEvent(event);
//     //     } else {
//     //         this.notificationSnackBarComponent.openSnackBar('Please selected Document type', SnackBarStatus.danger);
//     //     }
//     // }

//     AddDocumentCenterToTable(): void {
//         if (this.DocumentCenterFormGroup.valid) {
//             const documentCenter = new DocumentCenter();
//             documentCenter.DocumentType = this.DocumentCenterFormGroup.get('DocumentType').value;
//             documentCenter.DocumentTitle = this.DocumentCenterFormGroup.get('DocumentTitle').value;
//             if (this.fileToUpload) {
//                 documentCenter.Filename = this.fileToUpload.name;
//                 this.fileToUploadList.push(this.fileToUpload);
//                 this.fileToUpload = null;
//             }
//             if (!this.AllDocumentCenters || !this.AllDocumentCenters.length) {
//                 this.AllDocumentCenters = [];
//             }
//             this.AllDocumentCenters.push(documentCenter);
//             this.DocumentCenterDataSource = new MatTableDataSource(this.AllDocumentCenters);
//             this.ResetDocumentCenterFormGroup();
//             this.selectedDocCenterMaster = new BPCDocumentCenterMaster();
//         } else {
//             this.ShowValidationErrors(this.DocumentCenterFormGroup);
//         }
//     }

//     RemoveDocumentCenterFromTable(doc: DocumentCenter): void {
//         const index: number = this.AllDocumentCenters.indexOf(doc);
//         if (index > -1) {
//             this.AllDocumentCenters.splice(index, 1);
//             const indexx = this.fileToUploadList.findIndex(x => x.name === doc.Filename);
//             if (indexx > -1) {
//                 this.fileToUploadList.splice(indexx, 1);
//             }
//         }
//         this.DocumentCenterDataSource = new MatTableDataSource(this.AllDocumentCenters);
//     }

//     GetAllBPCCountryMasters(): void {
//         this._CustomerService.GetAllBPCCountryMasters().subscribe(
//             (data) => {
//                 this.AllCountries = data as BPCCountryMaster[];
//             },
//             (err) => {
//                 console.error(err);
//             }
//         );
//     }
//     GetAllDocumentCenterMaster(): void {
//         this._ASNService.GetAllDocumentCenterMaster().subscribe(
//             (data) => {
//                 this.AllDocumentCenterMaster = data as BPCDocumentCenterMaster[];
//             },
//             (err) => {
//                 console.error(err);
//             }
//         );
//     }

//     GetAllBPCCurrencyMasters(): void {
//         this._CustomerService.GetAllBPCCurrencyMasters().subscribe(
//             (data) => {
//                 this.AllCurrencies = data as BPCCurrencyMaster[];
//             },
//             (err) => {
//                 console.error(err);
//             }
//         );
//     }

//     GetAllPurchaseIndentByPartnerID(): void {
//         this._CustomerService.GetAllPurchaseIndentByPartnerID(this.currentUserName).subscribe(
//             (data) => {
//                 this.AllPurchaseIndentHeaders = data as BPCPIHeader[];
//                 if (this.AllPurchaseIndentHeaders && this.AllPurchaseIndentHeaders.length) {
//                     this.LoadSelectedPurchaseIndent(this.AllPurchaseIndentHeaders[0]);
//                 }
//             },
//             (err) => {
//                 console.error(err);
//             }
//         );
//     }

//     GetPurchaseIndentByDocAndPartnerID(): void {
//         this._CustomerService.GetPurchaseIndentByDocAndPartnerID(this.SelectedDocNumber, this.currentUserName).subscribe(
//             (data) => {
//                 this.AllPurchaseIndentHeaders = data as BPCPIHeader[];
//             },
//             (err) => {
//                 console.error(err);
//             }
//         );
//     }
//     GetPOByDocAndPartnerID(selectedDocNumber: string): void {
//         this._POService.GetPOByDocAndPartnerID(selectedDocNumber, this.currentUserName).subscribe(
//             (data) => {
//                 this.PO = data as BPCOFHeader;
//                 if (this.SelectedDocNumber) {
//                     this.InvoiceDetailsFormGroup.get('InvoiceAmountUOM').patchValue(this.PO.Currency);
//                 }
//             },
//             (err) => {
//                 console.error(err);
//             }
//         );
//     }

//     GetPOItemsByDocAndPartnerID(): void {
//         this._POService.GetPOItemsByDocAndPartnerID(this.SelectedDocNumber, this.currentUserName).subscribe(
//             (data) => {
//                 this.POItems = data as BPCOFItem[];
//                 this.ClearFormArray(this.PurchaseIndentItemFormArray);
//                 if (this.POItems && this.POItems.length) {
//                     this.SelectedPurchaseIndentHeader.Client = this.SelectedPurchaseIndentView.Client = this.POItems[0].Client;
//                     this.SelectedPurchaseIndentHeader.Company = this.SelectedPurchaseIndentView.Company = this.POItems[0].Company;
//                     this.SelectedPurchaseIndentHeader.Type = this.SelectedPurchaseIndentView.Type = this.POItems[0].Type;
//                     this.SelectedPurchaseIndentHeader.PatnerID = this.SelectedPurchaseIndentView.PatnerID = this.POItems[0].PatnerID;
//                     this.SelectedPurchaseIndentHeader.PINumber = this.SelectedPurchaseIndentView.PINumber = this.POItems[0].PINumber;
//                     this.POItems.forEach(x => {
//                         this.InsertPOItemsFormGroup(x);
//                     });
//                 }
//             },
//             (err) => {
//                 console.error(err);
//             }
//         );
//     }

//     GetArrivalDateIntervalByPOAndPartnerID(): void {
//         this._CustomerService.GetArrivalDateIntervalByPOAndPartnerID(this.SelectedDocNumber, this.currentUserName).subscribe(
//             (data) => {
//                 this.ArrivalDateInterval = data as number;
//                 if (this.ArrivalDateInterval) {
//                     let today = new Date();
//                     today.setDate(today.getDate() + this.ArrivalDateInterval);
//                     this.PurchaseIndentFormGroup.get('ArrivalDate').patchValue(today);
//                 }
//             },
//             (err) => {
//                 console.error(err);
//             }
//         );
//     }

//     LoadSelectedPurchaseIndent(seletedPurchaseIndent: BPCPIHeader): void {
//         this.SelectedPurchaseIndentHeader = seletedPurchaseIndent;
//         this.SelectedPurchaseIndentView.PurchaseIndentNumber = this.SelectedPurchaseIndentHeader.PurchaseIndentNumber;
//         this.SelectedPurchaseIndentNumber = this.SelectedPurchaseIndentHeader.PurchaseIndentNumber;
//         this.GetPOByDocAndPartnerID(this.SelectedPurchaseIndentHeader.DocNumber);
//         this.GetPurchaseIndentItemsByPurchaseIndent();
//         this.GetDocumentCentersByPurchaseIndent();
//         this.GetInvoiceAttachmentByPurchaseIndent();
//         this.SetPurchaseIndentHeaderValues();
//         this.SetInvoiceDetailValues();
//     }

//     GetPurchaseIndentItemsByPurchaseIndent(): void {
//         this._CustomerService.GetPurchaseIndentItemsByPurchaseIndent(this.SelectedPurchaseIndentHeader.PurchaseIndentNumber).subscribe(
//             (data) => {
//                 this.SelectedPurchaseIndentView.PurchaseIndentItems = data as BBPCPIItem[];
//                 this.ClearFormArray(this.PurchaseIndentItemFormArray);
//                 if (this.SelectedPurchaseIndentView.PurchaseIndentItems && this.SelectedPurchaseIndentView.PurchaseIndentItems.length) {
//                     this.SelectedPurchaseIndentView.PurchaseIndentItems.forEach(x => {
//                         this.InsertPurchaseIndentItemsFormGroup(x);
//                     });
//                 }
//             },
//             (err) => {
//                 console.error(err);
//             }
//         );
//     }

//     GetDocumentCentersByPurchaseIndent(): void {
//         this._CustomerService.GetDocumentCentersByPurchaseIndent(this.SelectedPurchaseIndentHeader.PurchaseIndentNumber).subscribe(
//             (data) => {
//                 this.AllDocumentCenters = data as DocumentCenter[];
//                 this.DocumentCenterDataSource = new MatTableDataSource(this.AllDocumentCenters);
//             },
//             (err) => {
//                 console.error(err);
//             }
//         );
//     }
//     GetInvoiceAttachmentByPurchaseIndent(): void {
//         this._CustomerService.GetInvoiceAttachmentByPurchaseIndent(this.SelectedPurchaseIndentHeader.PurchaseIndentNumber, this.SelectedPurchaseIndentHeader.InvDocReferenceNo).subscribe(
//             (data) => {
//                 this.invAttach = data as BPCInvoiceAttachment;
//             },
//             (err) => {
//                 console.error(err);
//             }
//         );
//     }



//     SetPurchaseIndentHeaderValues(): void {
//         this.PurchaseIndentFormGroup.get('DocDate').patchValue(this.SelectedPurchaseIndentHeader.DocDate);
//         this.PurchaseIndentFormGroup.get('ReferenceDoc').patchValue(this.SelectedPurchaseIndentHeader.ReferenceDoc);
//         this.PurchaseIndentFormGroup.get('GrossAmount').patchValue(this.SelectedPurchaseIndentHeader.GrossAmount);
//         this.PurchaseIndentFormGroup.get('NetAmount').patchValue(this.SelectedPurchaseIndentHeader.NetAmount);
//         this.PurchaseIndentFormGroup.get('Currency').patchValue(this.SelectedPurchaseIndentHeader.Currency);
       
//     }

//     InsertPOItemsFormGroup(poItem: BPCOFItem): void {
//         const row = this._formBuilder.group({
//             Item: [poItem.Item],
//             Material: [poItem.Material],
//             MaterialText: [poItem.MaterialText],
//             DeliveryDate: [poItem.DeliveryDate],
//             OrderedQty: [poItem.OrderedQty],
//             GRQty: [poItem.CompletedQty],
//             PipelineQty: [poItem.TransitQty],
//             OpenQty: [poItem.OpenQty],
//             PurchaseIndentQty: [poItem.OpenQty, [Validators.required, Validators.pattern('^([1-9][0-9]*)([.][0-9]{1,3})?$')]],
//             UOM: [poItem.UOM],
//             Batch: [''],
//             ManufactureDate: [''],
//             ExpiryDate: [''],
//         });
//         row.disable();
//         row.get('PurchaseIndentQty').enable();
//         row.get('Batch').enable();
//         row.get('ManufactureDate').enable();
//         row.get('ExpiryDate').enable();
//         this.PurchaseIndentItemFormArray.push(row);
//         this.PurchaseIndentItemDataSource.next(this.PurchaseIndentItemFormArray.controls);
//         // return row;
//     }

//     InsertPurchaseIndentItemsFormGroup(PurchaseIndentItem: BBPCPIItem): void {
//         const row = this._formBuilder.group({
//             Item: [PurchaseIndentItem.Item],
//             Material: [PurchaseIndentItem.Material],
//             MaterialText: [PurchaseIndentItem.MaterialText],
//             DeliveryDate: [PurchaseIndentItem.DeliveryDate],
//             OrderedQty: [PurchaseIndentItem.OrderedQty],
//             GRQty: [PurchaseIndentItem.CompletedQty],
//             PipelineQty: [PurchaseIndentItem.TransitQty],
//             OpenQty: [PurchaseIndentItem.OpenQty],
//             PurchaseIndentQty: [PurchaseIndentItem.PurchaseIndentQty, [Validators.required, Validators.pattern('^([1-9][0-9]*)([.][0-9]{1,3})?$')]],
//             UOM: [PurchaseIndentItem.UOM],
//             Batch: [PurchaseIndentItem.Batch],
//             ManufactureDate: [PurchaseIndentItem.ManufactureDate],
//             ExpiryDate: [PurchaseIndentItem.ExpiryDate],
//         });
//         row.disable();
//         row.get('PurchaseIndentQty').enable();
//         row.get('Batch').enable();
//         row.get('ManufactureDate').enable();
//         row.get('ExpiryDate').enable();
//         this.PurchaseIndentItemFormArray.push(row);
//         this.PurchaseIndentItemDataSource.next(this.PurchaseIndentItemFormArray.controls);
//         // return row;
//     }

//     SetInvoiceDetailValues(): void {
//         this.InvoiceDetailsFormGroup.get('InvoiceNumber').patchValue(this.SelectedPurchaseIndentHeader.InvoiceNumber);
//         this.InvoiceDetailsFormGroup.get('InvoiceDate').patchValue(this.SelectedPurchaseIndentHeader.InvoiceDate);
//         this.InvoiceDetailsFormGroup.get('InvoiceAmount').patchValue(this.SelectedPurchaseIndentHeader.InvoiceAmount);
//         this.InvoiceDetailsFormGroup.get('InvoiceAmountUOM').patchValue(this.SelectedPurchaseIndentHeader.InvoiceAmountUOM);
//     }

//     GetPurchaseIndentValues(): void {
//         const depDate = this.PurchaseIndentFormGroup.get('DocDate').value;
//         if (depDate) {
//             this.SelectedPurchaseIndentHeader.DocDate = this.SelectedPurchaseIndentView.DocDate = this._datePipe.transform(depDate, 'yyyy-MM-dd HH:mm:ss');
//         } else {
//             this.SelectedPurchaseIndentHeader.DocDate = this.SelectedPurchaseIndentView.DocDate = this.PurchaseIndentFormGroup.get('DocDate').value;
//         }
//         this.SelectedPurchaseIndentHeader.ReferenceDoc = this.SelectedPurchaseIndentView.ReferenceDoc = this.PurchaseIndentFormGroup.get('ReferenceDoc').value;
//         this.SelectedPurchaseIndentHeader.GrossAmount = this.SelectedPurchaseIndentView.GrossAmount = this.PurchaseIndentFormGroup.get('GrossAmount').value;
//         this.SelectedPurchaseIndentHeader.NetAmount = this.SelectedPurchaseIndentView.NetAmount = this.PurchaseIndentFormGroup.get('NetAmount').value;
//         this.SelectedPurchaseIndentHeader.Currency = this.SelectedPurchaseIndentView.Currency = this.PurchaseIndentFormGroup.get('Currency').value;
//         if (this.SelectedDocNumber && this.PO) {
//             this.SelectedPurchaseIndentHeader.Client = this.SelectedPurchaseIndentView.Client = this.PO.Client;
//             this.SelectedPurchaseIndentHeader.Company = this.SelectedPurchaseIndentView.Company = this.PO.Company;
//             this.SelectedPurchaseIndentHeader.Type = this.SelectedPurchaseIndentView.Type = this.PO.Type;
//             this.SelectedPurchaseIndentHeader.PatnerID = this.SelectedPurchaseIndentView.PatnerID = this.PO.PatnerID;
//         } else {
//             this.SelectedPurchaseIndentHeader.Client = this.SelectedPurchaseIndentView.Client = this.SelectedPurchaseIndentHeader.Client;
//             this.SelectedPurchaseIndentHeader.Company = this.SelectedPurchaseIndentView.Company = this.SelectedPurchaseIndentHeader.Company;
//             this.SelectedPurchaseIndentHeader.Type = this.SelectedPurchaseIndentView.Type = this.SelectedPurchaseIndentHeader.Type;
//             this.SelectedPurchaseIndentHeader.PatnerID = this.SelectedPurchaseIndentView.PatnerID = this.SelectedPurchaseIndentHeader.PatnerID;
//         }
//     }

//     calculateDiff(sentDate): number {
//         const dateSent: Date = new Date(sentDate);
//         const currentDate: Date = new Date();
//         return Math.floor((Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) -
//             Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24));
//     }

//     GetPurchaseIndentItemValues(): void {
//         this.SelectedPurchaseIndentView.PurchaseIndentItems = [];
//         const PurchaseIndentItemFormArray = this.PurchaseIndentItemFormGroup.get('PurchaseIndentItems') as FormArray;
//         PurchaseIndentItemFormArray.controls.forEach((x, i) => {
//             const item: BBPCPIItem = new BBPCPIItem();
//             item.Item = x.get('Item').value;
//             item.Material = x.get('Material').value;
//             item.MaterialText = x.get('MaterialText').value;
//             item.DeliveryDate = x.get('DeliveryDate').value;
//             item.OrderedQty = x.get('OrderedQty').value;
//             item.UOM = x.get('UOM').value;
//             item.CompletedQty = x.get('GRQty').value;
//             item.TransitQty = x.get('PipelineQty').value;
//             item.OpenQty = x.get('OpenQty').value;
//             item.PurchaseIndentQty = x.get('PurchaseIndentQty').value;
//             item.Batch = x.get('Batch').value;
//             const manufDate = x.get('ManufactureDate').value;
//             if (manufDate) {
//                 item.ManufactureDate = this._datePipe.transform(manufDate, 'yyyy-MM-dd HH:mm:ss');
//             } else {
//                 item.ManufactureDate = x.get('ManufactureDate').value;
//             }
//             const expDate = x.get('ExpiryDate').value;
//             if (expDate) {
//                 item.ExpiryDate = this._datePipe.transform(expDate, 'yyyy-MM-dd HH:mm:ss');
//             } else {
//                 item.ExpiryDate = x.get('ExpiryDate').value;
//             }
//             if (this.SelectedDocNumber && this.PO) {
//                 item.Client = this.PO.Client;
//                 item.Company = this.PO.Company;
//                 item.Type = this.PO.Type;
//                 item.PatnerID = this.PO.PatnerID;
//             } else {
//                 item.Client = this.SelectedPurchaseIndentHeader.Client;
//                 item.Company = this.SelectedPurchaseIndentHeader.Company;
//                 item.Type = this.SelectedPurchaseIndentHeader.Type;
//                 item.PatnerID = this.SelectedPurchaseIndentHeader.PatnerID;
//             }
//             this.SelectedPurchaseIndentView.PurchaseIndentItems.push(item);
//         });
//     }

//     GetInvoiceDetailValues(): void {
//         this.SelectedPurchaseIndentHeader.InvoiceNumber = this.SelectedPurchaseIndentView.InvoiceNumber = this.InvoiceDetailsFormGroup.get('InvoiceNumber').value;
//         const invDate = this.InvoiceDetailsFormGroup.get('InvoiceDate').value;
//         if (invDate) {
//             this.SelectedPurchaseIndentHeader.InvoiceDate = this.SelectedPurchaseIndentView.InvoiceDate = this._datePipe.transform(invDate, 'yyyy-MM-dd HH:mm:ss');
//         } else {
//             this.SelectedPurchaseIndentHeader.InvoiceDate = this.SelectedPurchaseIndentView.InvoiceDate = this.InvoiceDetailsFormGroup.get('InvoiceDate').value;
//         }
//         this.SelectedPurchaseIndentHeader.InvoiceAmountUOM = this.SelectedPurchaseIndentView.InvoiceAmountUOM = this.InvoiceDetailsFormGroup.get('InvoiceAmountUOM').value;
//         this.SelectedPurchaseIndentHeader.InvoiceAmount = this.SelectedPurchaseIndentView.InvoiceAmount = this.InvoiceDetailsFormGroup.get('InvoiceAmount').value;
//     }

//     GetDocumentCenterValues(): void {
//         this.SelectedPurchaseIndentView.DocumentCenters = [];
//         // this.SelectedBPVendorOnBoardingView.BPBanks.push(...this.BanksByVOB);
//         this.AllDocumentCenters.forEach(x => {
//             this.SelectedPurchaseIndentView.DocumentCenters.push(x);
//         });
//     }

//     SaveClicked(): void {
//         if (this.PurchaseIndentFormGroup.valid) {
//             if (!this.isWeightError) {
//                 if (this.PurchaseIndentItemFormGroup.valid) {
//                     if (this.InvoiceDetailsFormGroup.valid) {
//                         this.GetPurchaseIndentValues();
//                         this.GetPurchaseIndentItemValues();
//                         this.GetInvoiceDetailValues();
//                         this.GetDocumentCenterValues();
//                         this.SelectedPurchaseIndentView.IsSubmitted = false;
//                         this.SetActionToOpenConfirmation('Save');
//                     } else {
//                         this.ShowValidationErrors(this.InvoiceDetailsFormGroup);
//                     }

//                 } else {
//                     this.ShowValidationErrors(this.PurchaseIndentItemFormGroup);
//                 }
//             }

//         } else {
//             this.ShowValidationErrors(this.PurchaseIndentFormGroup);
//         }
//     }
//     SubmitClicked(): void {
//         if (this.PurchaseIndentFormGroup.valid) {
//             if (!this.isWeightError) {
//                 if (this.PurchaseIndentItemFormGroup.valid) {
//                     if (this.InvoiceDetailsFormGroup.valid) {
//                         this.GetPurchaseIndentValues();
//                         this.GetPurchaseIndentItemValues();
//                         this.GetInvoiceDetailValues();
//                         this.GetDocumentCenterValues();
//                         this.SelectedPurchaseIndentView.IsSubmitted = true;
//                         this.SetActionToOpenConfirmation('Submit');
//                     } else {
//                         this.ShowValidationErrors(this.InvoiceDetailsFormGroup);
//                     }

//                 } else {
//                     this.ShowValidationErrors(this.PurchaseIndentItemFormGroup);
//                 }
//             }

//         } else {
//             this.ShowValidationErrors(this.PurchaseIndentFormGroup);
//         }
//     }
//     DeleteClicked(): void {
//         if (this.SelectedPurchaseIndentHeader.PurchaseIndentNumber) {
//             const Actiontype = 'Delete';
//             const Catagory = 'PurchaseIndent';
//             this.OpenConfirmationDialog(Actiontype, Catagory);
//         }
//     }
//     SetActionToOpenConfirmation(Actiontype: string): void {
//         // if (this.SelectedPurchaseIndentHeader.PurchaseIndentNumber) {
//         //     const Catagory = 'PurchaseIndent';
//         //     this.OpenConfirmationDialog(Actiontype, Catagory);
//         // } else {
//         //     const Catagory = 'PurchaseIndent';
//         //     this.OpenConfirmationDialog(Actiontype, Catagory);
//         // }
//         const Catagory = 'PurchaseIndent';
//         this.OpenConfirmationDialog(Actiontype, Catagory);
//     }

//     OpenConfirmationDialog(Actiontype: string, Catagory: string): void {
//         const dialogConfig: MatDialogConfig = {
//             data: {
//                 Actiontype: Actiontype,
//                 Catagory: Catagory
//             },
//             panelClass: 'confirmation-dialog'
//         };
//         const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
//         dialogRef.afterClosed().subscribe(
//             result => {
//                 if (result) {
//                     if (Actiontype === 'Save' || Actiontype === 'Submit') {
//                         if (this.SelectedPurchaseIndentHeader.PurchaseIndentNumber) {
//                             this.UpdatePurchaseIndent(Actiontype);
//                         } else {
//                             this.CreatePurchaseIndent(Actiontype);
//                         }
//                     } else if (Actiontype === 'Delete') {
//                         this.DeletePurchaseIndent();
//                     }
//                 }
//             });
//     }


//     CreatePurchaseIndent(Actiontype: string): void {
//         // this.GetPurchaseIndentValues();
//         // this.GetBPPurchaseIndentSubItemValues();
//         // this.SelectedPurchaseIndentView.CreatedBy = this.authenticationDetails.UserID.toString();
//         this.IsProgressBarVisibile = true;
//         this._CustomerService.CreatePurchaseIndent(this.SelectedPurchaseIndentView).subscribe(
//             (data) => {
//                 this.SelectedPurchaseIndentHeader.PurchaseIndentNumber = (data as BPCPIHeader).PurchaseIndentNumber;
//                 if (this.invoiceAttachment) {
//                     this.AddInvoiceAttachment(Actiontype);
//                 } else {
//                     if (this.fileToUploadList && this.fileToUploadList.length) {
//                         this.AddDocumentCenterAttachment(Actiontype);
//                     } else {
//                         this.ResetControl();
//                         this.notificationSnackBarComponent.openSnackBar(`PurchaseIndent ${Actiontype === 'Submit' ? 'submitted' : 'saved'} successfully`, SnackBarStatus.success);
//                         this.IsProgressBarVisibile = false;
//                         this.GetPurchaseIndentBasedOnCondition();
//                     }
//                 }
//             },
//             (err) => {
//                 this.showErrorNotificationSnackBar(err);
//             }
//         );
//     }

//     AddInvoiceAttachment(Actiontype: string): void {
//         this._CustomerService.AddInvoiceAttachment(this.SelectedPurchaseIndentHeader.PurchaseIndentNumber, this.currentUserID.toString(), this.invoiceAttachment).subscribe(
//             (dat) => {
//                 if (this.fileToUploadList && this.fileToUploadList.length) {
//                     this.AddDocumentCenterAttachment(Actiontype);
//                 } else {
//                     this.ResetControl();
//                     this.notificationSnackBarComponent.openSnackBar(`PurchaseIndent ${Actiontype === 'Submit' ? 'submitted' : 'saved'} successfully`, SnackBarStatus.success);
//                     this.IsProgressBarVisibile = false;
//                     this.GetPurchaseIndentBasedOnCondition();
//                 }
//             },
//             (err) => {
//                 this.showErrorNotificationSnackBar(err);
//             });
//     }
//     AddDocumentCenterAttachment(Actiontype: string): void {
//         this._CustomerService.AddDocumentCenterAttachment(this.SelectedPurchaseIndentHeader.PurchaseIndentNumber, this.currentUserID.toString(), this.fileToUploadList).subscribe(
//             (dat) => {
//                 this.ResetControl();
//                 this.notificationSnackBarComponent.openSnackBar(`PurchaseIndent ${Actiontype === 'Submit' ? 'submitted' : 'saved'} successfully`, SnackBarStatus.success);
//                 this.IsProgressBarVisibile = false;
//                 this.GetPurchaseIndentBasedOnCondition();
//             },
//             (err) => {
//                 this.showErrorNotificationSnackBar(err);
//             }
//         );
//     }

//     showErrorNotificationSnackBar(err: any): void {
//         console.error(err);
//         this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
//         this.IsProgressBarVisibile = false;
//     }

//     UpdatePurchaseIndent(Actiontype: string): void {
//         // this.GetPurchaseIndentValues();
//         // this.GetBPPurchaseIndentSubItemValues();
//         // this.SelectedBPPurchaseIndentView.TransID = this.SelectedBPPurchaseIndent.TransID;
//         // this.SelectedPurchaseIndentView.ModifiedBy = this.authenticationDetails.UserID.toString();
//         this.IsProgressBarVisibile = true;
//         this._CustomerService.UpdatePurchaseIndent(this.SelectedPurchaseIndentView).subscribe(
//             (data) => {
//                 this.SelectedPurchaseIndentHeader.PurchaseIndentNumber = (data as BPCPIHeader).PurchaseIndentNumber;
//                 if (this.invoiceAttachment) {
//                     this.AddInvoiceAttachment(Actiontype);
//                 } else {
//                     if (this.fileToUploadList && this.fileToUploadList.length) {
//                         this.AddDocumentCenterAttachment(Actiontype);
//                     } else {
//                         this.ResetControl();
//                         this.notificationSnackBarComponent.openSnackBar(`PurchaseIndent ${Actiontype === 'Submit' ? 'submitted' : 'saved'} successfully`, SnackBarStatus.success);
//                         this.IsProgressBarVisibile = false;
//                         this.GetPurchaseIndentBasedOnCondition();
//                     }
//                 }
//             },
//             (err) => {
//                 console.error(err);
//                 this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
//                 this.IsProgressBarVisibile = false;
//             }
//         );
//     }

//     DeletePurchaseIndent(): void {
//         this.GetPurchaseIndentValues();
//         // this.SelectedBPPurchaseIndent.ModifiedBy = this.authenticationDetails.userID.toString();
//         this.IsProgressBarVisibile = true;
//         this._CustomerService.DeletePurchaseIndent(this.SelectedPurchaseIndentHeader).subscribe(
//             (data) => {
//                 // console.log(data);
//                 this.ResetControl();
//                 this.notificationSnackBarComponent.openSnackBar('PurchaseIndent deleted successfully', SnackBarStatus.success);
//                 this.IsProgressBarVisibile = false;
//                 this.GetPurchaseIndentBasedOnCondition();
//             },
//             (err) => {
//                 console.error(err);
//                 this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
//                 this.IsProgressBarVisibile = false;
//             }
//         );
//     }

//     ShowValidationErrors(formGroup: FormGroup): void {
//         Object.keys(formGroup.controls).forEach(key => {
//             if (!formGroup.get(key).valid) {
//                 console.log(key);
//             }
//             formGroup.get(key).markAsTouched();
//             formGroup.get(key).markAsDirty();
//             if (formGroup.get(key) instanceof FormArray) {
//                 const FormArrayControls = formGroup.get(key) as FormArray;
//                 Object.keys(FormArrayControls.controls).forEach(key1 => {
//                     if (FormArrayControls.get(key1) instanceof FormGroup) {
//                         const FormGroupControls = FormArrayControls.get(key1) as FormGroup;
//                         Object.keys(FormGroupControls.controls).forEach(key2 => {
//                             FormGroupControls.get(key2).markAsTouched();
//                             FormGroupControls.get(key2).markAsDirty();
//                             if (!FormGroupControls.get(key2).valid) {
//                                 console.log(key2);
//                             }
//                         });
//                     } else {
//                         FormArrayControls.get(key1).markAsTouched();
//                         FormArrayControls.get(key1).markAsDirty();
//                     }
//                 });
//             }
//         });

//     }

//     GetInvoiceAttachment(fileName: string, file?: File): void {
//         if (file && file.size) {
//             const blob = new Blob([file], { type: file.type });
//             this.OpenAttachmentDialog(fileName, blob);
//         } else {
//             this.IsProgressBarVisibile = true;
//             this._CustomerService.DowloandInvoiceAttachment(fileName, this.SelectedPurchaseIndentHeader.PurchaseIndentNumber).subscribe(
//                 data => {
//                     if (data) {
//                         let fileType = 'image/jpg';
//                         fileType = fileName.toLowerCase().includes('.jpg') ? 'image/jpg' :
//                             fileName.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
//                                 fileName.toLowerCase().includes('.png') ? 'image/png' :
//                                     fileName.toLowerCase().includes('.gif') ? 'image/gif' :
//                                         fileName.toLowerCase().includes('.pdf') ? 'application/pdf' : '';
//                         const blob = new Blob([data], { type: fileType });
//                         this.OpenAttachmentDialog(fileName, blob);
//                     }
//                     this.IsProgressBarVisibile = false;
//                 },
//                 error => {
//                     console.error(error);
//                     this.IsProgressBarVisibile = false;
//                 }
//             );
//         }
//     }

//     GetDocumentCenterAttachment(fileName: string): void {
//         const file = this.fileToUploadList.filter(x => x.name === fileName)[0];
//         if (file && file.size) {
//             const blob = new Blob([file], { type: file.type });
//             this.OpenAttachmentDialog(fileName, blob);
//         } else {
//             this.IsProgressBarVisibile = true;
//             this._CustomerService.DowloandDocumentCenterAttachment(fileName, this.SelectedPurchaseIndentHeader.PurchaseIndentNumber).subscribe(
//                 data => {
//                     if (data) {
//                         let fileType = 'image/jpg';
//                         fileType = fileName.toLowerCase().includes('.jpg') ? 'image/jpg' :
//                             fileName.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
//                                 fileName.toLowerCase().includes('.png') ? 'image/png' :
//                                     fileName.toLowerCase().includes('.gif') ? 'image/gif' :
//                                         fileName.toLowerCase().includes('.pdf') ? 'application/pdf' : '';
//                         const blob = new Blob([data], { type: fileType });
//                         this.OpenAttachmentDialog(fileName, blob);
//                     }
//                     this.IsProgressBarVisibile = false;
//                 },
//                 error => {
//                     console.error(error);
//                     this.IsProgressBarVisibile = false;
//                 }
//             );
//         }
//     }

//     OpenAttachmentDialog(FileName: string, blob: Blob): void {
//         const attachmentDetails: AttachmentDetails = {
//             FileName: FileName,
//             blob: blob
//         };
//         const dialogConfig: MatDialogConfig = {
//             data: attachmentDetails,
//             panelClass: 'attachment-dialog'
//         };
//         const dialogRef = this.dialog.open(AttachmentDialogComponent, dialogConfig);
//         dialogRef.afterClosed().subscribe(result => {
//             if (result) {
//             }
//         });
//     }

//     AmountSelected(): void {
//         const GrossWeightVAL = +this.PurchaseIndentFormGroup.get('GrossWeight').value;
//         const NetWeightVAL = + this.PurchaseIndentFormGroup.get('NetWeight').value;
//         if (GrossWeightVAL && GrossWeightVAL && GrossWeightVAL <= NetWeightVAL) {
//             this.isWeightError = true;
//         } else {
//             this.isWeightError = false;
//         }
//     }

}
