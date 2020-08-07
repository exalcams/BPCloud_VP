import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-hovering-vehicles',
  templateUrl: './hovering-vehicles.component.html',
  styleUrls: ['./hovering-vehicles.component.scss']
})
export class HoveringVehiclesComponent implements OnInit {
  DataReport: Datareport[] = [];
  ReportColumn: string[] = ['EntryDate', 'EntryTime', 'Truck', 'Partner', 'DocNo', 'Transporter', 'Gate', 'Plant'];
  DataSource: MatTableDataSource<any>;
  constructor() { }

  ngOnInit(): void {
    this.GetHoveringVehicleDetails();
  }
  GetHoveringVehicleDetails(): void {
    this.DataReport = [
      { EntryDate: '23/07/2020', EntryTime: '10:32 AM ', Truck: 'Booked', Partner: 'ACC Cements', DocNo: '#36878756', Transporter: 'Maruthy Travels', Gate: '325', Plant: '1001' },
      { EntryDate: '23/07/2020', EntryTime: '10:32 AM ', Truck: 'Booked', Partner: 'ACC Cements', DocNo: '#36878756', Transporter: 'Maruthy Travels', Gate: '325', Plant: '1001' },
      { EntryDate: '23/07/2020', EntryTime: '10:32 AM ', Truck: 'Booked', Partner: 'ACC Cements', DocNo: '#36878756', Transporter: 'Maruthy Travels', Gate: '325', Plant: '1001' },
      { EntryDate: '23/07/2020', EntryTime: '10:32 AM ', Truck: 'Booked', Partner: 'ACC Cements', DocNo: '#36878756', Transporter: 'Maruthy Travels', Gate: '325', Plant: '1001' },
      { EntryDate: '23/07/2020', EntryTime: '10:32 AM ', Truck: 'Booked', Partner: 'ACC Cements', DocNo: '#36878756', Transporter: 'Maruthy Travels', Gate: '325', Plant: '1001' },
      { EntryDate: '23/07/2020', EntryTime: '10:32 AM ', Truck: 'Booked', Partner: 'ACC Cements', DocNo: '#36878756', Transporter: 'Maruthy Travels', Gate: '325', Plant: '1001' }
    ];
    this.DataSource = new MatTableDataSource(this.DataReport);
  }

}
export class Datareport {
  EntryDate: string;
  EntryTime: string;
  Truck: string;
  Partner: string;
  DocNo: string;
  Transporter: string;
  Gate: string;
  Plant: string;
  // ExitDt:string;
  // ExitTime:string;
  // TATime:string;
  // Exception:string;
}