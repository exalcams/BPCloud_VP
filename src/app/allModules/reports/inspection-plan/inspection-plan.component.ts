import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from 'app/services/report.service';
import { BPCReportIP } from 'app/models/ReportModel';
import { ExcelService } from 'app/services/excel.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-inspection-plan',
  templateUrl: './inspection-plan.component.html',
  styleUrls: ['./inspection-plan.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class InspectionPlanComponent implements OnInit {
  isProgressBarVisibile: boolean;
  fileName = 'ExcelSheet.xlsx';
  displayedColumns: string[] = ['Material', 'MaterialDesc', 'MaterialCharacteristics', 'Description', 'LowerLimit', 'UpperLimit', 'UOM', 'InspecMethod', 'ModRule'];
  TabledataSource: MatTableDataSource<BPCReportIP>;
  material = "";
  inspectionMethod = "";

  constructor(private reportservice: ReportService, private _excelService: ExcelService,) { }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.GetAllReportIPByPartnerID();
  }
  // tslint:disable-next-line:typedef
  GetAllReportIPByPartnerID() {
    this.reportservice.GetAllReportIPByPartnerID("Visu").subscribe(
      (data) => {
        console.log(data);
        this.TabledataSource = data;
      }
    );
  }
  // tslint:disable-next-line:typedef
  GetFilteredReportIPByPartnerID() {
    this.reportservice.GetFilteredReportIPByPartnerID("Visu", this.material, this.inspectionMethod).subscribe(
      (data) => {
        this.TabledataSource = data;
      }
    );
  }
  applyfilter(filterValue: string) {
    this.TabledataSource.filter = filterValue.trim().toLowerCase();
 
  }
}
