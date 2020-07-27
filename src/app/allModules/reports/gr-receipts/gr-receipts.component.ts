import { Component, OnInit } from '@angular/core';

import { Chart } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import * as XLSX from 'xlsx';
import { BPCReportGRR } from 'app/models/ReportModel';
import { ReportService } from 'app/services/report.service';
@Component({
  selector: 'app-gr-receipts',
  templateUrl: './gr-receipts.component.html',
  styleUrls: ['./gr-receipts.component.scss']
})
export class GRReceiptsComponent implements OnInit {

  isProgressBarVisibile: boolean;
  searchterm2: string;
  PartnerId: string;
  title = 'Bar Chart Example in Angular 4';
  chartOptions = {
    responsive: true,
    legend: {

      height: "2px",
      width: "2px"

    },
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          fontColor: "rgba(0,0,0,0.5)",
          fontStyle: "bold",
          beginAtZero: true,
          maxTicksLimit: 5,
          padding: 5,
          fontSize: 6,

        },


      }],
      xAxes: [{
        ticks: {
          fontColor: "rgba(0,0,0,0.5)",
          // fontStyle: "bold",
          fontSize: 6,
          beginAtZero: true,
          maxTicksLimit: 5,
          padding: 5
        },

        gridLines: {
          drawTicks: false,
          display: false
        },

      }],
    }
  }

  labels = ['17/04/2020', '18/04/2020', '19/04/2020', '20/04/2020', '21/04/2020'];
  chartData = [
    {

      label: 'planned',
      data: [70, 70, 60, 70, 80]

    },
    {
      label: 'actual',
      data: [65, 68, 80, 75, 59]

    }
  ];
  colors = [
    {

      backgroundColor: '#ff8f3d'
      //       backgroundColor:
      // "linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1))",

    },
    {

      fill: true,
      backgroundColor: '#1b69d0'
      // ,

    }
  ];


















  DataSource: MatTableDataSource<any>;
  DisplayColumns: any[] = ['ID', 'Client', 'Company', 'Type', 'PatnerID', 'Material', 'MaterialText', 'OrderQty', 'ReceivedQty', 'RejectedPPM', 'ReworkQty', 'Status'];
  fileName = 'ExcelSheet.xlsx';
  applyfilter(filterValue: string) { this.DataSource.filter = filterValue.trim().toLowerCase(); }
  constructor(private reportservice: ReportService) { }
  exportexcel(): void {

    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);


    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }

  ngOnInit(): void {

    new Chart('doughnut1', {
      type: 'doughnut',
      options: {
        responsive: false,
        maintainAspectRatio: false,
        cutoutPercentage: 40,

        title: {
          display: false,
          text: 'Doughnut chart'

        },

        legend: {
          display: false,
          position: 'top'

        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      },
      data: {
        datasets: [{
          data: [61, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, , 1],
          backgroundColor: ["#6dd7d3", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2", "#e2e2e2"],
          label: 'dataset1'
        }
          , {
          data: [1],
          backgroundColor: ["#ffffff"],

          label: 'dataset1'
        },
        {
          data: [0.1],
          backgroundColor: ["#6dd7d3"],
          label: 'dataset2'
        }
        ],


        labels: ['blue', 'orange', 'yellow', 'blue', 'pink', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange']
      }
    })



    this.PartnerId = "Visu";
    this.reportservice.GetAllReportGRRByPartnerID(this.PartnerId).subscribe(
      (data: BPCReportGRR[]) => {
        console.log(data);


        this.DataSource = new MatTableDataSource(data);
      });

  }


}
// this.PartnerId="Visu";
//     this.goodsresponsive_service.GetAllReportGRRByPartnerID(this.PartnerId).subscribe(  
//       (data: BPCReportGRR[]) => {        
//         console.log(data);    


//         this.DataSource = new MatTableDataSource(data);
//       });  



