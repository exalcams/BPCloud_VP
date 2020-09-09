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
import { TourComponent } from "../tour/tour.component";
import { Chart, ChartType, ChartOptions } from "chart.js";
import { POService } from 'app/services/po.service';
import { Validators } from '@angular/forms';
import { BPCCEOMessage, BPCSCOCMessage } from 'app/models/Message.model';
import { FuseConfigService } from '@fuse/services/config.service';
@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
    public theme = 'blue';
    menuItems: string[] = [];
    authenticationDetails: AuthenticationDetails;
    IsProgressBarVisibile: boolean;
    selectedCEOMessage: BPCCEOMessage;
    selectedSCOCMessage: BPCSCOCMessage;
    i: any;
    a: any = 1;
    b: any = "#1f76d3";

    array1: any = [];

    color_75: any = [];
    color_90: any = [];
    fuseConfig: any;
    BGClassName: any;

    constructor(
        private dialog: MatDialog,
        private _POService: POService,
        private _router: Router,
        private _fuseConfigService: FuseConfigService
    ) {
        this.IsProgressBarVisibile = false;

        this.authenticationDetails = new AuthenticationDetails();
        this.selectedCEOMessage = new BPCCEOMessage();
        this.selectedSCOCMessage = new BPCSCOCMessage();
    }

    ngOnInit(): void {
        this.SetUserPreference();
        const retrievedObject = localStorage.getItem('authorizationData');
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
            this.menuItems = this.authenticationDetails.MenuItemNames.split(',');
            // if (this.menuItems.indexOf('User') < 0) {
            //   this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
            //   this._router.navigate(['/auth/login']);
            // }
            if (!this.authenticationDetails.TourStatus) {
                this.openTourScreenDialog();
            }
            // this.LoadBotChat();
            this.GetCEOMessage();
            this.GetSCOCMessage();
            this.LoadCharts();
        } else {
            this._router.navigate(['/auth/login']);
        }
    }

    openTourScreenDialog(): void {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.width = "50%";
        this.dialog.open(TourComponent, dialogConfig);
    }

    GetCEOMessage(): void {
        this.IsProgressBarVisibile = true;
        this._POService.GetCEOMessage().subscribe(
            (data) => {
                this.IsProgressBarVisibile = false;
                this.selectedCEOMessage = data as BPCCEOMessage;
                if (!this.selectedCEOMessage) {
                    this.selectedCEOMessage = new BPCCEOMessage();
                }
            },
            (err) => {
                console.error(err);
                this.IsProgressBarVisibile = false;
            }
        );
    }

    GetSCOCMessage(): void {
        this.IsProgressBarVisibile = true;
        this._POService.GetSCOCMessage().subscribe(
            (data) => {
                this.IsProgressBarVisibile = false;
                this.selectedSCOCMessage = data as BPCSCOCMessage;
                if (!this.selectedSCOCMessage) {
                    this.selectedSCOCMessage = new BPCSCOCMessage();
                }
            },
            (err) => {
                console.error(err);
                this.IsProgressBarVisibile = false;
            }
        );
    }

    LoadCharts(): void {
        for (this.i = 0; this.i <= 100; this.i++) {
            this.array1[this.i] = this.a;
        }

        for (this.i = 0; this.i <= 75; this.i++) {
            this.color_75[this.i] = this.b;
        }
        for (this.i = 0; this.i <= 90; this.i++) {
            this.color_90[this.i] = this.b;
        }
        new Chart("doughnut1", {
            type: "doughnut",
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 70,

                title: {
                    display: false,
                    text: "Doughnut chart",
                },

                legend: {
                    display: false,
                    position: "top",
                },
                plugins: {
                    labels: false,
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                },
            },
            data: {
                datasets: [
                    {
                        data: this.array1,
                        backgroundColor: this.color_75,

                        label: "dataset1",
                    },
                ],
            },
        });
        new Chart("doughnut2", {
            type: "doughnut",
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 70,

                title: {
                    display: false,
                    text: "Doughnut chart",
                },

                legend: {
                    display: false,
                    position: "top",
                },
                plugins: {
                    labels: false,
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                },
            },
            data: {
                datasets: [
                    {
                        data: this.array1,
                        backgroundColor: this.color_90,
                        label: "dataset1",
                    },
                ],
            },
        });
        new Chart("doughnut3", {
            type: "doughnut",
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 70,

                title: {
                    display: false,
                    text: "Doughnut chart",
                },

                legend: {
                    display: false,
                    position: "top",
                },
                plugins: {
                    labels: false,
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                },
            },
            data: {
                datasets: [
                    {
                        data: this.array1,
                        backgroundColor: this.color_90,
                        label: "dataset1",
                    },
                ],
            },
        });
        new Chart("doughnut4", {
            type: "doughnut",
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 70,

                title: {
                    display: false,
                    text: "Doughnut chart",
                },

                legend: {
                    display: false,
                    position: "top",
                },
                plugins: {
                    labels: false,
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                },
            },
            data: {
                datasets: [
                    {
                        data: this.array1,
                        backgroundColor: this.color_75,

                        label: "dataset1",
                    },
                ],
            },
        });

        new Chart("doughnut5", {
            type: "doughnut",
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 60,

                title: {
                    display: false,
                    text: "Doughnut chart",
                },

                legend: {
                    display: false,
                    position: "top",
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                },
            },
            data: {
                datasets: [
                    {
                        data: [69, 31],
                        backgroundColor: ["#1f76d3", "#ebebed"],
                        label: "dataset1",
                    },
                ],
            },
        });
    }

    LoadBotChat(): void {
        // (function (d, m) {
        //     var kommunicateSettings = { "appId": "10fd8a0b153726753ff1ad51af63846ce", "popupWidget": true, "automaticChatOpenOnNavigation": true };
        //     var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        //     s.src = "https://api.kommunicate.io/v2/kommunicate.app";
        //     var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        //     (window as any).kommunicate = m; m._globals = kommunicateSettings;
        // })(document, (window as any).kommunicate || {});
        // (function (d, m) {
        //   var kommunicateSettings = { "appId": "10fd8a0b153726753ff1ad51af63846ce", "popupWidget": true, "automaticChatOpenOnNavigation": true };
        //   var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        //   s.src = "https://api.kommunicate.io/v2/kommunicate.app";
        //   var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        //   (window as any).kommunicate = m; m._globals = kommunicateSettings;
        // })(document, (window as any).kommunicate || {});
    }
    SetUserPreference(): void {
        this._fuseConfigService.config
            .subscribe((config) => {
                this.fuseConfig = config;
                this.BGClassName = config;
            });
        // this._fuseConfigService.config = this.fuseConfig;
    }
}
