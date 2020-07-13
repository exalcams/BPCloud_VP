import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatMenuTrigger, MatDialogConfig, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthenticationDetails } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ChartType } from 'chart.js';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import {
    OfStatus, DashboardGraphStatus, OTIFStatus, QualityStatus,
    FulfilmentStatus, Deliverystatus, OfType, OfOption
} from 'app/models/Dashboard';
import { DatePipe } from '@angular/common';
import { BPCOFHeader, OfAttachmentData } from 'app/models/OrderFulFilment';
import { DashboardService } from 'app/services/dashboard.service';
import { AttachmentViewDialogComponent } from '../attachment-view-dialog/attachment-view-dialog.component';
import { BPCInvoiceAttachment } from 'app/models/ASN';
@Component({
    selector: 'app-order-fulfilment-center',
    templateUrl: './order-fulfilment-center.component.html',
    styleUrls: ['./order-fulfilment-center.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class OrderFulFilmentCenterComponent implements OnInit {
    authenticationDetails: AuthenticationDetails;
    currentUserID: Guid;
    currentUserRole: string;
    partnerID: string;
    menuItems: string[];
    notificationSnackBarComponent: NotificationSnackBarComponent;
    attachmentViewDialogComponent: AttachmentViewDialogComponent;
    isProgressBarVisibile: boolean;
    isDateError: boolean;
    ofDetails: BPCOFHeader[] = [];
    filteredOfDetails: BPCOFHeader[] = [];
    ofAttachments: BPCInvoiceAttachment[] = [];
    ofDetailsFormGroup: FormGroup;
    ofOption: OfOption;
    ofDetailsDisplayedColumns: string[] = [
        'DocNumber',
        'DocVersion',
        'DocType',
        'DocDate',
        'PlantName',
        'Status',
        'Document',
        'NextProcess',
        'Action'
    ];
    ofDetailsDataSource: MatTableDataSource<BPCOFHeader>;
    @ViewChild(MatPaginator) ofDetailsPaginator: MatPaginator;
    @ViewChild(MatSort) ofDetailsSort: MatSort;
    @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;
    selection = new SelectionModel<any>(true, []);
    Fulfilments: any[] = [];
    DeliveryStatus: any[] = [];
    ofStatusOptions: OfStatus[] = [
        { Value: 'All', Name: 'All' },
        { Value: 'DueForACK', Name: 'Due for ACK' },
        { Value: 'DueForASN', Name: 'Due for ASN' },
        { Value: 'DueForGate', Name: 'Due for Gate' },
        { Value: 'DueForGRN', Name: 'Due for GRN' }
    ];
    ofTypeOptions: OfType[] = [
        { Value: 'All', Name: 'All' },
        { Value: 'Material', Name: 'Material' },
        { Value: 'Service', Name: 'Service' },
        { Value: 'Framework', Name: 'Framework' },
        { Value: 'Contract', Name: 'Contract' },
        { Value: 'Subcon', Name: 'Subcon' }
    ];
    searchText = '';
    FilterVal = 'All';
    ActionModel = 'Acknowledge';
    DashboardGraphStatus: DashboardGraphStatus = new DashboardGraphStatus();
    OTIFStatus: OTIFStatus = new OTIFStatus();
    QualityStatus: QualityStatus = new QualityStatus();
    fulfilmentStatus: FulfilmentStatus = new FulfilmentStatus();
    dashboardDeliverystatus: Deliverystatus = new Deliverystatus();
    selectedPoDetails: BPCOFHeader = new BPCOFHeader();

    // Circular Progress bar
    radius = 60;
    circumference = 2 * Math.PI * this.radius;
    dashoffset1: number;
    dashoffset2: number;
    progressPercentage1 = 0;
    progressPercentage2 = 0;
    nextProcess: string;

    // Doughnut Chart
    public doughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: 'left',
            labels: {
                fontSize: 10,
                padding: 20,
                usePointStyle: true
            }
        },
        cutoutPercentage: 80,
        elements: {
            arc: {
                borderWidth: 0
            }
        },
        plugins: {
            labels: {
                // tslint:disable-next-line:typedef
                render: function (args) {
                    return args.value + '%';
                },
                fontColor: '#000',
                position: 'outside'
            }
        }
    };
    public doughnutChartType: ChartType = 'doughnut';
    public doughnutChartLabels: any[] = ['Due for ACK', 'Due for ASN', 'Due for Gate', 'Due for GRN'];
    // public doughnutChartData: any[] = [
    //     [40, 20, 30, 10]
    // ];
    public doughnutChartData: any[] = [];
    public colors: any[] = [{ backgroundColor: ['#fb863a', '#40a8e2', '#485865', '#40ed9a'] }];

    // Bar chart
    public barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: 'top',
            align: 'end',
            labels: {
                fontSize: 10,
                usePointStyle: true
            }
        },
        // // We use these empty structures as placeholders for dynamic theming.
        scales: {
            xAxes: [{
                barPercentage: 1.3,
                categoryPercentage: -0.5
            }],
            yAxes: [{
                ticks: {
                    stepSize: 25,
                    beginAtZero: true
                }
            }],
        },
        plugins: {
            labels: {
                // tslint:disable-next-line:typedef
                render: function (args) {
                    return args.value + '%';
                },
                fontColor: '#000',
                position: 'outside'
            }
        }
        // plugins: [{
        //     // tslint:disable-next-line:typedef
        //     beforeInit: function (chart, options) {
        //         // tslint:disable-next-line:typedef
        //         chart.legend.afterFit = function () {
        //             this.height += 100; // must use `function` and not => because of `this`
        //         };
        //     }
        // }]
    };
    @ViewChild('barCanvas') barCanvas: ElementRef;
    // public barChartLabels: any[] = ['17/02/20', '18/02/20', '19/02/20', '20/02/20', '21/02/20'];
    barChartLabels: any[] = [];
    date1 = new Date;
    date2 = new Date;
    date3 = new Date;
    date4 = new Date;
    date5 = new Date;

    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    // public barChartData: any[] = [
    //     { data: [45, 70, 65, 20, 80], label: 'Actual' },
    //     { data: [87, 50, 40, 71, 56], label: 'Planned' }
    // ];
    barChartData: any[] = [{ data: [], label: 'Actual' },
    { data: [], label: 'Planned' },
    ];
    public barColors: any[] = [{ backgroundColor: '#40a8e2' }, { backgroundColor: '#fb863a' }];

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        public snackBar: MatSnackBar,
        public _dashboardService: DashboardService,
        private datePipe: DatePipe,
        private dialog: MatDialog,
    ) {
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.authenticationDetails = new AuthenticationDetails();
        this.isProgressBarVisibile = false;
        this.date1.setDate(this.date1.getDate());
        this.date2.setDate(this.date2.getDate() - 1);
        this.date3.setDate(this.date3.getDate() - 2);
        this.date4.setDate(this.date2.getDate() - 2);
        this.date5.setDate(this.date2.getDate() - 3);
        const dat1 = this.datePipe.transform(this.date1, 'dd/MM/yyyy');
        const dat2 = this.datePipe.transform(this.date2, 'dd/MM/yyyy');
        const dat3 = this.datePipe.transform(this.date3, 'dd/MM/yyyy');
        const dat4 = this.datePipe.transform(this.date4, 'dd/MM/yyyy');
        const dat5 = this.datePipe.transform(this.date5, 'dd/MM/yyyy');
        this.barChartLabels = [dat1, dat2, dat3, dat4, dat5];
        this.Fulfilments = [
            {
                'name': 'Open',
                'value': 40,
                'label': '40%'
            },
            {
                'name': 'Scheduled',
                'value': 20,
                'label': '20%'
            },
            {
                'name': 'In Progress',
                'value': 30,
                'label': '30%'
            },
            {
                'name': 'Pending',
                'value': 10,
                'label': '10%'
            }
        ];
        this.DeliveryStatus = [
            {
                'name': '17/02/20',
                'series': [
                    {
                        'name': 'Planned',
                        'value': 88
                    },
                    {
                        'name': 'Actual',
                        'value': 70
                    }
                ]
            },

            {
                'name': '18/02/20',
                'series': [
                    {
                        'name': 'Planned',
                        'value': 60
                    },
                    {
                        'name': 'Actual',
                        'value': 88
                    }
                ]
            },
            {
                'name': '19/02/20',
                'series': [
                    {
                        'name': 'Planned',
                        'value': 40
                    },
                    {
                        'name': 'Actual',
                        'value': 88
                    }
                ]
            },
        ];
    }

    ngOnInit(): void {
        // Retrive authorizationData
        const retrievedObject = localStorage.getItem('authorizationData');
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
            this.currentUserID = this.authenticationDetails.UserID;
            this.partnerID = this.authenticationDetails.UserName;
            this.currentUserRole = this.authenticationDetails.UserRole;
            this.menuItems = this.authenticationDetails.MenuItemNames.split(',');
            // console.log(this.authenticationDetails);
            if (this.menuItems.indexOf('OrderFulFilmentCenter') < 0) {
                this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
                );
                this._router.navigate(['/auth/login']);
            }

        } else {
            this._router.navigate(['/auth/login']);
        }
        this.initialiseOfDetailsFormGroup();
        this.GetOfDetails();
        this.GetOfGraphDetailsByPartnerID();
        this.GetOfStatusByPartnerID();
        // this.GetOfAttachmentsByPartnerID();
    }

    GetOfDetails(): void {
        this.isProgressBarVisibile = true;
        this._dashboardService
            .GetOfsByPartnerID(this.partnerID)
            .subscribe((data) => {
                if (data) {
                    this.ofDetails = <BPCOFHeader[]>data;
                    this.ofDetailsDataSource = new MatTableDataSource(this.ofDetails);
                    this.ofDetailsDataSource.paginator = this.ofDetailsPaginator;
                    this.ofDetailsDataSource.sort = this.ofDetailsSort;
                }
                this.isProgressBarVisibile = false;
            },
                (err) => {
                    console.error(err);
                    this.isProgressBarVisibile = false;
                });
    }

    GetOfsByOption(ofOption: OfOption): void {
        this.isProgressBarVisibile = true;
        this._dashboardService.GetOfsByOption(ofOption)
            .subscribe((data) => {
                if (data) {
                    this.ofDetails = <BPCOFHeader[]>data;
                    this.ofDetailsDataSource = new MatTableDataSource(this.ofDetails);
                    this.ofDetailsDataSource.paginator = this.ofDetailsPaginator;
                    this.ofDetailsDataSource.sort = this.ofDetailsSort;
                }
                this.isProgressBarVisibile = false;
            },
                (err) => {
                    console.error(err);
                    this.isProgressBarVisibile = false;
                    this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                });
        this.clearOfDetailsFormGroup();
    }

    GetOfStatusByPartnerID(): void {
        this.isProgressBarVisibile = true;
        this._dashboardService
            .GetOfStatusByPartnerID(this.partnerID)
            .subscribe((data) => {
                if (data) {
                    this.fulfilmentStatus = <FulfilmentStatus>data;
                    if (this.fulfilmentStatus) {
                        this.doughnutChartData = [this.fulfilmentStatus.OpenDetails.Value, this.fulfilmentStatus.ScheduledDetails.Value,
                        this.fulfilmentStatus.InProgressDetails.Value, this.fulfilmentStatus.PendingDetails.Value];
                    }
                }
                this.isProgressBarVisibile = false;
            },
                (err) => {
                    console.error(err);
                    this.isProgressBarVisibile = false;
                });
    }

    GetOfGraphDetailsByPartnerID(): void {
        this.isProgressBarVisibile = true;
        this._dashboardService
            .GetOfGraphDetailsByPartnerID(this.partnerID)
            .subscribe((data) => {
                if (data) {
                    this.DashboardGraphStatus = <DashboardGraphStatus>data;
                    this.dashboardDeliverystatus = this.DashboardGraphStatus.deliverystatus;
                    this.OTIFStatus = this.DashboardGraphStatus.oTIFStatus;
                    this.QualityStatus = this.DashboardGraphStatus.qualityStatus;
                    this.fulfilmentStatus = this.DashboardGraphStatus.fulfilmentStatus;
                    const OTIF = Number(this.OTIFStatus.OTIF);
                    this.progress1(OTIF);
                    const Quality = Number(this.QualityStatus.Quality);
                    this.progress2(Quality);
                    // this.doughnutChartData = [this.fulfilmentStatus.OpenDetails.Value, this.fulfilmentStatus.ScheduledDetails.Value,
                    // this.fulfilmentStatus.InProgressDetails.Value, this.fulfilmentStatus.PendingDetails.Value];
                    // this.dashboardDeliverystatus.Planned1.Date = this.dashboardDeliverystatus.Planned1.Date 
                    const Planned1Date = this.datePipe.transform(this.dashboardDeliverystatus.Planned1.Date, 'dd/MM/yyyy');
                    const Planned2Date = this.datePipe.transform(this.dashboardDeliverystatus.Planned2.Date, 'dd/MM/yyyy');
                    const Planned3Date = this.datePipe.transform(this.dashboardDeliverystatus.Planned3.Date, 'dd/MM/yyyy');
                    const Planned4Date = this.datePipe.transform(this.dashboardDeliverystatus.Planned4.Date, 'dd/MM/yyyy');
                    const Planned5Date = this.datePipe.transform(this.dashboardDeliverystatus.Planned4.Date, 'dd/MM/yyyy');

                    // this.barChartLabels = [Planned1Date, Planned2Date, Planned3Date, Planned4Date, Planned5Date];
                    this.barChartData = [
                        {
                            data: [this.dashboardDeliverystatus.Planned1.Actual, this.dashboardDeliverystatus.Planned2.Actual,
                            this.dashboardDeliverystatus.Planned3.Actual,
                            this.dashboardDeliverystatus.Planned4.Actual, this.dashboardDeliverystatus.Planned5.Actual], label: 'Actual'
                        },
                        {
                            data: [this.dashboardDeliverystatus.Planned1.Planned, this.dashboardDeliverystatus.Planned2.Planned,
                            this.dashboardDeliverystatus.Planned3.Planned, this.dashboardDeliverystatus.Planned4.Planned,
                            this.dashboardDeliverystatus.Planned5.Planned], label: 'Planned'
                        }
                    ];
                    console.log(this.barChartData);
                    console.log(this.barChartLabels);
                    console.log(this.DashboardGraphStatus);
                }
                this.isProgressBarVisibile = false;
            },
                (err) => {
                    console.error(err);
                    this.isProgressBarVisibile = false;
                });
    }

    GetOfAttachmentsByPartnerIDAndDocNumber(docNumber: string): void {
        this.isProgressBarVisibile = true;
        this._dashboardService.GetOfAttachmentsByPartnerIDAndDocNumber(this.authenticationDetails.UserName, docNumber)
            .subscribe((data) => {
                if (data) {
                    this.ofAttachments = data as BPCInvoiceAttachment[];
                    console.log(this.ofAttachments);
                    const ofAttachmentData = new OfAttachmentData();
                    ofAttachmentData.DocNumber = docNumber;
                    ofAttachmentData.OfAttachments = this.ofAttachments;
                    this.openAttachmentViewDialog(ofAttachmentData);
                }
                this.isProgressBarVisibile = false;
            },
                (err) => {
                    console.error(err);
                    this.isProgressBarVisibile = false;
                });
    }

    initialiseOfDetailsFormGroup(): void {
        this.ofDetailsFormGroup = this._formBuilder.group({
            FromDate: [''],
            ToDate: [''],
            Status: [''],
            DocType: ['']
        });
    }

    clearOfDetailsFormGroup(): void {
        Object.keys(this.ofDetailsFormGroup.controls).forEach(key => {
            this.ofDetailsFormGroup.get(key).markAsTouched();
            this.ofDetailsFormGroup.get(key).markAsDirty();
        });
    }

    getOfDetailsFormValues(): void {

    }

    getOfsByOptionClicked(): void {
        if (this.ofDetailsFormGroup.valid) {
            if (!this.isDateError) {
                this.ofOption = new OfOption();
                this.ofOption.FromDate = this.datePipe.transform(this.ofDetailsFormGroup.get('FromDate').value as Date, 'yyyy-MM-dd');
                this.ofOption.ToDate = this.datePipe.transform(this.ofDetailsFormGroup.get('ToDate').value as Date, 'yyyy-MM-dd');
                this.ofOption.Status = this.ofDetailsFormGroup.get('Status').value;
                this.ofOption.DocType = this.ofDetailsFormGroup.get('DocType').value;
                this.ofOption.PartnerID = this.partnerID;
                this.GetOfsByOption(this.ofOption);
            }
        }
    }

    doughnutChartClicked(e: any): void {
        console.log(e);
        if (e.active.length > 0) {
            const chart = e.active[0]._chart;
            const activePoints = chart.getElementAtEvent(e.event);
            if (activePoints.length > 0) {
                // get the internal index of slice in pie chart
                const clickedElementIndex = activePoints[0]._index;
                const label = chart.data.labels[clickedElementIndex];
                // get value by index
                const value = chart.data.datasets[0].data[clickedElementIndex];
                console.log(clickedElementIndex, label, value);
                if (label !== null) {
                    this.loadOfDetailsByOfStatusChartLabel(label);
                }
            }
        }
    }

    loadOfDetailsByOfStatusChartLabel(label: any): void {
        if (label === "Due for ACK") {
            // this.filteredOfDetails = this.ofDetails.filter(x => x.Status === 'DueForACK');
            this.ofDetailsDataSource = null;
            this.ofOption = new OfOption();
            this.ofOption.Status = "DueForACK";
            this.ofOption.PartnerID = this.partnerID;
            this.GetOfsByOption(this.ofOption);
        }
        else if (label === "Due for ASN") {
            this.ofDetailsDataSource = null;
            this.ofOption = new OfOption();
            this.ofOption.Status = "DueForASN";
            this.ofOption.PartnerID = this.partnerID;
            this.GetOfsByOption(this.ofOption);
        }
        else if (label === "Due for Gate") {
            this.ofDetailsDataSource = null;
            this.ofOption = new OfOption();
            this.ofOption.Status = "DueForGate";
            this.ofOption.PartnerID = this.partnerID;
            this.GetOfsByOption(this.ofOption);
        }
        else if (label === "Due for GRN") {

            this.ofDetailsDataSource = null;
            this.ofOption = new OfOption();
            this.ofOption.Status = "DueForGRN";
            this.ofOption.PartnerID = this.partnerID;
            this.GetOfsByOption(this.ofOption);
        }

    }

    openMyMenu(index: any): void {
        alert(index);
        this.matMenuTrigger.openMenu();

    }

    closeMyMenu(index: any): void {
        alert(index);
        this.matMenuTrigger.closeMenu();
    }

    fromAndToDateChanged(): void {
        const FROMDATEVAL = this.ofDetailsFormGroup.get('FromDate').value as Date;
        const TODATEVAL = this.ofDetailsFormGroup.get('ToDate').value as Date;
        if (FROMDATEVAL && TODATEVAL && FROMDATEVAL > TODATEVAL) {
            this.isDateError = true;
        } else {
            this.isDateError = false;
        }
    }

    goToPOFactSheetClicked(po: string): void {
        this._router.navigate(['/pages/polookup'], { queryParams: { id: po } });
    }

    acknowledgementClicked(po: string): void {
        this._router.navigate(['/pages/polookup'], { queryParams: { id: po } });
    }

    goToPOFlipClicked(po: string): void {
        this._router.navigate(['/pages/poflip'], { queryParams: { id: po } });
    }

    goToASNClicked(po: string): void {
        this._router.navigate(['/pages/asn'], { queryParams: { id: po } });
    }

    goToSubconClicked(po: string): void {
        this._router.navigate(['/subcon'], { queryParams: { id: po } });

    }

    nextProcessClicked(nextProcess: string, po: string): void {
        if (nextProcess === 'ACK') {
            this._router.navigate(['/pages/polookup'], { queryParams: { id: po } });
        }
        else if (nextProcess === 'ASN') {
            this._router.navigate(['/pages/asn'], { queryParams: { id: po } });
        }
    }

    onMouseMove(event): void {
        console.log(event); // true false
        // if true then the mouse is on control and false when you leave the mouse
    }

    progress1(value: number): void {
        // alert(value);
        const progress = value / 100;
        this.progressPercentage1 = Math.round(progress * 100);
        this.dashoffset1 = this.circumference * (progress);
        // console.log(this.progressPercentage1);
    }

    progress2(value: number): void {
        // alert(value);
        const progress = value / 100;
        this.progressPercentage2 = Math.round(progress * 100);
        this.dashoffset2 = this.circumference * (progress);
        // console.log(this.progressPercentage2);
    }

    formatSubtitle = (): string => {
        return 'Effiency';
    }

    pieChartLabel(Fulfilments: any[], name: string): string {
        const item = Fulfilments.filter(data => data.name === name);
        if (item.length > 0) {
            return item[0].label;
        }
        return name;
    }

    getStatusColor(element: BPCOFHeader, StatusFor: string): string {
        switch (StatusFor) {
            case 'ASN':
                return element.Status === 'DueForACK' ? 'gray' : element.Status === 'DueForASN' ? '#efb577' : '#34ad65';
            case 'Gate':
                return element.Status === 'DueForACK' ? 'gray' : element.Status === 'DueForASN' ? 'gray' :
                    element.Status === 'DueForGate' ? '#efb577' : '#34ad65';
            case 'GRN':
                return element.Status === 'DueForACK' ? 'gray' : element.Status === 'DueForASN' ? 'gray' :
                    element.Status === 'DueForGate' ? 'gray' :
                        element.Status === 'DueForGRN' ? '#efb577' : '#34ad65';
            default:
                return '';
        }
    }

    getNextProcess(element: any): void {
        if (element.Status === 'DueForACK') {
            element.NextProcess = 'ACK';
        }
        else if (element.Status === 'DueForASN') {
            element.NextProcess = 'ASN';
        }
        else if (element.Status === 'DueForGate') {
            element.NextProcess = 'Gate';
        }
        else {
            element.NextProcess = 'GRN';
        }

    }

    getTimeline(element: BPCOFHeader, StatusFor: string): string {
        switch (StatusFor) {
            case 'ASN':
                return element.Status === 'DueForACK' ? 'white-timeline' : element.Status === 'DueForASN' ? 'orange-timeline' :
                    'green-timeline';
            case 'Gate':
                return element.Status === 'DueForACK' ? 'white-timeline' : element.Status === 'DueForASN' ? 'white-timeline' :
                    element.Status === 'DueForGate' ? 'orange-timeline' : 'green-timeline';
            case 'GRN':
                return element.Status === 'DueForACK' ? 'white-timeline' : element.Status === 'DueForASN' ? 'white-timeline' :
                    element.Status === 'DueForGate' ? 'white-timeline' :
                        element.Status === 'DueForGRN' ? 'orange-timeline' : 'green-timeline';
            default:
                return '';
        }
    }

    getRestTimeline(element: BPCOFHeader, StatusFor: string): string {
        switch (StatusFor) {
            case 'ASN':
                return element.Status === 'DueForACK' ? 'white-timeline' : element.Status === 'DueForASN' ? 'white-timeline' :
                    'green-timeline';
            case 'Gate':
                return element.Status === 'DueForACK' ? 'white-timeline' : element.Status === 'DueForASN' ? 'white-timeline' :
                    element.Status === 'DueForGate' ? 'white-timeline' : 'green-timeline';
            case 'GRN':
                return element.Status === 'DueForACK' ? 'white-timeline' : element.Status === 'DueForASN' ? 'white-timeline' :
                    element.Status === 'DueForGate' ? 'white-timeline' :
                        element.Status === 'DueForGRN' ? 'white-timeline' : 'green-timeline';
            default:
                return '';
        }
    }

    viewOfAttachmentClicked(element: BPCOFHeader): void {
        // const attachments = this.ofAttachments.filter(x => x.AttachmentID.toString() === element.RefDoc);
        this.GetOfAttachmentsByPartnerIDAndDocNumber(element.DocNumber);
    }

    openAttachmentViewDialog(ofAttachmentData: OfAttachmentData): void {

        const dialogConfig: MatDialogConfig = {
            data: ofAttachmentData,
            panelClass: 'attachment-view-dialog'
        };
        const dialogRef = this.dialog.open(AttachmentViewDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }
}

