import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BPCReportFGCPS } from 'app/models/ReportModel';
import { ReportService } from 'app/services/report.service';
import * as Chart from 'chart.js';
import { title } from 'process';

@Component({
  selector: 'app-fg-child-part-stock',
  templateUrl: './fg-child-part-stock.component.html',
  styleUrls: ['./fg-child-part-stock.component.scss']
})
export class FGChildPartStockComponent implements OnInit {

  isProgressBarVisibile: boolean;
  selected = 'All';
  tableDataSource: MatTableDataSource<any>;
  tableDisplayedColumns: string[] = ['plant', 'material', 'materialtext', 'stickqty', 'UOM', 'batch', 'price'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  form: FormGroup;
  constructor(private formbuilder: FormBuilder, private _reportService: ReportService) {
    this.form = this.formbuilder.group({
      fgmaterial: ['', Validators.required],
      childmaterial: ['', Validators.required]
    });
  }

  ngOnInit(): void {

      // tslint:disable-next-line:label-position
      // Public: title : String;
    const myChart = new Chart("myChart", {
      type: 'doughnut',
      data: {
        // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          // label: '# of Votes',
          data: [60, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          backgroundColor:
            ["#6dd7d3", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey",
              "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey",
              "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey",
              "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey"],
              hoverBackgroundColor: ["#6dd7d3"],
          // borderColor: [
          //   'rgba(255, 99, 132, 1)',
          //   'rgba(54, 162, 235, 1)',
          //   'rgba(255, 206, 86, 1)',
          //   'rgba(75, 192, 192, 1)',
          //   'rgba(153, 102, 255, 1)',
          //   'rgba(255, 159, 64, 1)'
          // ],
          borderWidth: 2
        }, {
          data: [100],
          backgroundColor: ["white"],

        }, {
          data: [90],
          // hoverBackgroundColor: ["#6dd7d3"],
          borderColor: ["#6dd7d3"],
          // borderWidth: 5
        }]
      },
      options: {
        responsive: true,
        cutoutPercentage: 50,
        plugins: {
          labels: false
        },
        tooltips: {
          enabled: false
        },
        legend: {
          display: false
        },
        animation: {
          animateRotate: true,
          animateScale: true
        },
        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       beginAtZero: true
        //     }
        //   }]
        // }
      }
    });




    const myChart1 = new Chart("myChart1", {
      type: 'doughnut',
      data: {
        // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          // label: '# of Votes',
          data: [30, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          backgroundColor:
            ["#6dd7d3", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey",
              "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey",
              "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey",
              "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey", "lightgrey"],
              hoverBackgroundColor: ["#6dd7d3"],
          // borderColor: [
          //   'rgba(255, 99, 132, 1)',
          //   'rgba(54, 162, 235, 1)',
          //   'rgba(255, 206, 86, 1)',
          //   'rgba(75, 192, 192, 1)',
          //   'rgba(153, 102, 255, 1)',
          //   'rgba(255, 159, 64, 1)'
          // ],
          borderWidth: 2
        }, {
          data: [100],
          backgroundColor: ["white"],

        }, {
          data: [90],
          // hoverBackgroundColor: ["#6dd7d3"],
          borderColor: ["#6dd7d3"],
          // borderWidth: 5
        }]
      },
      options: {
        responsive: true,
        cutoutPercentage: 50,
        plugins: {
          labels: false
        },
        tooltips: {
          enabled: false
        },
        legend: {
          display: false
        },
        animation: {
          animateRotate: true,
          animateScale: true
        },
        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       beginAtZero: true
        //     }
        //   }]
        // }
      }
    });



    this._reportService.GetAllReportFGCPSByPartnerID().subscribe(
      (data: BPCReportFGCPS[]) => {
        console.log(data);
        this.tableDataSource = new MatTableDataSource(data);
      });
  }

  search(): void {
    console.log(this.form.value);
    const fgmaterial = this.form.get('fgmaterial').value;
    const childmaterial = this.form.get('childmaterial').value;
    if (fgmaterial !== null && childmaterial !== null) {
      this._reportService.getData(fgmaterial, childmaterial).subscribe((data: any) => {
        console.log(data);
        this.tableDataSource = new MatTableDataSource(data);
      });
    }
    if (fgmaterial !== null) {
      this._reportService.getfgmaterial(fgmaterial).subscribe((data: any) => {
        console.log(data);
        this.tableDataSource = new MatTableDataSource(data);
      });
    }
    else if (childmaterial != null) {
      this._reportService.getchildmaterial(childmaterial).subscribe((data: any) => {
        console.log(data);
        this.tableDataSource = new MatTableDataSource(data);
      });
    }
  }

  applyfilter(filterValue: string): void {
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

}
