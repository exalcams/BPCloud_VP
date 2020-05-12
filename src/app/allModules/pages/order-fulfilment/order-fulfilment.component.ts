import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

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
    constructor() {
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = false;
        this.tab5 = false;
        this.tab6 = false;
    }
    Status: string;

    ngOnInit() {
        this.Status = "ASN"
        this.items = [{ Item: 'item1', MaterialText: 'MaterialText1', DalivaryDate: '21/01/2020', OrderQty: 10, GRQty: 12, OpenQty: 26, PipelineQty: 32, UOM: 'EA' },
        { Item: 'item2', MaterialText: 'MaterialText', DalivaryDate: '21/01/2020', OrderQty: 10, GRQty: 12, OpenQty: 26, PipelineQty: 32, UOM: 'EA' },
        { Item: 'item2', MaterialText: 'MaterialText', DalivaryDate: '21/01/2020', OrderQty: 10, GRQty: 12, OpenQty: 26, PipelineQty: 32, UOM: 'EA' },
        { Item: 'item2', MaterialText: 'MaterialText', DalivaryDate: '21/01/2020', OrderQty: 10, GRQty: 12, OpenQty: 26, PipelineQty: 32, UOM: 'EA' }]
        this.itemDataSource = new MatTableDataSource(this.items);
        this.asn = [{ ASN: 'asn', Date: '21/01/2020', Truck: 'ka 1234', Status: 'Open' },
        { ASN: 'asn', Date: '21/01/2020', Truck: 'ka 1234', Status: 'Open' },
        { ASN: 'asn', Date: '21/01/2020', Truck: 'ka 1234', Status: 'Open' },
        { ASN: 'asn', Date: '21/01/2020', Truck: 'ka 1234', Status: 'Open' }]
        this.asnDataSource = new MatTableDataSource(this.asn);
        this.grn = [{ Item: '10', MaterialText: 'MaterialText', GRNDate: '21/01/2020', Qty: 12, Status: 'open' },
        { Item: '10', MaterialText: 'MaterialText', GRNDate: '21/01/2020', Qty: 12, Status: 'open' },
        { Item: '20', MaterialText: 'MaterialText', GRNDate: '21/01/2020', Qty: 12, Status: 'open' },
        { Item: '30', MaterialText: 'MaterialText', GRNDate: '21/01/2020', Qty: 12, Status: 'open' }]
        this.grnDataSource = new MatTableDataSource(this.grn);
        this.qa = [{ Item: '20', MaterialText: 'MaterialText', Date: '21/01/2020', LotQty: 21, RejQty: 4, RejReason: 'RejReason' },
        { Item: '20', MaterialText: 'MaterialText', Date: '21/01/2020', LotQty: 21, RejQty: 4, RejReason: 'RejReason' },
        { Item: '20', MaterialText: 'MaterialText', Date: '21/01/2020', LotQty: 21, RejQty: 4, RejReason: 'RejReason' },
        { Item: '20', MaterialText: 'MaterialText', Date: '21/01/2020', LotQty: 21, RejQty: 4, RejReason: 'RejReason' }]
        this.qaDataSource = new MatTableDataSource(this.qa);
    }
    tabone(): void {
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = false;
        this.tab5 = false;
        this.tab6 = false;
        this.getallItem();
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
        // this.ResetControl();
    }
    tabfive(): void {
        this.tab1 = false;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = false;
        this.tab5 = true;
        this.tab6 = false;
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
        // this.getallqa();
        // this.ResetControl();
    }

    getallItem() : void{
        this.itemDataSource = new MatTableDataSource(this.items);
    }
    getallasn() : void{
        this.asnDataSource = new MatTableDataSource(this.asn);
    }
    getallgrn() : void{
        this.grnDataSource = new MatTableDataSource(this.grn);
    }
    getallqa() : void{
        this.qaDataSource = new MatTableDataSource(this.qa);
    }
    
    getStatusColor(StatusFor: string): string {
        switch (StatusFor) {
            case 'ASN':
                return this.Status === 'Open' ? 'gray' : this.Status === 'PO' ? '#efb577' : '#34ad65';
            case 'Gate':
                return this.Status === 'Open' ? 'gray' : this.Status === 'PO' ? 'gray' : this.Status === 'ASN' ? '#efb577' : '#34ad65';
            case 'GRN':
                return this.Status === 'Open' ? 'gray' : this.Status === 'PO' ? 'gray' : this.Status === 'ASN' ? 'gray' :
                    this.Status === 'Gate' ? '#efb577' : '#34ad65';
            default:
                return '';
        }
    }
    getTimeline(StatusFor: string): string {
        switch (StatusFor) {
            case 'ASN':
                return this.Status === 'Open' ? 'white-timeline' : this.Status === 'PO' ? 'orange-timeline' : 'green-timeline';
            case 'Gate':
                return this.Status === 'Open' ? 'white-timeline' : this.Status === 'PO' ? 'white-timeline' : this.Status === 'ASN' ? 'orange-timeline' : 'green-timeline';
            case 'GRN':
                return this.Status === 'Open' ? 'white-timeline' : this.Status === 'PO' ? 'white-timeline' : this.Status === 'ASN' ? 'white-timeline' :
                    this.Status === 'Gate' ? 'orange-timeline' : 'green-timeline';
            default:
                return '';
        }
    }

    getRestTimeline(StatusFor: string): string {
        switch (StatusFor) {
            case 'ASN':
                return this.Status === 'Open' ? 'white-timeline' : this.Status === 'PO' ? 'white-timeline' : 'green-timeline';
            case 'Gate':
                return this.Status === 'Open' ? 'white-timeline' : this.Status === 'PO' ? 'white-timeline' : this.Status === 'ASN' ? 'white-timeline' : 'green-timeline';
            case 'GRN':
                return this.Status === 'Open' ? 'white-timeline' : this.Status === 'PO' ? 'white-timeline' : this.Status === 'ASN' ? 'white-timeline' :
                    this.Status === 'Gate' ? 'white-timeline' : 'green-timeline';
            default:
                return '';
        }
    }
}
export class ItemDetails {
    Item: string;
    MaterialText: string;
    DalivaryDate: string;
    OrderQty: number;
    GRQty: number;
    PipelineQty: number;
    OpenQty: number;
    UOM: string;
}
export class ASNDetails {
    ASN: string;
    Date: string;
    Truck: string;
    Status: string;
}
export class GRNDetails {
    Item: string;
    MaterialText: string;
    GRNDate: string;
    Qty: number;
    Status: string;
}
export class QADetails {
    Item: string;
    MaterialText: string;
    Date: string;
    LotQty: number;
    RejQty: number;
    RejReason: string;
}