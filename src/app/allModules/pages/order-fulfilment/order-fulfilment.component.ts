import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { ASNDetails, ItemDetails, GRNDetails, QADetails, OrderFulfilmentDetails, Acknowledgement } from 'app/models/Dashboard';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'app/services/dashboard.service';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BPCOFItem } from 'app/models/OrderFulFilment';
import { BehaviorSubject } from 'rxjs';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';

@Component({
    selector: 'app-order-fulfilment',
    templateUrl: './order-fulfilment.component.html',
    styleUrls: ['./order-fulfilment.component.scss']
})
export class OrderFulfilmentComponent implements OnInit {


    public tab1: boolean;
    public tab2: boolean;
    public tab3: boolean;
    public tab4: boolean;
    public tab5: boolean;
    public tab6: boolean;
    public tabCount: number;
    public ItemCount: number;
    public ASNCount: number;
    public GRNCount: number;
    public QACount: number;
    public DocumentCount: number;
    public FlipCount: number;

    IsProgressBarVisibile: boolean;
    itemDisplayedColumns: string[] = [
        'Item',
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
    itemDataSource = new BehaviorSubject<AbstractControl[]>([]);
    // itemDataSource: MatTableDataSource<ItemDetails>;
    asnDataSource: MatTableDataSource<ASNDetails>;
    grnDataSource: MatTableDataSource<GRNDetails>;
    qaDataSource: MatTableDataSource<QADetails>;
    items: ItemDetails[] = [];
    asn: ASNDetails[] = [];
    grn: GRNDetails[] = [];
    qa: QADetails[] = [];
    Status: string;
    OrderFulfilmentDetails: OrderFulfilmentDetails = new OrderFulfilmentDetails();
    PO: any;
    ACKFormGroup: FormGroup;
    Acknowledgement: Acknowledgement = new Acknowledgement();
    // POItems: ItemDetails[] = [];
    POItemFormArray: FormArray = this.formBuilder.array([]);

    @ViewChild(MatPaginator) itemPaginator: MatPaginator;
    @ViewChild(MatPaginator) asnPaginator: MatPaginator;
    @ViewChild(MatPaginator) grnPaginator: MatPaginator;
    @ViewChild(MatPaginator) qaPaginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        public _dashboardService: DashboardService,
        private _router: Router,
        private formBuilder: FormBuilder,
        private datepipe: DatePipe,
        private dialog: MatDialog,
    ) {

        this.route.queryParams.subscribe(params => {
            this.PO = params['id'];
            this._dashboardService.GetOrderFulfilmentDetails(this.PO).subscribe(
                data => {
                    if (data) {
                        this.OrderFulfilmentDetails = <OrderFulfilmentDetails>data;
                        // console.log(this.OrderFulfilmentDetails);
                        this.Status = this.OrderFulfilmentDetails.Status
                        this.asn = this.OrderFulfilmentDetails.aSNDetails;
                        this.items = this.OrderFulfilmentDetails.itemDetails;
                        this.grn = this.OrderFulfilmentDetails.gRNDetails;
                        this.qa = this.OrderFulfilmentDetails.qADetails;
                        this.ItemCount = this.OrderFulfilmentDetails.ItemCount;
                        this.ASNCount = this.OrderFulfilmentDetails.ASNCount;
                        this.GRNCount = this.OrderFulfilmentDetails.GRNCount;
                        this.QACount = this.OrderFulfilmentDetails.QACount;
                        this.DocumentCount = this.OrderFulfilmentDetails.DocumentCount;
                        this.FlipCount = this.OrderFulfilmentDetails.FlipCount;
                        this.asnDataSource = new MatTableDataSource(this.asn);
                        // this.itemDataSource = new MatTableDataSource(this.items);
                        this.grnDataSource = new MatTableDataSource(this.grn);
                        this.qaDataSource = new MatTableDataSource(this.qa);

                        this.asnDataSource.paginator = this.asnPaginator;
                        // this.itemDataSource.paginator = this.itemPaginator;
                        this.grnDataSource.paginator = this.grnPaginator;
                        this.qaDataSource.paginator = this.qaPaginator;

                        this.items.forEach(x => {
                            this.InsertPOItemsFormGroup(x);
                        });
                        // this.POItemList = new MatTableDataSource(this.POPurchaseOrderDetails.POItemList);
                        // if (this.POPurchaseOrderDetails.POItemList && this.POPurchaseOrderDetails.POItemList.length) {
                        //     this.Checked(this.POPurchaseOrderDetails.POItemList[0]);
                        // }
                        // console.log(this.POPurchaseOrderDetails);
                    }
                },
                err => {
                    console.error(err);
                }
            );
        });
        this.ACKFormGroup = this.formBuilder.group({
            DalivaryDate: ['', Validators.required]
        });
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = false;
        this.tab5 = false;
        this.tab6 = false;
        // this.tabCount = 1;
    }

    ngOnInit() {
        this.tabCount = 1;
        this.InitializePOItemFormGroup();
    }
    tabone(): void {
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = false;
        this.tab5 = false;
        this.tab6 = false;
        this.getallItem();
        this.tabCount = 1;
        // this.ResetControl();
    }
    tabtwo(): void {
        this.tab1 = false;
        this.tab2 = true;
        this.tab3 = false;
        this.tab4 = false;
        this.tab5 = false;
        this.tab6 = false;
        this.getallasn();
        this.tabCount = 2;
        // this.ResetControl();
    }
    tabthree(): void {
        this.tab1 = false;
        this.tab2 = false;
        this.tab3 = true;
        this.tab4 = false;
        this.tab5 = false;
        this.tab6 = false;
        this.getallgrn();
        this.tabCount = 3;
        // this.ResetControl();
    }
    tabfour(): void {
        this.tab1 = false;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = true;
        this.tab5 = false;
        this.tab6 = false;
        this.getallqa();
        this.tabCount = 4;
        // this.ResetControl();
    }
    tabfive(): void {
        this.tab1 = false;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = false;
        this.tab5 = true;
        this.tab6 = false;
        this.tabCount = 5;
        // this.getallqa();
        // this.ResetControl();
    }
    tabsix(): void {
        this.tab1 = false;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = false;
        this.tab5 = false;
        this.tab6 = true;
        this.tabCount = 6;
        // this.getallqa();
        // this.ResetControl();
    }

