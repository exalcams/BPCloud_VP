import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
    selector: 'app-order-fulfilment',
    templateUrl: './order-fulfilment.component.html',
    styleUrls: ['./order-fulfilment.component.scss']
})
export class OrderFulfilmentComponent implements OnInit {

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
    itemDataSource: MatTableDataSource<ItemDetails>;
    items: ItemDetails[] = [];
    constructor() { }
    Status: string;

    ngOnInit() {
        this.Status = "ASN"
        this.items = [{ Item: '', MaterialText: '', DalivaryDate: '', OrderQty: 10, GRQty: 12, OpenQty: 26, PipelineQty: 32, UOM: '' },
        { Item: '', MaterialText: '', DalivaryDate: '', OrderQty: 10, GRQty: 12, OpenQty: 26, PipelineQty: 32, UOM: '' },
        { Item: '', MaterialText: '', DalivaryDate: '', OrderQty: 10, GRQty: 12, OpenQty: 26, PipelineQty: 32, UOM: '' },
        { Item: '', MaterialText: '', DalivaryDate: '', OrderQty: 10, GRQty: 12, OpenQty: 26, PipelineQty: 32, UOM: '' }]
        this.itemDataSource = new MatTableDataSource(this.items);
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