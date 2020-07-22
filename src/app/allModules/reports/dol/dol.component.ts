import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { ReportService } from 'app/services/report.service';
import { BPCReportDOL } from 'app/models/ReportModel';
@Component({
  selector: 'app-dol',
  templateUrl: './dol.component.html',
  styleUrls: ['./dol.component.scss']
})
export class DOLComponent implements OnInit {

  isProgressBarVisibile: boolean;
  // selected = 'option2';
  // employeesDataSource: MatTableDataSource<any>;
  // employeesDisplayColumns: string[] = ['material', 'materialtext'];
  // // @ViewChild(MatSort) sort: MatSort;
  // // @ViewChild(MatPaginator) paginator: MatPaginator;
  // fileName = 'ExcelSheet.xlsx';


  // applyfilter(filterValue: string): void {
  //   this.employeesDataSource.filter = filterValue.trim().toLowerCase();
  // }

  constructor(private _reportService: ReportService) { }

  // exportexcel(): void {
  //   /* table id is passed over here */
  //   const element = document.getElementById('excel-table');
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

  //   /* generate workbook and add the worksheet */
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   /* save to file */
  //   XLSX.writeFile(wb, this.fileName);
  // }


  ngOnInit(): void {

    //   this._reportService.GetAllReportDOLByPartnerID('Visu').subscribe(
    //     (data: BPCReportDOL[]) => {
    //       console.log(data);


    //       this.employeesDataSource = new MatTableDataSource(data);
    //     });
    //   // this.employeesDataSource.sort = this.sort; 
    //   // this.employeesDataSource.paginator = this.paginator; 
    // }
  }
}
