import { Component, OnInit } from "@angular/core";
import { AuthenticationDetails, AppUsage } from "app/models/master";
import { NotificationSnackBarComponent } from "app/notifications/notification-snack-bar/notification-snack-bar.component";
import { MatSnackBar, MatDialog, MatDialogConfig } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { FactService } from "app/services/fact.service";
import { Router } from "@angular/router";
import { NotificationDialogComponent } from "app/notifications/notification-dialog/notification-dialog.component";
import { SnackBarStatus } from "app/notifications/notification-snack-bar/notification-snackbar-status-enum";
import { Guid } from "guid-typescript";
import { BPCFact } from "app/models/fact";
import { DashboardService } from "app/services/dashboard.service";
import { BPCOFAIACT } from "app/models/OrderFulFilment";
import { MasterService } from "app/services/master.service";
import { TranslateService, TranslatePipe } from "@ngx-translate/core";
import { TourComponent } from '../tour/tour.component';
import { Chart, ChartType, ChartOptions } from 'chart.js';
@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
    i: any;
    a: any = 1;
    b: any = "#1f76d3";

    array1: any = [];

    color_75: any = [];
    color_90: any = [];

    constructor() { }

    ngOnInit(): void {
        for (this.i = 0; this.i <= 100; this.i++) {
            this.array1[this.i] = this.a;
        }


        for (this.i = 0; this.i <= 75; this.i++) {
            this.color_75[this.i] = this.b
        }
        for (this.i = 0; this.i <= 90; this.i++) {
            this.color_90[this.i] = this.b
        }
        new Chart('doughnut1', {
            type: 'doughnut',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 70,

                title: {
                    display: false,
                    text: 'Doughnut chart'

                },

                legend: {
                    display: false,
                    position: 'top'

                },
                plugins: {
                    labels: false
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            },
            data: {
                datasets: [{
                    data: this.array1,
                    backgroundColor: this.color_75,


                    label: 'dataset1'

                }

                ],



            }
        })
        new Chart('doughnut2', {
            type: 'doughnut',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 70,

                title: {
                    display: false,
                    text: 'Doughnut chart'

                },

                legend: {
                    display: false,
                    position: 'top'

                },
                plugins: {
                    labels: false
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            },
            data: {
                datasets: [{
                    data: this.array1,
                    backgroundColor: this.color_90,
                    label: 'dataset1'
                }

                ],


            }
        })
        new Chart('doughnut3', {
            type: 'doughnut',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 70,

                title: {
                    display: false,
                    text: 'Doughnut chart'

                },

                legend: {
                    display: false,
                    position: 'top'

                },
                plugins: {
                    labels: false
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            },
            data: {
                datasets: [{
                    data: this.array1,
                    backgroundColor: this.color_90,
                    label: 'dataset1'
                }

                ],



            }
        })
        new Chart('doughnut4', {
            type: 'doughnut',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 70,

                title: {
                    display: false,
                    text: 'Doughnut chart'

                },

                legend: {
                    display: false,
                    position: 'top'

                },
                plugins: {
                    labels: false
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            },
            data: {
                datasets: [{
                    data: this.array1,
                    backgroundColor: this.color_75,


                    label: 'dataset1'

                }

                ],



            }
        })

        new Chart('doughnut5', {
            type: 'doughnut',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 60,

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
                    data: [69, 31],
                    backgroundColor: ["#1f76d3", "#ebebed"],
                    label: 'dataset1'
                }

                ],



            }
        })

    }
}
