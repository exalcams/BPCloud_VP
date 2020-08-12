import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-po-schedules',
  templateUrl: './po-schedules.component.html',
  styleUrls: ['./po-schedules.component.scss']
})
export class PoSchedulesComponent implements OnInit {
  poschedules: PoSchedule[] = [];
  DisplayedColumn: string[] = ['PO', 'Item', 'DelDate', 'Material', 'MaterialText', 'OpenQty', 'Action'];
  PoDataSource: MatTableDataSource<any>;
  constructor() { }

  ngOnInit(): void {
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
