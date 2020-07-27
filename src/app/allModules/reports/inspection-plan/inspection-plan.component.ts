import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from 'app/services/report.service';
import { BPCReportIP } from 'app/models/ReportModel';
import { ExcelService } from 'app/services/excel.service';
import * as XLSX from 'xlsx';
import { ChartsModule } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
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
  public TempData = [];
  data = [];
  chart = false;
  // Rightside Chart 
  public lineChartData: Array<number> = [32.5, 33, 33];

  public labelMFL: Array<any> = [
    {
      data: this.lineChartData,
    }
  ];
  public lineChartOptions: any = {
    maintainAspectRatio: false,
    responsive: false,
    cutoutPercentage: 70,
    borderWidth: 5,
    plugins: {
      deferred: false
    }
  };

  public doughnutChartColors: Array<any> = [{
    backgroundColor: ['#3c9cdf', '#fddc0e', '#58dfa7']

  }];

  // LeftsideChart
  // public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartOptions: ChartOptions = {
    responsive: false,
    maintainAspectRatio: false,
  };
  public barChartType: ChartType = 'doughnut';
  public barChartLegend = false;

  public barChartData: ChartDataSets[] = [
    { data: [] }
  ];
  public doughnutChartColors2: Array<any> = [{
    backgroundColor: ['#58dfa7']

  }];
  public ChartType = 'doughnut';


  constructor(private reportservice: ReportService, private _excelService: ExcelService) { }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    if (this.GetAllReportIPByPartnerID()) {
      this.chart = true;
    }

  }
  // tslint:disable-next-line:typedef
  GetAllReportIPByPartnerID(): any {
    this.reportservice.GetAllReportIPByPartnerID("Visu").subscribe(
      (data) => {
        console.log(data);
        this.TabledataSource = new MatTableDataSource(data);
        this.isProgressBarVisibile = false;
        this.TempData = data;
      }
    );
    return true;
  }
  GetOverviewReportByOption1(): void {

  }
  GetOverviewReportByOption2(): void {

  }
  // tslint:disable-next-line:typedef
  GetFilteredReportIPByPartnerID() {
    this.reportservice.GetFilteredReportIPByPartnerID("Visu", this.material, this.inspectionMethod).subscribe(
      (data) => {
        this.TabledataSource = new MatTableDataSource(data);
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.TabledataSource.filter = filterValue.trim().toLowerCase();

  }
  exportexcel(): void {

    const element = document.getElementById('exceltable');

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
  public randomize(): void {
    // Only Change 3 values
    this.data = [];
    console.log(this.TempData.length);
    const len = this.TempData.length;
    this.data.push(len);

    for (let i = len; i <= 100; i++) {
      this.data.push(1);
    }
    this.barChartData[0].data = this.data;
  }
}
