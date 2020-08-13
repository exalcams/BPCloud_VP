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
    menuItems: string[];
    authenticationDetails: AuthenticationDetails;
    currentUserID: Guid;
    currentUserName: string;
    currentUserRole = "";
    currentDisplayName: string;
    notificationSnackBarComponent: NotificationSnackBarComponent;
    isProgressBarVisibile: boolean;
    searchText = "";
    selectedPartnerID: string;
    selection = new SelectionModel<any>(true, []);
    todayDate: any;
    selectedFact: BPCFact;
    selectedAIACT: BPCOFAIACT;
    facts: BPCFact[] = [];
    actions: BPCOFAIACT[] = [];
    notifications: BPCOFAIACT[] = [];
    notificationCount: number;
    aIACTs: BPCOFAIACT[] = [];
    aIACTsView: BPCOFAIACT[] = [];
    SetIntervalID: any;
    constructor(
        private _factService: FactService,
        private _masterService: MasterService,
        private _dashboardService: DashboardService,
        private _router: Router,
        public snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {
        this.selectedFact = new BPCFact();
        this.selectedAIACT = new BPCOFAIACT();
        this.authenticationDetails = new AuthenticationDetails();
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(
            this.snackBar
        );
        this.isProgressBarVisibile = false;
        this.todayDate = new Date().getDate();
    }

    ngOnInit(): void {
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
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            },
            data: {
                datasets: [{
                    data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                    backgroundColor: ["#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed"],
                    label: 'dataset1'
                }
                    // ,{
                    //   data:[1],
                    //   backgroundColor:["#ff8f3d"],

                    //   label:'dataset1'
                    // },
                    // {
                    //   data:[0.1],
                    //   backgroundColor:["#6dd7d3"],
                    //   label:'dataset2'
                    // }
                ],


                labels: ['blue', 'orange', 'yellow', 'blue', 'pink', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange']
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
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            },
            data: {
                datasets: [{
                    data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                    backgroundColor: ["#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed"],

                    label: 'dataset1'
                }
                    // ,{
                    //   data:[1],
                    //   backgroundColor:["#ff8f3d"],

                    //   label:'dataset1'
                    // },
                    // {
                    //   data:[0.1],
                    //   backgroundColor:["#6dd7d3"],
                    //   label:'dataset2'
                    // }
                ],


                labels: ['blue', 'orange', 'yellow', 'blue', 'pink', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange']
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
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            },
            data: {
                datasets: [{
                    data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                    backgroundColor: ["#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed"],

                    label: 'dataset1'
                }
                    // ,{
                    //   data:[1],
                    //   backgroundColor:["#ff8f3d"],

                    //   label:'dataset1'
                    // },
                    // {
                    //   data:[0.1],
                    //   backgroundColor:["#6dd7d3"],
                    //   label:'dataset2'
                    // }
                ],


                labels: ['blue', 'orange', 'yellow', 'blue', 'pink', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange']
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
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            },
            data: {
                datasets: [{
                    data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                    backgroundColor: ["#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#1f76d3", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed", "#ebebed"],
                    label: 'dataset1'
                }
                    // ,{
                    //   data:[1],
                    //   backgroundColor:["#ff8f3d"],

                    //   label:'dataset1'
                    // },
                    // {
                    //   data:[0.1],
                    //   backgroundColor:["#6dd7d3"],
                    //   label:'dataset2'
                    // }
                ],


                labels: ['blue', 'orange', 'yellow', 'blue', 'pink', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange']
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
                    // ,{
                    //   data:[1],
                    //   backgroundColor:["#ff8f3d"],

                    //   label:'dataset1'
                    // },
                    // {
                    //   data:[0.1],
                    //   backgroundColor:["#6dd7d3"],
                    //   label:'dataset2'
                    // }
                ],


                labels: ['blue', 'orange', 'yellow', 'blue', 'pink', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange']
            }
        })
    }
}
