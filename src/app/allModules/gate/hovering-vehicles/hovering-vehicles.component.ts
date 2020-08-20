import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'app-hovering-vehicles',
  templateUrl: './hovering-vehicles.component.html',
  styleUrls: ['./hovering-vehicles.component.scss']
})
export class HoveringVehiclesComponent implements OnInit {
  BGClassName: any;
  fuseConfig: any;
  DataReport: Datareport[] = [];
  ReportColumn: string[] = ['EntryDate', 'EntryTime', 'Truck', 'Partner', 'DocNo', 'Transporter', 'Gate', 'Plant'];
  DataSource: MatTableDataSource<any>;
  constructor(private _fuseConfigService: FuseConfigService) { }

  ngOnInit(): void {
    this.GetHoveringVehicleDetails();
    this.SetUserPreference();
  }
  SetUserPreference(): void {
    this._fuseConfigService.config
        .subscribe((config) => {
            this.fuseConfig = config;
            this.BGClassName = config;
        });
    // this._fuseConfigService.config = this.fuseConfig;
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