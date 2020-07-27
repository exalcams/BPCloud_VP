import { Component, OnInit } from '@angular/core';
import { MatTableDataSource  } from '@angular/material/table';
// tslint:disable-next-line:import-spacing
import {BPCReportVR} from  'app/models/ReportModel';
import { ReportService } from 'app/services/report.service';
import * as XLSX from 'xlsx';
export class Datareport {
  material: string;
  materialtext: string;
  orderqty: string;
  receivedqty: string;
  rejectedppm:string;
  reworkqty:string;
  
  
  
  
}
@Component({
  selector: 'app-vendor-rating',
  templateUrl: './vendor-rating.component.html',
  styleUrls: ['./vendor-rating.component.scss']
})
export class VendorRatingComponent implements OnInit {
  public canvasWidth = 250
public needleValue = 87
public centralLabel = '1354'

public bottomLabel = 'overall Delivary'
public options = {
    hasNeedle: true,
    needleSize:20,
    needleColor: 'rgb(79, 86, 92)',
    needleUpdateSpeed: 1000,
    arcColors: [" rgb(250, 79, 38)","rgb(248, 164, 38)","rgb(248, 208, 38)","rgb(152, 210, 38)","rgb(38, 192, 60)"],
    arcDelimiters: [20,40,60,80],
    rangeLabel: [],
    needleStartValue: 50,
    needleEndValue: 1354,
    bottomLabelFont:1
  }

  public canvasWidth1 = 250
public needleValue1 = 61
public centralLabel1 = '620'

public bottomLabel1 = 'overall Score'
public options1 = {
    hasNeedle: true,
    needleSize:20,
    needleColor: 'rgb(79, 86, 92)',
    needleUpdateSpeed: 1000,
    arcColors: [" rgb(250, 79, 38)","rgb(248, 164, 38)","rgb(248, 208, 38)","rgb(152, 210, 38)","rgb(38, 192, 60)"],
    arcDelimiters: [20,40,60,80],
    rangeLabel: [],
    needleStartValue: 20,
    needleEndValue: 1354,
    bottomLabelFont:1,
    arcBorder:["solid"]
  }
  public canvasWidth2 = 250
  public needleValue2 = 68
  public centralLabel2 = '720'
  
  public bottomLabel2 = 'overall Quality'
  public options2 = {

      hasNeedle: true,
      needleSize:10,
      needleColor: 'rgb(79, 86, 92)',
      needleUpdateSpeed: 1000,
      arcColors: [" rgb(250, 79, 38)","rgb(248, 164, 38)","rgb(248, 208, 38)","rgb(152, 210, 38)","rgb(38, 192, 60)"],
      arcDelimiters: [20,40,60,80],
      rangeLabel: [],
      needleStartValue: 50,
      needleEndValue: 1354,
      bottomLabelFontSize:1,
      bottomLableColor:"red"
    }

    fileName = 'VRReport.xlsx';
  ReportColumn:string[]=['rectanglebox','material','materialtext','orderqty','receivedqty','rejectedqty','reworkqty'];
  DataReport: MatTableDataSource<any>;
  constructor(private service:ReportService){  }
    applyfilter(filterValue: string) {
      this.DataReport.filter = filterValue.trim().toLowerCase();
   
    }

  ngOnInit(): void {
    this.service.GetVendorRatingReports('Visu').subscribe((data:BPCReportVR[])=>{
      console.log(data);
      this.DataReport= new MatTableDataSource(data);
    })
    
  }
  exportAsExcel(): void 
    {
      console.log('----------- coming')
       const element = document.getElementById('excel-table'); 
       console.log(element,"------eleeee")
       const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(element);
       //converts a DOM TABLE element to a worksheet
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
       /* save to file */
       XLSX.writeFile(wb, this.fileName);
    }

}