    AdvanceShipment(po: string) {
        // alert(po);
        this._router.navigate(['/pages/asn'], { queryParams: { id: po } });
    }

    InitializePOItemFormGroup(): void {
        this.ACKFormGroup = this.formBuilder.group({
            POItems: this.POItemFormArray
        });
    }
    GetPOItemValues(): void {
        this.OrderFulfilmentDetails.itemDetails = [];
        const poItemFormArray = this.ACKFormGroup.get('POItems') as FormArray;
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
            this.OrderFulfilmentDetails.itemDetails.push(item);
            console.log(this.OrderFulfilmentDetails.itemDetails);
        });
    }
    InsertPOItemsFormGroup(poItem: ItemDetails): void {
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
        this.POItemFormArray.push(row);
        this.itemDataSource.next(this.POItemFormArray.controls);
        // return row;
    }
    YesClicked() {
        if (this.ACKFormGroup.valid) {
            this.GetPOItemValues();
            const dialogConfig: MatDialogConfig = {
                data: {
                    Actiontype: 'Acknowledgement',
                    Catagory: 'PO'
                },
            };
            const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(
                result => {
                    if (result) {
                        // this.user.Profile = this.slectedProfile;
                        this.Acknowledgement.PONumber = this.PO;
                        this.Acknowledgement.ItemDetails = this.OrderFulfilmentDetails.itemDetails;
                        this.IsProgressBarVisibile = true;
                        this._dashboardService.CreateAcknowledgement(this.Acknowledgement).subscribe(
                            (data) => {
                                this._router.navigate(['/pages/orderfulfilmentCenter']);
                                this.IsProgressBarVisibile = false;
                            },
                            (err) => {
                                this.IsProgressBarVisibile = false;
                                console.error(err);
                            }
                        );
                    }
                });

            // this.Acknowledgement.DalivaryDate = this.datepipe.transform(this.ACKFormGroup.get('DalivaryDate').value, 'yyyy-MM-dd HH:mm:ss');
            // this.Acknowledgement.PONumber = this.PO;
            // this.Acknowledgement.ItemDetails = this.OrderFulfilmentDetails.itemDetails;
            // this.IsProgressBarVisibile = true;
            // this._dashboardService.CreateAcknowledgement(this.Acknowledgement).subscribe(
            //     (data) => {
            //         this._router.navigate(['/pages/dashboard']);
            //         this.IsProgressBarVisibile = false;
            //     },
            //     (err) => {
            //         this.IsProgressBarVisibile = false;
            //         console.error(err);
            //     }
            // );
        }
    }
    getallItem(): void {
        // this.itemDataSource = new MatTableDataSource(this.items);
    }
    getallasn(): void {
        this.asnDataSource = new MatTableDataSource(this.asn);
    }
    getallgrn(): void {
        this.grnDataSource = new MatTableDataSource(this.grn);
    }
    getallqa(): void {
        this.qaDataSource = new MatTableDataSource(this.qa);
    }

    getStatusColor(StatusFor: string): string {
        switch (StatusFor) {
            case 'ASN':
                return this.Status === 'Open' ? 'gray' : this.Status === 'ACK' ? '#efb577' : '#34ad65';
            case 'Gate':
                return this.Status === 'Open' ? 'gray' : this.Status === 'ACK' ? 'gray' : this.Status === 'ASN' ? '#efb577' : '#34ad65';
            case 'GRN':
                return this.Status === 'Open' ? 'gray' : this.Status === 'ACK' ? 'gray' : this.Status === 'ASN' ? 'gray' :
                    this.Status === 'Gate' ? '#efb577' : '#34ad65';
            default:
                return '';
        }
    }
    getTimeline(StatusFor: string): string {
        switch (StatusFor) {
            case 'ASN':
                return this.Status === 'Open' ? 'white-timeline' : this.Status === 'ACK' ? 'orange-timeline' : 'green-timeline';
            case 'Gate':
                return this.Status === 'Open' ? 'white-timeline' : this.Status === 'ACK' ? 'white-timeline' : this.Status === 'ASN' ? 'orange-timeline' : 'green-timeline';
            case 'GRN':
                return this.Status === 'Open' ? 'white-timeline' : this.Status === 'ACK' ? 'white-timeline' : this.Status === 'ASN' ? 'white-timeline' :
                    this.Status === 'Gate' ? 'orange-timeline' : 'green-timeline';
            default:
                return '';
        }
    }

    getRestTimeline(StatusFor: string): string {
        switch (StatusFor) {
            case 'ASN':
                return this.Status === 'Open' ? 'white-timeline' : this.Status === 'ACK' ? 'white-timeline' : 'green-timeline';
            case 'Gate':
                return this.Status === 'Open' ? 'white-timeline' : this.Status === 'ACK' ? 'white-timeline' : this.Status === 'ASN' ? 'white-timeline' : 'green-timeline';
            case 'GRN':
                return this.Status === 'Open' ? 'white-timeline' : this.Status === 'ACK' ? 'white-timeline' : this.Status === 'ASN' ? 'white-timeline' :
                    this.Status === 'Gate' ? 'white-timeline' : 'green-timeline';
            default:
                return '';
        }
    }
}
