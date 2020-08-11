import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-po-schedules',
  templateUrl: './po-schedules.component.html',
  styleUrls: ['./po-schedules.component.scss']
})
export class PoSchedulesComponent implements OnInit {
  po_schedule: po_schedule[] = [];
  DisplayedColumn: string[] = ['box', 'PO', 'Item', 'DelDate', 'Material', 'MaterialText', 'OpenQty', 'Action'];
  DataSource: MatTableDataSource<any>;
  constructor() { }

  ngOnInit(): void {
    this.GetPOSchduleDetails();
  }
  GetPOSchduleDetails(): void {
    this.po_schedule = [

      { box: '', PO: '6839821', Item: 'PO-15487', DelDate: '23/07/2020', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ', OpenQty: '325', Action: 'Action' },
      { box: '', PO: '6839821', Item: 'PO-15487', DelDate: '23/07/2020', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ', OpenQty: '325', Action: 'Action' },
      { box: '', PO: '6839821', Item: 'PO-15487', DelDate: '23/07/2020', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ', OpenQty: '325', Action: 'Action' },
      { box: '', PO: '6839821', Item: 'PO-15487', DelDate: '23/07/2020', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ', OpenQty: '325', Action: 'Action' },
      { box: '', PO: '6839821', Item: 'PO-15487', DelDate: '23/07/2020', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ', OpenQty: '325', Action: 'Action' },
      { box: '', PO: '6839821', Item: 'PO-15487', DelDate: '23/07/2020', Material: 'Coffee Beans', MaterialText: 'MM02 - Coffee-beans-5480845 ', OpenQty: '325', Action: 'Action' }
    ]
  }
}

export class po_schedule {
  box: string;
  PO: string;
  Item: string;
  DelDate: string;
  Material: string;
  MaterialText: string;
  OpenQty: string;
  Action: string;

}
