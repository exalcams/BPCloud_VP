import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReportService } from 'app/services/report.service';
import { BPCReportOV, OverviewReportOption } from 'app/models/ReportModel';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OverviewComponent implements OnInit {
  isProgressBarVisibile: boolean;

  displayedColumns: string[] = ['Material', 'MaterialText', 'InputQuantity', 'AcceptedQuantity', 'RejectedQuantity', 'RejectedPercentage'];
  overdata = new OverviewReportOption();
  BarChart = [];
  dounutChart = [];
  Temp: any[];
  material = '';
  PoNumer = '';

  // overViewData: OverviewReportOption;
  TabledataSource: MatTableDataSource<BPCReportOV>;

  constructor(private reportservice: ReportService) {


  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.BarChart.push(new Chart('barChart', {
      type: 'bar',
      data: {
        labels: [10, 20, 30, 40, 50],
        datasets: [{
          barPercentage: 0.5,
          data: [9, 7, 3, 5, 2],
          backgroundColor: ["#3c9cdf", "#3c9cdf", "#3c9cdf", "#3c9cdf", "#3c9cdf"],
          borderWidth: 1,
        }]
      },
      options: {
        legend: {
          display: false
        },
        responsive: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    }));
    this.dounutChart.push(new Chart('doughnut', {
      type: 'doughnut',
      data: {
        datasets: [
          {

            data: [1, 1],
            backgroundColor: ['	rgb(251, 158, 97)', 'rgb(60, 156, 223)'],
            fill: false
          },
        ]
      },
      options: {
        cutoutPercentage: 60,
        responsive: true,
        tooltips: {
          enabled: false,
        }
      }
    }));
    this.GetOverviewReport();
  }
  // tslint:disable-next-line:typedef
  GetOverviewReport() {
    this.reportservice.GetOverviewReports('Visu').subscribe(
      (data) => {
        // this.BPCReportOVData = data;
        this.TabledataSource = data;
        this.Temp = data;
      }
    );
  }
  // tslint:disable-next-line:typedef
  GetOverviewReportByDate(overdata: OverviewReportOption) {
    this.reportservice.GetOverviewReportByDate(this.overdata).subscribe(
      (data) => {
        // this.dataSource = data;
        console.log("GetOverviewReportByDate", data);
      }
    );
  }
  // tslint:disable-next-line:typedef
  GetOverviewReportByOption1() {
    this.overdata.PartnerID = this.Temp[0].PatnerID;
    this.overdata.Material = this.Temp[0].Material;
    this.overdata.FromDate = new Date();
    this.overdata.ToDate = new Date();
    this.overdata.PO = null;
    this.overdata.Status = this.Temp[0].IsActive;
    this.reportservice.GetOverviewReportByOption(this.overdata).subscribe(
      (data) => {
        // this.dataSource = data;
        this.TabledataSource = data;
        console.log("GetOverviewReportByOption1", data);

      }
    );
  }
  // tslint:disable-next-line:typedef
  GetOverviewReportByOption2() {
    this.overdata.PartnerID = this.Temp[0].PatnerID;
    this.overdata.PO = this.Temp[0].PO;
    this.overdata.FromDate = new Date();
    this.overdata.ToDate = new Date();
    this.overdata.Material = null;
    this.overdata.Status = this.Temp[0].IsActive;
    this.reportservice.GetOverviewReportByOption(this.overdata).subscribe(
      (data) => {
        // this.dataSource = data;
        this.TabledataSource = data;
        console.log("GetOverviewReportByOption2", data);

      }
    );
  }
  // tslint:disable-next-line:typedef
  GetOverviewReportByOption(overdata: OverviewReportOption) {
    this.reportservice.GetOverviewReportByOption(overdata).subscribe(
      (data) => {
        // this.dataSource = data;
        this.TabledataSource = data;
      }
    );
  }
  // tslint:disable-next-line:typedef
  GetOverviewReportByStatus() {
    this.overdata.PartnerID = this.Temp[0].PatnerID;
    this.overdata.Material = this.Temp[0].Material;
    this.overdata.FromDate = new Date();
    this.overdata.ToDate = new Date();

    this.overdata.Status = this.Temp[0].IsActive;
    if (this.material && !this.PoNumer) {
      this.overdata.Material = this.material;
      this.overdata.PO = null;
    }
    else if (this.PoNumer && !this.material) {
      this.overdata.PO = this.PoNumer;
      this.overdata.Material = null;
    }
    else {
      this.overdata.Material = this.material;
      this.overdata.PO = this.PoNumer;
    }

    this.reportservice.GetOverviewReportByStatus(this.overdata).subscribe(
      (data) => {
        // this.dataSource = data;
        console.log("GetOverviewReportByStatus", data);
      }
    );
    // this.GetOverviewReportByDate(this.overdata);
    this.GetOverviewReportByOption(this.overdata);

  }


  // tslint:disable-next-line:typedef
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.TabledataSource.filter = filterValue.trim().toLowerCase();
  }

  // tslint:disable-next-line:typedef
  exportAsExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.TabledataSource.data);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'filename.xlsx');
  }

}
