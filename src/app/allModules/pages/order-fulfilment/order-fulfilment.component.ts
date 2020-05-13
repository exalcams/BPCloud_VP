import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ASNDetails, ItemDetails, GRNDetails, QADetails, OrderFulfilmentDetails, Acknowledgement } from 'app/models/Dashboard';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'app/services/dashboard.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

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
    IsProgressBarVisibile: boolean;
    itemDisplayedColumns: string[] = [
        'Item',
        'MaterialText',
        'DalivaryDate',
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
    itemDataSource: MatTableDataSource<ItemDetails>;
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

    @ViewChild(MatPaginator) itemPaginator: MatPaginator;
    @ViewChild(MatPaginator) asnPaginator: MatPaginator;
    @ViewChild(MatPaginator) grnPaginator: MatPaginator;
    @ViewChild(MatPaginator) qaPaginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        public _dashboardService: DashboardService,
        private _router: Router,
        private formBuilder: FormBuilder,
        private datepipe: DatePipe
    ) {

        this.route.queryParams.subscribe(params => {
            this.PO = params['id'];
            this._dashboardService.GetOrderFulfilmentDetails(this.PO).subscribe(
                data => {
                    if (data) {
                        this.OrderFulfilmentDetails = <OrderFulfilmentDetails>data;
                        console.log(this.OrderFulfilmentDetails);
                        this.Status = this.OrderFulfilmentDetails.Status
                        this.asn = this.OrderFulfilmentDetails.aSNDetails;
                        this.items = this.OrderFulfilmentDetails.itemDetails;
                        this.grn = this.OrderFulfilmentDetails.gRNDetails;
                        this.qa = this.OrderFulfilmentDetails.qADetails;
                        this.asnDataSource = new MatTableDataSource(this.asn);
                        this.itemDataSource = new MatTableDataSource(this.items);
                        this.grnDataSource = new MatTableDataSource(this.grn);
                        this.qaDataSource = new MatTableDataSource(this.qa);

                        this.asnDataSource.paginator = this.asnPaginator;
                        this.itemDataSource.paginator = this.itemPaginator;
                        this.grnDataSource.paginator = this.grnPaginator;
                        this.qaDataSource.paginator = this.qaPaginator;
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
        // this.Status = "ASN"
        // this.items = [{ Item: 'item1', MaterialText: 'MaterialText1', DalivaryDate: '21/01/2020', OrderQty: 10, GRQty: 12, OpenQty: 26, PipelineQty: 32, UOM: 'EA' },
        // { Item: 'item2', MaterialText: 'MaterialText', DalivaryDate: '21/01/2020', OrderQty: 10, GRQty: 12, OpenQty: 26, PipelineQty: 32, UOM: 'EA' },
        // { Item: 'item2', MaterialText: 'MaterialText', DalivaryDate: '21/01/2020', OrderQty: 10, GRQty: 12, OpenQty: 26, PipelineQty: 32, UOM: 'EA' },
        // { Item: 'item2', MaterialText: 'MaterialText', DalivaryDate: '21/01/2020', OrderQty: 10, GRQty: 12, OpenQty: 26, PipelineQty: 32, UOM: 'EA' }]
        // this.itemDataSource = new MatTableDataSource(this.items);
        // this.asn = [{ ASN: 'asn', Date: '21/01/2020', Truck: 'ka 1234', Status: 'Open' },
        // { ASN: 'asn', Date: '21/01/2020', Truck: 'ka 1234', Status: 'Open' },
        // { ASN: 'asn', Date: '21/01/2020', Truck: 'ka 1234', Status: 'Open' },
        // { ASN: 'asn', Date: '21/01/2020', Truck: 'ka 1234', Status: 'Open' }]
        // this.asnDataSource = new MatTableDataSource(this.asn);
        // this.grn = [{ Item: '10', MaterialText: 'MaterialText', GRNDate: '21/01/2020', Qty: 12, Status: 'open' },
        // { Item: '10', MaterialText: 'MaterialText', GRNDate: '21/01/2020', Qty: 12, Status: 'open' },
        // { Item: '20', MaterialText: 'MaterialText', GRNDate: '21/01/2020', Qty: 12, Status: 'open' },
        // { Item: '30', MaterialText: 'MaterialText', GRNDate: '21/01/2020', Qty: 12, Status: 'open' }]
        // this.grnDataSource = new MatTableDataSource(this.grn);
        // this.qa = [{ Item: '20', MaterialText: 'MaterialText', Date: '21/01/2020', LotQty: 21, RejQty: 4, RejReason: 'RejReason' },
        // { Item: '20', MaterialText: 'MaterialText', Date: '21/01/2020', LotQty: 21, RejQty: 4, RejReason: 'RejReason' },
        // { Item: '20', MaterialText: 'MaterialText', Date: '21/01/2020', LotQty: 21, RejQty: 4, RejReason: 'RejReason' },
        // { Item: '20', MaterialText: 'MaterialText', Date: '21/01/2020', LotQty: 21, RejQty: 4, RejReason: 'RejReason' }]
        // this.qaDataSource = new MatTableDataSource(this.qa);
    }
    YesClicked() {
        if (this.ACKFormGroup.valid) {

            this.Acknowledgement.DalivaryDate = this.datepipe.transform(this.ACKFormGroup.get('DalivaryDate').value, 'yyyy-MM-dd HH:mm:ss');
            this.Acknowledgement.PONumber = this.PO;
            this.IsProgressBarVisibile = true;
            this._dashboardService.CreateAcknowledgement(this.Acknowledgement).subscribe(
                (data) => {
                    this._router.navigate(['/pages/dashboard']);
                    this.IsProgressBarVisibile = false;
                },
                (err) => {
                    this.IsProgressBarVisibile = false;
                    console.error(err);
                }
            );
        }
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

    getallItem(): void {
        this.itemDataSource = new MatTableDataSource(this.items);
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
