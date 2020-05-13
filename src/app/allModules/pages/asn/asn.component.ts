import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthenticationDetails, UserWithRole } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'app/services/master.service';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ASNService } from 'app/services/asn.service';
import { ShareParameterService } from 'app/services/share-parameters.service';

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
    asnFormGroup: FormGroup;
    invoiceDetailsFormGroup: FormGroup;
    documentCentreFormGroup: FormGroup;
    AllUserWithRoles: UserWithRole[] = [];

    AllAsnItems: ASN[] = [];
    asnItemDisplayedColumns: string[] = [
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
    asnItemDataSource: MatTableDataSource<ASN>;
    @ViewChild(MatPaginator) asnItemPaginator: MatPaginator;
    @ViewChild(MatSort) asnItemSort: MatSort;

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
        public snackBar: MatSnackBar,
        private _formBuilder: FormBuilder) {
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.authenticationDetails = new AuthenticationDetails();
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.IsProgressBarVisibile = false;
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
        this.InitializeInvoiceDetailsFormGroup();
        this.InitializeDocumentCentreFormGroup();

        this.AllAsnItems = [
            {
                Item: 122, MaterialText: '1.1', DeliveryDate: new Date(), OrderQty: '2292',
                GRQty: '891', PipelineQty: '7822', OpenQty: '7822', ASNQty: '211', Status: '', Batch: 'Batch 1', ManufactureDate: new Date()
            },
            {
                Item: 123, MaterialText: '1.1', DeliveryDate: new Date(), OrderQty: '2181',
                GRQty: '121', PipelineQty: '222', OpenQty: '7822', ASNQty: '211', Status: '', Batch: 'Batch 1', ManufactureDate: new Date()
            },
            {
                Item: 124, MaterialText: '1.1', DeliveryDate: new Date(), OrderQty: '2892',
                GRQty: '121', PipelineQty: '2222', OpenQty: '7822', ASNQty: '211', Status: '', Batch: 'Batch 2', ManufactureDate: new Date()
            },
            {
                Item: 125, MaterialText: '1.1', DeliveryDate: new Date(), OrderQty: '1211',
                GRQty: '3111', PipelineQty: '4322', OpenQty: '7822', ASNQty: '211', Status: '', Batch: 'Batch 2', ManufactureDate: new Date()
            },
            {
                Item: 126, MaterialText: '1.1', DeliveryDate: new Date(), OrderQty: '9011',
                GRQty: '111', PipelineQty: '5333', OpenQty: '7822', ASNQty: '211', Status: '', Batch: 'Batch 3', ManufactureDate: new Date()
            },
        ];
        this.asnItemDataSource = new MatTableDataSource(this.AllAsnItems);

        this.AllDocumentCentres = [
            {
                DocumentType: 'Business', DocumentTitle: 'Software Credentials', Filename: 'Software_credentials.pdf',
            },
            {
                DocumentType: 'Payment', DocumentTitle: 'Hardware Subordinates', Filename: 'Hardware_subordinates.pdf',
            },
            {
                DocumentType: 'Maintanence', DocumentTitle: 'Payment Maintanence', Filename: 'Payment_maintanence.pdf',
            }
        ];
        this.documentCentreDataSource = new MatTableDataSource(this.AllDocumentCentres);
    }

    InitializeASNFormGroup(): void {
        this.asnFormGroup = this._formBuilder.group({
            ModeOfTransport: ['', Validators.required],
            Truck: ['', Validators.required],
            AWD: ['', Validators.required],
            NetWeight: ['', [Validators.required, Validators.pattern('^([0-9]*[1-9][0-9]*(\\.[0-9]+)?|[0]*\\.[0-9]*[1-9][0-9]*)$')]],
            NetWeightUnit: ['', Validators.required],
            GrossWeight: ['', [Validators.required, Validators.pattern('^([0-9]*[1-9][0-9]*(\\.[0-9]+)?|[0]*\\.[0-9]*[1-9][0-9]*)$')]],
            GrossWeightUnit: ['', Validators.required],
            VolumetricWeight: ['', [Validators.required, Validators.pattern('^([0-9]*[1-9][0-9]*(\\.[0-9]+)?|[0]*\\.[0-9]*[1-9][0-9]*)$')]],
            VolumetricWeightUnit: ['', Validators.required],
            DepartureDate: ['', Validators.required],
            ArrivalDate: ['', Validators.required],
            NoOfPacks: ['', [Validators.required, Validators.pattern('^([0-9]*[1-9][0-9]*(\\.[0-9]+)?|[0]*\\.[0-9]*[1-9][0-9]*)$')]],
            CountryOfOrigin: ['', Validators.required],
            ShippingAgency: ['', Validators.required],
        });
        // this.DynamicallyAddAcceptedValidation();
    }

    InitializeInvoiceDetailsFormGroup(): void {
        this.invoiceDetailsFormGroup = this._formBuilder.group({
            InvoiceNumber: ['', Validators.required],
            InvoiceValue: ['', [Validators.required, Validators.pattern('^([0-9]*[1-9][0-9]*(\\.[0-9]+)?|[0]*\\.[0-9]*[1-9][0-9]*)$')]],
            InvoiceValueUnit: ['', Validators.required],
            InvoiceDate: ['', Validators.required],
            InvoiceAttachment: [''],
        });
        // this.DynamicallyAddAcceptedValidation();
    }

    InitializeDocumentCentreFormGroup(): void {
        this.documentCentreFormGroup = this._formBuilder.group({
            DocumentType: ['', Validators.required],
            DocumentTitle: ['', Validators.required],
            Filename: ['', Validators.required],
        });
        // this.DynamicallyAddAcceptedValidation();
    }

    modeOfTransportSelected(event): void {
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
            //   this.fileToUpload = evt.target.files[0];
            //   this.fileToUploadList.push(this.fileToUpload);
        }
    }

    netWeightUnitSelected(event): void {

    }

    grossWeightUnitSelected(event): void {

    }

    volumetricWeightUnitSelected(event): void {

    }

    countryOfOriginSelected(event): void {

    }

    invoiceValueUnitSelected(event): void {

    }

    AddDocumentCentreToTable(): void {

    }

}
export class ASN {
    Item: number;
    MaterialText: string;
    DeliveryDate: Date;
    OrderQty: string;
    GRQty: string;
    PipelineQty: string;
    OpenQty: string;
    ASNQty: string;
    Status: string;
    Batch: string;
    ManufactureDate: Date;
}
export class DocumentCentre {
    DocumentType: string;
    DocumentTitle: string;
    Filename: string;
}
