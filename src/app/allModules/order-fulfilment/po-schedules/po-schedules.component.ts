import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'app-po-schedules',
  templateUrl: './po-schedules.component.html',
  styleUrls: ['./po-schedules.component.scss']
})
export class PoSchedulesComponent implements OnInit {
  poschedules: PoSchedule[] = [];
  BGClassName: any;
  fuseConfig: any;
  DisplayedColumn: string[] = ['PO', 'Item', 'DelDate', 'Material', 'MaterialText', 'OpenQty', 'Action'];
  PoDataSource: MatTableDataSource<any>;
  constructor( private _fuseConfigService: FuseConfigService) { }

  ngOnInit(): void {
    this.SetUserPreference();
    this.GetPOSchduleDetails();

  }
  GetPOSchduleDetails(): void {
    this.poschedules = [

      { PO: '6839821', Item: 'PO-15487', DelDate: '23/07/2020', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ', OpenQty: '325', Action: 'Action' },
      { PO: '6839821', Item: 'PO-15487', DelDate: '23/07/2020', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ', OpenQty: '325', Action: 'Action' },
      { PO: '6839821', Item: 'PO-15487', DelDate: '23/07/2020', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ', OpenQty: '325', Action: 'Action' },
      { PO: '6839821', Item: 'PO-15487', DelDate: '23/07/2020', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ', OpenQty: '325', Action: 'Action' },
      { PO: '6839821', Item: 'PO-15487', DelDate: '23/07/2020', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ', OpenQty: '325', Action: 'Action' },
      { PO: '6839821', Item: 'PO-15487', DelDate: '23/07/2020', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ', OpenQty: '325', Action: 'Action' }
    ];
    this.PoDataSource = new MatTableDataSource(this.poschedules);
  }
  SetUserPreference(): void {
    this._fuseConfigService.config
        .subscribe((config) => {
            this.fuseConfig = config;
            this.BGClassName = config;
        });
    // this._fuseConfigService.config = this.fuseConfig;
}
}

export class PoSchedule {
  PO: string;
  Item: string;
  DelDate: string;
  Material: string;
  MaterialText: string;
  OpenQty: string;
  Action: string;

}
