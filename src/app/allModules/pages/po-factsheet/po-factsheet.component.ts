import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialogConfig, MatDialog, MatSort } from '@angular/material';
import { ASNDetails, ItemDetails, GRNDetails, QADetails, OrderFulfilmentDetails, Acknowledgement, SLDetails } from 'app/models/Dashboard';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'app/services/dashboard.service';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { fuseAnimations } from '@fuse/animations';
import { Guid } from 'guid-typescript';
import { AuthenticationDetails } from 'app/models/master';
@Component({
    selector: 'app-po-factsheet',
    templateUrl: './po-factsheet.component.html',
    styleUrls: ['./po-factsheet.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PoFactsheetComponent implements OnInit {

    authenticationDetails: AuthenticationDetails;
    currentUserID: Guid;
    currentUserRole: string;
    partnerID: string;
    isProgressBarVisibile: boolean;

    public tab1: boolean;
    public tab2: boolean;
    public tab3: boolean;
    public tab4: boolean;
    public tab5: boolean;
    public tab6: boolean;
    public tab7: boolean;
    public tabCount: number;

    orderFulfilmentDetails: OrderFulfilmentDetails = new OrderFulfilmentDetails();
    items: ItemDetails[] = [];
    asn: ASNDetails[] = [];
    grn: GRNDetails[] = [];
    qa: QADetails[] = [];
    sl: SLDetails[] = [];
    public itemsCount: number;
    public asnCount: number;
    public grnCount: number;
    public qaCount: number;
    public slCount: number;
    public documentCount: number;
    public flipCount: number;

    itemDisplayedColumns: string[] = [
        // 'Item',
        'MaterialText',
        'DalivaryDate',
        'Proposeddeliverydate',
        'OrderQty',
        'GRQty',
        'PipelineQty',
        'OpenQty',
        'UOM'

    ];
    asnDisplayedColumns: string[] = [
        'ASN',
        'Date',
        'Truck',
        'Status'
    ];
    grnDisplayedColumns: string[] = [
        'Item',
        'MaterialText',
        'GRNDate',
        'Qty',
        'Status'
    ];
    qaDisplayedColumns: string[] = [
        'Item',
        'MaterialText',
        'Date',
        'LotQty',
        'RejQty',
        'RejReason'
    ];
    slDisplayedColumns: string[] = [
        'Item',
        'SlLine',
        'DeliveryDate',
        'OrderedQty'
    ];
    itemDataSource = new BehaviorSubject<AbstractControl[]>([]);
    // itemDataSource: MatTableDataSource<ItemDetails>;
    asnDataSource: MatTableDataSource<ASNDetails>;
    grnDataSource: MatTableDataSource<GRNDetails>;
    qaDataSource: MatTableDataSource<QADetails>;
    slDataSource: MatTableDataSource<SLDetails>;

    @ViewChild(MatPaginator) itemPaginator: MatPaginator;
    @ViewChild(MatPaginator) asnPaginator: MatPaginator;
    @ViewChild(MatPaginator) grnPaginator: MatPaginator;
    @ViewChild(MatPaginator) qaPaginator: MatPaginator;
    @ViewChild(MatPaginator) slPaginator: MatPaginator;

    @ViewChild(MatSort) itemSort: MatSort;
    @ViewChild(MatSort) asnSort: MatSort;
    @ViewChild(MatSort) grnSort: MatSort;
    @ViewChild(MatSort) qaSort: MatSort;
    @ViewChild(MatSort) slSort: MatSort;
    PO: any;
    poStatus: string;
    ackFormGroup: FormGroup;
    acknowledgement: Acknowledgement = new Acknowledgement();
    poItemFormArray: FormArray = this.formBuilder.array([]);

    constructor(
        private route: ActivatedRoute,
        public _dashboardService: DashboardService,
        private _router: Router,
        private formBuilder: FormBuilder,
        private datepipe: DatePipe,
        private dialog: MatDialog,
    ) {
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = false;
        this.tab5 = false;
        this.tab6 = false;
        this.tab7 = false;
    }

    ngOnInit(): void {
        const retrievedObject = localStorage.getItem('authorizationData');
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
            this.currentUserID = this.authenticationDetails.UserID;
            this.partnerID = this.authenticationDetails.UserName;
            this.currentUserRole = this.authenticationDetails.UserRole;
            // this.menuItems = this.authenticationDetails.MenuItemNames.split(',');
            // // console.log(this.authenticationDetails);
            // if (this.menuItems.indexOf('Dashboard') < 0) {
            //     this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
            //     );
            //     this._router.navigate(['/auth/login']);
            // }
        } else {
            this._router.navigate(['/auth/login']);
        }

        this.route.queryParams.subscribe(params => {
            this.PO = params['id'];
        });
        this.tabCount = 1;
        this.GetOfDetailsByPartnerIDAndDocNumber();
        this.initializeACKFormGroup();
        this.initializePOItemFormGroup();
    }

    GetOfDetailsByPartnerIDAndDocNumber(): void {
        this.isProgressBarVisibile = true;
        this._dashboardService.GetOrderFulfilmentDetails(this.PO, this.partnerID).subscribe(
            data => {
                if (data) {
                    this.orderFulfilmentDetails = <OrderFulfilmentDetails>data;
                    this.poStatus = this.orderFulfilmentDetails.Status;
                    this.asn = this.orderFulfilmentDetails.aSNDetails;
                    this.items = this.orderFulfilmentDetails.itemDetails;
                    this.grn = this.orderFulfilmentDetails.gRNDetails;
                    this.qa = this.orderFulfilmentDetails.qADetails;
                    this.sl = this.orderFulfilmentDetails.slDetails;
                    this.itemsCount = this.orderFulfilmentDetails.ItemCount;
                    this.asnCount = this.orderFulfilmentDetails.ASNCount;
                    this.grnCount = this.orderFulfilmentDetails.GRNCount;
                    this.qaCount = this.orderFulfilmentDetails.QACount;
                    this.slCount = this.orderFulfilmentDetails.SLCount;
                    this.documentCount = this.orderFulfilmentDetails.DocumentCount;
                    this.flipCount = this.orderFulfilmentDetails.FlipCount;
                    this.asnDataSource = new MatTableDataSource(this.asn);
                    this.grnDataSource = new MatTableDataSource(this.grn);
                    this.qaDataSource = new MatTableDataSource(this.qa);
                    this.slDataSource = new MatTableDataSource(this.sl);

                    this.asnDataSource.paginator = this.asnPaginator;
                    this.grnDataSource.paginator = this.grnPaginator;
                    this.qaDataSource.paginator = this.qaPaginator;
                    this.slDataSource.paginator = this.slPaginator;

                    this.asnDataSource.sort = this.asnSort;
                    this.grnDataSource.sort = this.grnSort;
                    this.qaDataSource.sort = this.qaSort;
                    this.slDataSource.sort = this.slSort;
                    this.items.forEach(x => {
                        this.insertPOItemsFormGroup(x);
                    });
                }
                this.isProgressBarVisibile = false;
            },
            err => {
                console.error(err);
                this.isProgressBarVisibile = false;
            }
        );
    }

    GetOfItemsByPartnerIDAndDocNumber(): void {
        this.isProgressBarVisibile = true;
        this._dashboardService.GetOfItemsByPartnerIDAndDocNumber(this.partnerID, this.PO).subscribe(
            data => {
                if (data) {
                    this.items = <ItemDetails[]>data;
                    this.items.forEach(x => {
                        this.insertPOItemsFormGroup(x);
                    });
                }
                this.isProgressBarVisibile = false;
            },
            err => {
                console.error(err);
                this.isProgressBarVisibile = false;
            }
        );
    }

    GetOfASNsByPartnerIDAndDocNumber(): void {
        this.isProgressBarVisibile = true;
        this._dashboardService.GetOfASNsByPartnerIDAndDocNumber(this.partnerID, this.PO).subscribe(
            data => {
                if (data) {
                    this.asn = <ASNDetails[]>data;
                    this.asnDataSource = new MatTableDataSource(this.asn);
                    this.asnDataSource.paginator = this.asnPaginator;
                    this.asnDataSource.sort = this.asnSort;
                }
                this.isProgressBarVisibile = false;
            },
            err => {
                console.error(err);
                this.isProgressBarVisibile = false;
            }
        );
    }

    GetOfGRGIsByPartnerIDAndDocNumber(): void {
        this.isProgressBarVisibile = true;
        this._dashboardService.GetOfGRGIsByPartnerIDAndDocNumber(this.partnerID, this.PO).subscribe(
            data => {
                if (data) {
                    this.grn = <GRNDetails[]>data;
                    this.grnDataSource = new MatTableDataSource(this.grn);
                    this.grnDataSource.paginator = this.grnPaginator;
                    this.grnDataSource.sort = this.grnSort;
                }
                this.isProgressBarVisibile = false;
            },
            err => {
                console.error(err);
                this.isProgressBarVisibile = false;
            }
        );
    }

    GetOfQMsByPartnerIDAndDocNumber(): void {
        this.isProgressBarVisibile = true;
        this._dashboardService.GetOfQMsByPartnerIDAndDocNumber(this.partnerID, this.PO).subscribe(
            data => {
                if (data) {
                    this.qa = <QADetails[]>data;
                    this.qaDataSource = new MatTableDataSource(this.qa);
                    this.qaDataSource.paginator = this.qaPaginator;
                    this.qaDataSource.sort = this.qaSort;
                }
                this.isProgressBarVisibile = false;
            },
            err => {
                console.error(err);
                this.isProgressBarVisibile = false;
            }
        );
    }

    GetOfSLsByPartnerIDAndDocNumber(): void {
        this.isProgressBarVisibile = true;
        this._dashboardService.GetOfSLsByPartnerIDAndDocNumber(this.partnerID, this.PO).subscribe(
            data => {
                if (data) {
                    this.sl = <SLDetails[]>data;
                    this.slDataSource = new MatTableDataSource(this.sl);
                    this.slDataSource.paginator = this.slPaginator;
                    this.slDataSource.sort = this.slSort;
                }
                this.isProgressBarVisibile = false;
            },
            err => {
                console.error(err);
                this.isProgressBarVisibile = false;
            }
        );
    }

    CreateAcknowledgement(): void {
        this.isProgressBarVisibile = true;
        this._dashboardService.CreateAcknowledgement(this.acknowledgement).subscribe(
            (data) => {
                this._router.navigate(['/pages/orderfulfilmentCenter']);
                this.isProgressBarVisibile = false;
            },
            (err) => {
                this.isProgressBarVisibile = false;
                console.error(err);
            }
        );
    }

    tabOneClicked(): void {
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = false;
        this.tab5 = false;
        this.tab6 = false;
        this.tab7 = false;
        this.getItems();
        this.tabCount = 1;
        // this.ResetControl();
    }

    tabTwoClicked(): void {
        this.tab1 = false;
        this.tab2 = true;
        this.tab3 = false;
        this.tab4 = false;
        this.tab5 = false;
        this.tab6 = false;
        this.tab7 = false;
        this.getASNs();
        this.tabCount = 2;
        // this.ResetControl();
    }

    tabThreeClicked(): void {
        this.tab1 = false;
        this.tab2 = false;
        this.tab3 = true;
        this.tab4 = false;
        this.tab5 = false;
        this.tab6 = false;
        this.tab7 = false;
        this.getGRNs();
        this.tabCount = 3;
        // this.ResetControl();
    }

    tabFourClicked(): void {
        this.tab1 = false;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = true;
        this.tab5 = false;
        this.tab6 = false;
        this.tab7 = false;
        this.getQAs();
        this.tabCount = 4;
        // this.ResetControl();
    }

    tabFiveClicked(): void {
        this.tab1 = false;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = false;
        this.tab5 = true;
        this.tab6 = false;
        this.tab7 = false;
        this.getSLs();
        this.tabCount = 5;
        // this.ResetControl();
    }

    tabSixClicked(): void {
        this.tab1 = false;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = false;
        this.tab5 = false;
        this.tab6 = true;
        this.tab7 = false;
        this.tabCount = 6;
    }

    tabSevenClicked(): void {
        this.tab1 = false;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = false;
        this.tab5 = false;
        this.tab6 = false;
        this.tab7 = true;
        this.tabCount = 7;
    }

    initializeACKFormGroup(): void {
        this.ackFormGroup = this.formBuilder.group({
            Proposeddeliverydate: ['', Validators.required]
        });
    }

    initializePOItemFormGroup(): void {
        this.ackFormGroup = this.formBuilder.group({
            POItems: this.poItemFormArray
        });
    }

    insertPOItemsFormGroup(poItem: ItemDetails): void {
        const row = this.formBuilder.group({
            Item: [poItem.Item],
            MaterialText: [poItem.MaterialText],
            DalivaryDate: [poItem.DalivaryDate],
            Proposeddeliverydate: [poItem.Proposeddeliverydate, Validators.required],
            OrderQty: [poItem.OrderQty],
            GRQty: [poItem.GRQty],
            PipelineQty: [poItem.PipelineQty],
            OpenQty: [poItem.OpenQty],
            UOM: [poItem.UOM]
        });
        row.disable();
        row.get('Proposeddeliverydate').enable();
        this.poItemFormArray.push(row);
        this.itemDataSource.next(this.poItemFormArray.controls);
        // return row;
    }

    getPOItemValues(): void {
        this.orderFulfilmentDetails.itemDetails = [];
        const poItemFormArray = this.ackFormGroup.get('POItems') as FormArray;
        poItemFormArray.controls.forEach((x, i) => {
            const item: ItemDetails = new ItemDetails();
            item.Item = x.get('Item').value;
            item.MaterialText = x.get('MaterialText').value;
            // item.DalivaryDate = x.get('DaliveryDate').value;
            const proposeddeliverydate = this.datepipe.transform(x.get('Proposeddeliverydate').value, 'yyyy-MM-dd HH:mm:ss');
            item.Proposeddeliverydate = proposeddeliverydate;
            item.OrderQty = x.get('OrderQty').value;
            item.UOM = x.get('UOM').value;
            item.GRQty = x.get('GRQty').value;
            item.PipelineQty = x.get('PipelineQty').value;
            item.OpenQty = x.get('OpenQty').value;
            this.orderFulfilmentDetails.itemDetails.push(item);
            console.log(this.orderFulfilmentDetails.itemDetails);
        });
    }

    acknowledgePOClicked(): void {
        if (this.ackFormGroup.valid) {
            this.getPOItemValues();
            this.acknowledgement.PONumber = this.PO;
            this.acknowledgement.ItemDetails = this.orderFulfilmentDetails.itemDetails;
            this.openNotificationDialog();
        }
    }

    openNotificationDialog(): void {
        const dialogConfig: MatDialogConfig = {
            data: {
                Actiontype: 'Acknowledgement',
                Catagory: 'PO'
            },
            panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            result => {
                if (result) {
                    this.CreateAcknowledgement();
                }
            });
    }

    goToASNClicked(po: string): void {
        // alert(po);
        this._router.navigate(['/pages/asn'], { queryParams: { id: po } });
    }

    getItems(): void {
        // this.itemDataSource = new MatTableDataSource(this.items);
    }

    getASNs(): void {
        this.asnDataSource = new MatTableDataSource(this.asn);
    }

    getGRNs(): void {
        this.grnDataSource = new MatTableDataSource(this.grn);
    }

    getQAs(): void {
        this.qaDataSource = new MatTableDataSource(this.qa);
    }

    getSLs(): void {
        this.slDataSource = new MatTableDataSource(this.sl);
    }

    getStatusColor(statusFor: string): string {
        switch (statusFor) {
            case 'ASN':
                return this.poStatus === 'DueForACK' ? 'gray' : this.poStatus === 'DueForASN' ? '#efb577' : '#34ad65';
            case 'Gate':
                return this.poStatus === 'DueForACK' ? 'gray' : this.poStatus === 'DueForASN' ? 'gray' : this.poStatus === 'DueForGate' ? '#efb577' :
                    '#34ad65';
            case 'GRN':
                return this.poStatus === 'DueForACK' ? 'gray' : this.poStatus === 'DueForASN' ? 'gray' : this.poStatus === 'DueForGate' ? 'gray' :
                    this.poStatus === 'DueForGRN' ? '#efb577' : '#34ad65';
            default:
                return '';
        }
    }

    getTimeline(statusFor: string): string {
        switch (statusFor) {
            case 'ASN':
                return this.poStatus === 'DueForACK' ? 'white-timeline' : this.poStatus === 'DueForASN' ? 'orange-timeline' : 'green-timeline';
            case 'Gate':
                return this.poStatus === 'DueForACK' ? 'white-timeline' : this.poStatus === 'DueForASN' ? 'white-timeline' :
                    this.poStatus === 'DueForGate' ? 'orange-timeline' : 'green-timeline';
            case 'GRN':
                return this.poStatus === 'DueForACK' ? 'white-timeline' : this.poStatus === 'DueForASN' ? 'white-timeline' :
                    this.poStatus === 'DueForGate' ? 'white-timeline' :
                        this.poStatus === 'DueForGRN' ? 'orange-timeline' : 'green-timeline';
            default:
                return '';
        }
    }

    getRestTimeline(statusFor: string): string {
        switch (statusFor) {
            case 'ASN':
                return this.poStatus === 'DueForACK' ? 'white-timeline' : this.poStatus === 'DueForASN' ? 'white-timeline' : 'green-timeline';
            case 'Gate':
                return this.poStatus === 'DueForACK' ? 'white-timeline' : this.poStatus === 'DueForASN' ? 'white-timeline' :
                    this.poStatus === 'DueForGate' ? 'white-timeline' : 'green-timeline';
            case 'GRN':
                return this.poStatus === 'DueForACK' ? 'white-timeline' : this.poStatus === 'DueForASN' ? 'white-timeline' :
                    this.poStatus === 'DueForGate' ? 'white-timeline' :
                        this.poStatus === 'DueForGRN' ? 'white-timeline' : 'green-timeline';
            default:
                return '';
        }
    }
}
