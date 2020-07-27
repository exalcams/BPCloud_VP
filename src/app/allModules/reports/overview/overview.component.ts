import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReportService } from 'app/services/report.service';
import { BPCReportOV, OverviewReportOption } from 'app/models/ReportModel';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js';
import * as XLSX from 'xlsx';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { colorSets } from '@swimlane/ngx-charts/release/utils';

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
  fileName = 'OverViewData.xlsx';
  NoDataRow: boolean;
  // overViewData: OverviewReportOption;
  TabledataSource: MatTableDataSource<BPCReportOV>;
  // Doughnut chart
  public lineChartData: Array<number> = [33, 33];

  public labelMFL: Array<any> = [
    {
      data: this.lineChartData,
    }
  ];
  public lineChartOptions: any = {
    maintainAspectRatio: false,
    responsive: false,
    legend: false,
    cutoutPercentage: 65,

    plugins: {
      deferred: false
    },

  };
  public doughnutChartColors: Array<any> = [{
    backgroundColor: ['#fb9e61', '#3c9cdf']
  }];

  public ChartType = 'doughnut';

  // Bar char
  public barChartColors: Array<any> = [{
    backgroundColor: ['#3c9cdf', '#3c9cdf', '#3c9cdf', '#3c9cdf', '#3c9cdf']
  }];
  public barChartOptions: ChartOptions = {
    responsive: false,
    maintainAspectRatio: false,

    scales: {
      xAxes: [{
        gridLines: {
          drawTicks: false,
          display: false
        },
      }], yAxes: [{

      }]
    },

  };
  public barChartLabels: any[] = ['2006', '2007', '2008', '2009', '2010'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;

  public barChartData: ChartDataSets[] = [
    {
      data: [11, 12, 80, 81, 56], label: 'Rejected Material',
      barPercentage: 0.5,
    }

  ];



  constructor(private reportservice: ReportService) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.GetOverviewReport();
  }
  // tslint:disable-next-line:typedef
  GetOverviewReport() {
    this.reportservice.GetOverviewReports('Visu').subscribe(
      (data) => {
        // this.BPCReportOVData = data;
        this.TabledataSource = new MatTableDataSource(data);
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
        this.TabledataSource = new MatTableDataSource(data);
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
    if (this.TabledataSource._filterData.length === 0) {
      this.NoDataRow = true;
    }
    else {
      this.NoDataRow = false;
    }
  }

  // tslint:disable-next-line:typedef
  exportexcel(): void {

    const element = document.getElementById('exceltable');

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

}
