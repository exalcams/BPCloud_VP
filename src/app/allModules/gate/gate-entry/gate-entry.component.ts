import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-gate-entry',
  templateUrl: './gate-entry.component.html',
  styleUrls: ['./gate-entry.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class GateEntryComponent implements OnInit {

  tabledata: any[] = [];
  bool = true;
  COUNT = 0;
  displayedColumns = ['Item', 'MaterialText', 'DeliveryDate', 'OrderQty', 'GRQty', 'PipelineQty', 'OpenQty', 'UOM'];

  dataSource: MatTableDataSource<any>;
  constructor() { }

  ngOnInit(): void {
    this.tabledata = [
      {

        item: 'Daikin AC 1.5Ton',
        material_text: 'Split AC 1.5Ton Inverter AC 5 Star rating',
        date: '22/04/2020',
        order_qty: '100',
        gr_qty: '10',
        pipeline_qty: '20',
        open_qty: '20',
        uom: 'kg'
      },
      {

        item: 'Daikin AC 1.5Ton',
        material_text: 'Split AC 1.5Ton Inverter AC 5 Star rating',
        date: '22/04/2020',
        order_qty: '100',
        gr_qty: '10',
        pipeline_qty: '20',
        open_qty: '20',
        uom: 'kg'
      },
      {

        item: 'Daikin AC 1.5Ton',
        material_text: 'Split AC 1.5Ton Inverter AC 5 Star rating',
        date: '22/04/2020',
        order_qty: '100',
        gr_qty: '10',
        pipeline_qty: '20',
        open_qty: '20',
        uom: 'kg'
      },
      {
        item: 'Daikin AC 1.5Ton',
        material_text: 'Split AC 1.5Ton Inverter AC 5 Star rating',
        date: '22/04/2020',
        order_qty: '100',
        gr_qty: '10',
        pipeline_qty: '20',
        open_qty: '20',
        uom: 'kg'
      },
      {
        item: 'Daikin AC 1.5Ton',
        material_text: 'Split AC 1.5Ton Inverter AC 5 Star rating',
        date: '22/04/2020',
        order_qty: '100',
        gr_qty: '10',
        pipeline_qty: '20',
        open_qty: '20',
        uom: 'kg'
      }
    ];
    console.log(this.tabledata);
    this.dataSource = new MatTableDataSource(this.tabledata);
  }
  check(): any {
    if (this.bool) {
      this.bool = false;
      return true;
    }
  }
  check2(): any {
    if (this.bool) {
      this.bool = true;
      return true;
    }
  }
}
