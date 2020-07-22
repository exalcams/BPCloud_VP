import { Component, OnInit } from '@angular/core';
import { ReportService } from 'app/services/report.service';
import { BPCReportPPMHeader, PPMReportOption } from 'app/models/ReportModel';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { toDate } from '@angular/common/src/i18n/format_date';
@Component({
  selector: 'app-ppm',
  templateUrl: './ppm.component.html',
  styleUrls: ['./ppm.component.scss']
})
export class PPMComponent implements OnInit {
  isProgressBarVisibile: boolean;
  dataSource: MatTableDataSource<BPCReportPPMHeader>;
  dataSource2: MatTableDataSource<BPCReportPPMHeader>;
  PPMoptionData = new PPMReportOption();
  displayedColumns: string[] = ['Period', 'ReceiptQty', 'RejectionQty', 'PPM', 'OverallPPM'];
  displayedColumns2: string[] = ['Material', 'MatDesc', 'ReceiptQty', 'RejQty', 'PPM'];
  PPMData: any[] = [];
  fromdate: any = '';
  todate: any = '';
  constructor(private reportService: ReportService) {

  }

  ngOnInit(): void {
    this.reportService.GetPPMReports('Visu').subscribe(
      (data) => {
        // this.PPMData = data;
        this.dataSource = data;
        // console.log(data);
      }
    );

  }

  GetPPMReportByDate(): void {
    this.PPMoptionData.PartnerID = this.PPMData[0].PatnerID;
    this.PPMoptionData.Material = this.PPMData[0].Material;
    this.PPMoptionData.PO = "po";
    this.PPMoptionData.Status = this.PPMData[0].IsActive;

    if (this.fromdate) {
      this.PPMoptionData.FromDate = this.fromdate;
      this.PPMoptionData.ToDate = null;
    }
    else if (this.todate) {
      this.PPMoptionData.ToDate = this.todate;
      this.PPMoptionData.FromDate = null;
    }
    else {
      this.PPMoptionData.FromDate = this.fromdate;
      this.PPMoptionData.ToDate = this.todate;
    }
    // console.log("GetPPMReportByDate", this.PPMoptionData);

    this.reportService.GetPPMReportByDate(this.PPMoptionData).subscribe(
      (data) => {
        // console.log("GetPPMReportByDate", data);
      }
    );
  }

  GetPPMReportByStatus(PPMdata: any): void {
    this.reportService.GetPPMReportByStatus(PPMdata).subscribe(
      (data) => {
        this.dataSource2 = data;
        // console.log("GetPPMReportByStatus", data);
      }
    );
  }

  GetPPMItemReportByPeriod(PPMdata: any): void {
    this.reportService.GetPPMItemReportByPeriod(PPMdata.PatnerID, PPMdata.Period).subscribe(
      (data) => {
        this.dataSource2 = data;
        this.PPMData = data;
        // console.log("GetPPMItemReportByPeriod", this.PPMData);
      }
    );
  }
}
