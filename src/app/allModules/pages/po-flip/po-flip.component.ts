import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-po-flip',
  templateUrl: './po-flip.component.html',
  styleUrls: ['./po-flip.component.scss']
})
export class PoFlipComponent implements OnInit {

  poCostDisplayedColumns: string[] = [
    'Type',
    'Amount',
    'Remark',
    'Action'
  ];
  poDetailsDisplayedColumns: string[] = [
    'PO',
    'MaterialTxt',
    'HSN',
    'OpenQty',
    'InvoiceQty',
    'Price',
    'Tax',
    'Amount',
    'Action'
  ];
  poCostDataSource: MatTableDataSource<Cost>;
  poDetailsDataSource: MatTableDataSource<PODetails>;
  Costs: Cost[] = [];
  PODetails: PODetails[] = [];
  IsProgressBarVisibile: boolean;
  constructor() {
    this.IsProgressBarVisibile = false;
  }

  ngOnInit() {

    this.Costs = [
      { Type: 'Shipping Cost', Amount: '400', Remarks: '200KG Shipment' },
      { Type: 'Shipping Cost', Amount: '400', Remarks: '200KG Shipment' },
      { Type: 'Shipping Cost', Amount: '400', Remarks: '200KG Shipment' },
      { Type: 'Shipping Cost', Amount: '400', Remarks: '200KG Shipment' },

    ];
    this.PODetails = [
      { PO: '10', MaterialTxt: 'Query Tools', HSN: '421836', OpenQty: '20', InvoiceQty: '18', Price: '18929', Tax: '3%', Amount: '18400' },
      { PO: '10', MaterialTxt: 'Query Tools', HSN: '421836', OpenQty: '20', InvoiceQty: '18', Price: '18929', Tax: '18%', Amount: '18400' },
      { PO: '10', MaterialTxt: 'Query Tools', HSN: '421836', OpenQty: '20', InvoiceQty: '18', Price: '18929', Tax: '14%', Amount: '18400' }
    ]
    this.poCostDataSource = new MatTableDataSource(this.Costs);
    this.poDetailsDataSource = new MatTableDataSource(this.PODetails);
  }

}
export class Cost {
  Type: string;
  Amount: string;
  Remarks: string;
}
export class PODetails {
  PO: string;
  MaterialTxt: string;
  HSN: string;
  OpenQty: string;
  InvoiceQty: string;
  Price: string;
  Tax: string;
  Amount: string;
}
