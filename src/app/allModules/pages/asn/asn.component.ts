import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthenticationDetails, UserWithRole } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MasterService } from 'app/services/master.service';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ASNService } from 'app/services/asn.service';
import { ShareParameterService } from 'app/services/share-parameters.service';
import { BPCASNHeader, BPCASNItem, DocumentCentre, BPCASNView } from 'app/models/ASN';
import { BehaviorSubject } from 'rxjs';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { FuseConfigService } from '@fuse/services/config.service';
import { FactService } from 'app/services/fact.service';
import { VendorMasterService } from 'app/services/vendor-master.service';
import { POService } from 'app/services/po.service';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';

@Component({
    selector: 'app-asn',
    templateUrl: './asn.component.html',
    styleUrls: ['./asn.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ASNComponent implements OnInit {
    authenticationDetails: AuthenticationDetails;
    currentUserID: Guid;
    currentUserRole: string;
    MenuItems: string[];
    notificationSnackBarComponent: NotificationSnackBarComponent;
    IsProgressBarVisibile: boolean;
    ASNFormGroup: FormGroup;
    ASNItemFormGroup: FormGroup;
    InvoiceDetailsFormGroup: FormGroup;
    DocumentCentreFormGroup: FormGroup;
    AllUserWithRoles: UserWithRole[] = [];
    SelectedASNHeader: BPCASNHeader;
    SelectedASNView: BPCASNView;
    ASNItems: BPCASNItem[] = [];
    ASNItemDisplayedColumns: string[] = [
        'Item',
        'MaterialText',
        'DeliveryDate',
        'OrderQty',
        'GRQty',
        'PipelineQty',
        'OpenQty',
        'ASNQty',
        'Batch',
        'ManufactureDate'
    ];
    ASNItemFormArray: FormArray = this._formBuilder.array([]);
    ASNItemDataSource = new BehaviorSubject<AbstractControl[]>([]);
    @ViewChild(MatPaginator) asnItemPaginator: MatPaginator;
    @ViewChild(MatSort) asnItemSort: MatSort;
    fileToUpload: File;
    fileToUploadList: File[] = [];

    AllDocumentCentres: DocumentCentre[] = [];
    documentCentreDisplayedColumns: string[] = [
        'DocumentType',
        'DocumentTitle',
        'Filename',
    ];
    documentCentreDataSource: MatTableDataSource<DocumentCentre>;
    @ViewChild(MatPaginator) documentCentrePaginator: MatPaginator;
    @ViewChild(MatSort) documentCentreSort: MatSort;

    selection = new SelectionModel<any>(true, []);
    searchText = '';

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _masterService: MasterService,
        private _FactService: FactService,
        private _POService: POService,
        private _ASNService: ASNService,
        private _vendorMasterService: VendorMasterService,
        private _router: Router,
        public snackBar: MatSnackBar,
        private dialog: MatDialog,
        private _formBuilder: FormBuilder) {
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.authenticationDetails = new AuthenticationDetails();
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.IsProgressBarVisibile = false;
        this.SelectedASNHeader = new BPCASNHeader();
        this.SelectedASNView = new BPCASNView();
    }

    ngOnInit(): void {
        // Retrive authorizationData
        // const retrievedObject = localStorage.getItem('authorizationData');
        // if (retrievedObject) {
        //     this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
        //     this.currentUserID = this.authenticationDetails.UserID;
        //     this.currentUserRole = this.authenticationDetails.UserRole;
        //     this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
        //     if (this.MenuItems.indexOf('ASN') < 0) {
        //         this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        //         );
        //         this._router.navigate(['/auth/login']);
        //     }

        // } else {
        //     this._router.navigate(['/auth/login']);
        // }

        this.InitializeASNFormGroup();
        this.InitializeASNItemFormGroup();
        this.InitializeInvoiceDetailsFormGroup();
        this.InitializeDocumentCentreFormGroup();
    }

    InitializeASNFormGroup(): void {
        this.ASNFormGroup = this._formBuilder.group({
            TransportMode: ['', Validators.required],
            VessleNumber: ['', Validators.required],
            AWBNumber: ['', Validators.required],
            AWBDate: ['', Validators.required],
            NetWeight: ['', [Validators.required, Validators.pattern('^([0-9]*[1-9][0-9]*(\\.[0-9]+)?|[0]*\\.[0-9]*[1-9][0-9]*)$')]],
            UOM: ['', Validators.required],
            GrossWeight: ['', [Validators.required, Validators.pattern('^([0-9]*[1-9][0-9]*(\\.[0-9]+)?|[0]*\\.[0-9]*[1-9][0-9]*)$')]],
            // UOM: ['', Validators.required],
            VolumetricWeight: ['', [Validators.required, Validators.pattern('^([0-9]*[1-9][0-9]*(\\.[0-9]+)?|[0]*\\.[0-9]*[1-9][0-9]*)$')]],
            VolumetricWeightUOM: ['', Validators.required],
            DepartureDate: ['', Validators.required],
            ArrivalDate: ['', Validators.required],
            NumberOfPacks: ['', [Validators.required, Validators.pattern('^([0-9]*[1-9][0-9]*(\\.[0-9]+)?|[0]*\\.[0-9]*[1-9][0-9]*)$')]],
            CountryOfOrigin: ['', Validators.required],
            ShippingAgency: ['', Validators.required],
        });
        // this.DynamicallyAddAcceptedValidation();
    }
    InitializeASNItemFormGroup(): void {
        this.ASNItemFormGroup = this._formBuilder.group({
            ASNItems: this.ASNItemFormArray
        });
    }
    InitializeInvoiceDetailsFormGroup(): void {
        this.InvoiceDetailsFormGroup = this._formBuilder.group({
            InvoiceNumber: ['', Validators.required],
            InvoiceValue: ['', [Validators.required, Validators.pattern('^([0-9]*[1-9][0-9]*(\\.[0-9]+)?|[0]*\\.[0-9]*[1-9][0-9]*)$')]],
            InvoiceValueUnit: ['', Validators.required],
            InvoiceDate: ['', Validators.required],
            InvoiceAttachment: [''],
        });
        // this.DynamicallyAddAcceptedValidation();
    }

    InitializeDocumentCentreFormGroup(): void {
        this.DocumentCentreFormGroup = this._formBuilder.group({
            DocumentType: ['', Validators.required],
            DocumentTitle: ['', Validators.required],
            Filename: ['', Validators.required],
        });
        // this.DynamicallyAddAcceptedValidation();
    }

    ResetControl(): void {
        this.SelectedASNHeader = new BPCASNHeader();
        this.SelectedASNView = new BPCASNView();
        this.ResetASNFormGroup();
        this.ResetInvoiceDetailsFormGroup();
        this.ResetDocumentCentreFormGroup();
    }

    ResetASNFormGroup(): void {
        this.ResetFormGroup(this.ASNFormGroup);
    }
    ResetInvoiceDetailsFormGroup(): void {
        this.ResetFormGroup(this.InvoiceDetailsFormGroup);
    }
    ResetDocumentCentreFormGroup(): void {
        this.ResetFormGroup(this.DocumentCentreFormGroup);
    }

    ResetFormGroup(formGroup: FormGroup): void {
        formGroup.reset();
        Object.keys(formGroup.controls).forEach(key => {
            formGroup.get(key).enable();
            formGroup.get(key).markAsUntouched();
        });
    }

    TransportModeSelected(event): void {
        const selectedType = event.value;
        if (event.value) {
            // this.SelectedTask.Type = event.value;
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

    handleFileInput(evt): void {
        if (evt.target.files && evt.target.files.length > 0) {
            this.fileToUpload = evt.target.files[0];
            this.fileToUploadList.push(this.fileToUpload);
        }
    }

    netWeightUnitSelected(event): void {

    }

    grossWeightUnitSelected(event): void {

    }

    VolumetricWeightUOMSelected(event): void {

    }

    CountryOfOriginSelected(event): void {

    }

    invoiceValueUnitSelected(event): void {

    }

    AddDocumentCentreToTable(): void {

    }

    SetASNHeaderValues(): void {
        this.ASNFormGroup.get('TransportMode').patchValue(this.SelectedASNHeader.TransportMode);
        this.ASNFormGroup.get('VessleNumber').patchValue(this.SelectedASNHeader.VessleNumber);
        this.ASNFormGroup.get('AWBNumber').patchValue(this.SelectedASNHeader.AWBNumber);
        this.ASNFormGroup.get('AWBDate').patchValue(this.SelectedASNHeader.AWBDate);
        this.ASNFormGroup.get('CountryOfOrigin').patchValue(this.SelectedASNHeader.CountryOfOrigin);
        this.ASNFormGroup.get('ShippingAgency').patchValue(this.SelectedASNHeader.ShippingAgency);
        this.ASNFormGroup.get('DepartureDate').patchValue(this.SelectedASNHeader.DepartureDate);
        this.ASNFormGroup.get('ArrivalDate').patchValue(this.SelectedASNHeader.ArrivalDate);
        this.ASNFormGroup.get('CrossWeight').patchValue(this.SelectedASNHeader.CrossWeight);
        this.ASNFormGroup.get('NetWeight').patchValue(this.SelectedASNHeader.NetWeight);
        this.ASNFormGroup.get('UOM').patchValue(this.SelectedASNHeader.UOM);
        this.ASNFormGroup.get('VolumetricWeight').patchValue(this.SelectedASNHeader.VolumetricWeight);
        this.ASNFormGroup.get('VolumetricWeightUOM').patchValue(this.SelectedASNHeader.VolumetricWeightUOM);
        this.ASNFormGroup.get('NumberOfPacks').patchValue(this.SelectedASNHeader.NumberOfPacks);
    }

    GetBPASNValues(): void {
        this.SelectedASNHeader.TransportMode = this.SelectedASNView.TransportMode = this.ASNFormGroup.get('TransportMode').value;
        this.SelectedASNHeader.VessleNumber = this.SelectedASNView.Type = this.ASNFormGroup.get('VessleNumber').value;
        this.SelectedASNHeader.AWBNumber = this.SelectedASNView.AWBNumber = this.ASNFormGroup.get('AWBNumber').value;
        this.SelectedASNHeader.AWBDate = this.SelectedASNView.AWBDate = this.ASNFormGroup.get('AWBDate').value;
        this.SelectedASNHeader.CountryOfOrigin = this.SelectedASNView.CountryOfOrigin = this.ASNFormGroup.get('CountryOfOrigin').value;
        this.SelectedASNHeader.ShippingAgency = this.SelectedASNView.ShippingAgency = this.ASNFormGroup.get('ShippingAgency').value;
        this.SelectedASNHeader.DepartureDate = this.SelectedASNView.DepartureDate = this.ASNFormGroup.get('DepartureDate').value;
        this.SelectedASNHeader.ArrivalDate = this.SelectedASNView.ArrivalDate = this.ASNFormGroup.get('ArrivalDate').value;
        this.SelectedASNHeader.CrossWeight = this.SelectedASNView.CrossWeight = this.ASNFormGroup.get('CrossWeight').value;
        this.SelectedASNHeader.NetWeight = this.SelectedASNView.NetWeight = this.ASNFormGroup.get('NetWeight').value;
        this.SelectedASNHeader.UOM = this.SelectedASNView.UOM = this.ASNFormGroup.get('UOM').value;
        this.SelectedASNHeader.VolumetricWeight = this.SelectedASNView.VolumetricWeight = this.ASNFormGroup.get('VolumetricWeight').value;
        this.SelectedASNHeader.VolumetricWeightUOM = this.SelectedASNView.VolumetricWeightUOM = this.ASNFormGroup.get('VolumetricWeightUOM').value;
        this.SelectedASNHeader.NumberOfPacks = this.SelectedASNView.NumberOfPacks = this.ASNFormGroup.get('NumberOfPacks').value;
        // this.SelectedASNHeader.ParentVendor = this.SelectedASNView.ParentVendor = this.ASNFormGroup.get('ParentVendor').value;
        // this.SelectedASNHeader.Status = this.SelectedASNView.Status = this.ASNFormGroup.get('Status').value;

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
                    if (Actiontype === 'Create') {
                        this.CreateASN();
                    } else if (Actiontype === 'Update') {
                        this.UpdateASN();
                    } else if (Actiontype === 'Delete') {
                        this.DeleteASN();
                    }
                }
            });
    }


    CreateASN(): void {
        // this.GetBPASNValues();
        // this.GetBPASNSubItemValues();
        this.SelectedASNView.CreatedBy = this.authenticationDetails.UserID.toString();
        this.IsProgressBarVisibile = true;
        this._ASNService.CreateASN(this.SelectedASNView).subscribe(
            (data) => {
                this.SelectedASNHeader.ASNNumber = (data as BPCASNHeader).ASNNumber;
                if (this.fileToUploadList && this.fileToUploadList.length) {
                    //   this._vendorRegistrationService.AddUserAttachment(this.SelectedBPASN.TransID, this.SelectedBPASN.Email1, this.fileToUploadList).subscribe(
                    //     (dat) => {
                    //       this._masterService.CreateVendorUser(vendorUser).subscribe(
                    //         (da) => {
                    //           this.ResetControl();
                    //           this.notificationSnackBarComponent.openSnackBar('Vendor registered successfully', SnackBarStatus.success);
                    //           this.IsProgressBarVisibile = false;
                    //         },
                    //         (err) => {
                    //           this.showErrorNotificationSnackBar(err);
                    //         });
                    //     },
                    //     (err) => {
                    //       this.showErrorNotificationSnackBar(err);
                    //     }
                    //   );
                } else {
                    this.ResetControl();
                    this.notificationSnackBarComponent.openSnackBar('ASN created successfully', SnackBarStatus.success);
                    this.IsProgressBarVisibile = false;
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

    UpdateASN(): void {
        // this.GetBPASNValues();
        // this.GetBPASNSubItemValues();
        // this.SelectedBPASNView.TransID = this.SelectedBPASN.TransID;
        this.SelectedASNView.ModifiedBy = this.authenticationDetails.UserID.toString();
        this.IsProgressBarVisibile = true;
        this._ASNService.UpdateASN(this.SelectedASNView).subscribe(
            (data) => {
                this.ResetControl();
                this.notificationSnackBarComponent.openSnackBar('ASN updated successfully', SnackBarStatus.success);
                this.IsProgressBarVisibile = false;
                // this.GetAllASNs();
            },
            (err) => {
                console.error(err);
                this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                this.IsProgressBarVisibile = false;
            }
        );
    }

    DeleteASN(): void {
        this.GetBPASNValues();
        // this.SelectedBPASN.ModifiedBy = this.authenticationDetails.userID.toString();
        this.IsProgressBarVisibile = true;
        this._ASNService.DeleteASN(this.SelectedASNHeader).subscribe(
            (data) => {
                // console.log(data);
                this.ResetControl();
                this.notificationSnackBarComponent.openSnackBar('ASN deleted successfully', SnackBarStatus.success);
                this.IsProgressBarVisibile = false;
                // this.GetAllASNs();
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




}

