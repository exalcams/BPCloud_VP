import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-asnlist',
  templateUrl: './asnlist.component.html',
  styleUrls: ['./asnlist.component.scss']
})
export class ASNListComponent implements OnInit {
  tableDetails: {
    ASN: string; PO: string; AWB: string; Truck: string; Material: string; MaterialText: string;
    ASN_Qty: string; Status: string
  }[];
  displayColumn: string[] = ['ASN', 'PO', 'AWB', 'Truck', 'Material',
    'MaterialText', 'ASN_Qty', 'Status', 'Action'];
  TableDetailsDataSource: MatTableDataSource<any>;
  truck_url = "assets/images/mover-truck.png ";
  ship_url = "assets/images/cargo-ship.png ";
  delivery_url = "assets/images/delivery.png ";
  constructor() { }

  ngOnInit(): void {
    this.GetASNListDetails();
  }
  GetASNListDetails(): void {
    this.tableDetails = [
      {
        ASN: '6839821', PO: 'PO-15487', AWB: '#87839', Truck: 'Booked', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ',
        ASN_Qty: '325', Status: "truck"
      },
      {
        ASN: '6839821', PO: 'PO-15487', AWB: '#87839', Truck: 'Booked', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ',
        ASN_Qty: '325', Status: "delivery"
      },
      {
        ASN: '6839821', PO: 'PO-15487', AWB: '#87839', Truck: 'Booked', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ',
        ASN_Qty: '325', Status: "ship"
      },
      {
        ASN: '6839821', PO: 'PO-15487', AWB: '#87839', Truck: 'Booked', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ',
        ASN_Qty: '325', Status: "truck"
      },
      {
        ASN: '6839821', PO: 'PO-15487', AWB: '#87839', Truck: 'Booked', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ',
        ASN_Qty: '325', Status: "ship"
      }

    ];
    this.TableDetailsDataSource = new MatTableDataSource(this.tableDetails);

  }
}
