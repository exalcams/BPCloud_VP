import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthenticationDetails, UserWithRole } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'app/services/master.service';
import { Router } from '@angular/router';
import { Task } from 'app/models/task';
import { ProjectService } from 'app/services/project.service';
import { Guid } from 'guid-typescript';
import { DashboardService } from 'app/services/dashboard.service';
import { ShareParameterService } from 'app/services/share-parameters.service';
import { ChartType } from 'chart.js';
import { FuseConfigService } from '@fuse/services/config.service';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { PO, POSearch, Status } from 'app/models/Dashboard';
import { DatePipe } from '@angular/common';
// import 'chartjs-plugin-annotation';
// import 'chart.piecelabel.js';
// import 'chartjs-plugin-labels';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DashboardComponent implements OnInit {
    authenticationDetails: AuthenticationDetails;
    currentUserID: Guid;
    currentUserRole: string;
    MenuItems: string[];
    notificationSnackBarComponent: NotificationSnackBarComponent;
    IsProgressBarVisibile: boolean;
    AllOwners: UserWithRole[] = [];
    AllTasks: Task[] = [];
    AllTasksCount: number;
    AllNewTasksCount: number;
    AllOpenTasksCount: number;
    AllEscalatedTasksCount: number;
    AllReworkTasksCount: number;
    posDisplayedColumns: string[] = [
        'PO',
        'Version',
        'PODate',
        'Status',
        'Document',
        'NextProcess',
        'Action'
    ];
    poFormGroup: FormGroup;
    isDateError: boolean;
    poSearch: POSearch;
    posDataSource: MatTableDataSource<PO>;
    @ViewChild(MatPaginator) poPaginator: MatPaginator;
    // @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) poSort: MatSort;
    selection = new SelectionModel<any>(true, []);
    AllTickets: any[] = [];
    AllActivities: any[] = [];
    Fulfilments: any[] = [];
    donutChartData: any[] = [];
    DeliveryStatus: any[] = [];
    Status: Status[] = [{ Value: 'All', Name: 'All' },
    { Value: 'Open', Name: 'Open' },
    { Value: 'Completed', Name: 'Completed' },
        // { Value: 'All', Name: 'All' },
    ]
    // foods: string[] = [
    //     {value: 'steak-0', viewValue: 'Steak'},
    //     {value: 'pizza-1', viewValue: 'Pizza'},
    //     {value: 'tacos-2', viewValue: 'Tacos'}
    //   ];
    searchText = '';
    FilterVal = 'All';
    ActionModel = 'Acknowledge';
    Pos: PO[] = [];
    selectedPORow: PO = new PO();

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
    public doughnutChartLabels: any[] = ['Open', 'Scheduled', 'In Progress', 'Pending'];
    public doughnutChartData: any[] = [
        [40, 20, 30, 10]
    ];
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
    public barChartLabels: any[] = ['17/02/20', '18/02/20', '19/02/20', '20/02/20', '21/02/20'];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartData: any[] = [
        { data: [45, 70, 65, 20, 80], label: 'Actual' },
        { data: [87, 50, 40, 71, 56], label: 'Planned' }
    ];
    public barColors: any[] = [{ backgroundColor: '#40a8e2' }, { backgroundColor: '#fb863a' }];

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        public snackBar: MatSnackBar,
        public _dashboardService: DashboardService,
        private datePipe: DatePipe,
    ) {
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.authenticationDetails = new AuthenticationDetails();
        this.IsProgressBarVisibile = false;
        this.progress1(85);
        this.progress2(99);
        this.poFormGroup = this._formBuilder.group({
            FromDate: [''],
            ToDate: [''],
            Status: ['']
        });
    }

    ngOnInit(): void {
        // Retrive authorizationData
        this.GetPODetails();
        
        const retrievedObject = localStorage.getItem('authorizationData');
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
            this.currentUserID = this.authenticationDetails.UserID;
            this.currentUserRole = this.authenticationDetails.UserRole;
            this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
            if (this.MenuItems.indexOf('Dashboard') < 0) {
                this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
                );
                this._router.navigate(['/auth/login']);
            }

        } else {
            this._router.navigate(['/auth/login']);
        }
        
        // const gradient = this.barCanvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 600);
        // gradient.addColorStop(0, 'red');
        // gradient.addColorStop(1, 'green');
        // this.barColors = [
        //     {
        //         backgroundColor: gradient
        //     }
        // ];

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
        this.donutChartData = [
            {
                label: 'Liverpool FC',
                value: 5,
                color: 'red',
            },
            {
                label: 'Real Madrid	',
                value: 13,
                color: 'black',
            },
            {
                label: 'FC Bayern München',
                value: 5,
                color: 'blue',
            },
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

        // this.Pos = [
        //     { TransID: 122, Version: '1.1', PODate: new Date(), Status: 'Open', Document: '', NextProcess: 'Acknowledgement' },
        //     { TransID: 123, Version: '1.1', PODate: new Date(), Status: 'PO', Document: '', NextProcess: 'Acknowledgement' },
        //     { TransID: 124, Version: '1.1', PODate: new Date(), Status: 'ASN', Document: '', NextProcess: 'Acknowledgement' },
        //     { TransID: 125, Version: '1.1', PODate: new Date(), Status: 'Gate', Document: '', NextProcess: 'Acknowledgement' },
        //     { TransID: 126, Version: '1.1', PODate: new Date(), Status: 'GRN', Document: '', NextProcess: 'Acknowledgement' },
        // ];
        // this.posDataSource = new MatTableDataSource(this.Pos);
    }
    GetPODetails() {
        this.IsProgressBarVisibile = true;
        this._dashboardService
            .GetPODetails()
            .subscribe((data) => {
                if (data) {
                    this.Pos = <PO[]>data;
                    this.posDataSource = new MatTableDataSource(this.Pos);
                    this.posDataSource.paginator = this.poPaginator;
                    this.posDataSource.sort = this.poSort;
                }
                this.IsProgressBarVisibile = false;
            },
                (err) => {
                    console.error(err);
                    this.IsProgressBarVisibile = false;
                });
    }
    DateSelected(): void {
        // console.log('Called');
        const FROMDATEVAL = this.poFormGroup.get('FromDate').value as Date;
        const TODATEVAL = this.poFormGroup.get('ToDate').value as Date;
        if (FROMDATEVAL && TODATEVAL && FROMDATEVAL > TODATEVAL) {
            this.isDateError = true;
        } else {
            this.isDateError = false;
        }
    }
    GetAllPOBasedOnDate(): void {
        if (this.poFormGroup.valid) {
            if (!this.isDateError) {
                this.IsProgressBarVisibile = true;
                this.poSearch = new POSearch();
                this.poSearch.FromDate = this.datePipe.transform(this.poFormGroup.get('FromDate').value as Date, 'yyyy-MM-dd');
                this.poSearch.ToDate = this.datePipe.transform(this.poFormGroup.get('ToDate').value as Date, 'yyyy-MM-dd');
                this.poSearch.Status = this.poFormGroup.get('Status').value;
                // this.getDocument.FromDate = this.poFormGroup.get('FromDate').value;
                // this.getDocument.ToDate = this.poFormGroup.get('ToDate').value;
                this._dashboardService.GetAllPOBasedOnDate(this.poSearch)
                    .subscribe((data) => {
                        if (data) {
                            this.Pos = <PO[]>data;
                            this.posDataSource = new MatTableDataSource(this.Pos);
                            this.posDataSource.paginator = this.poPaginator;
                            this.posDataSource.sort = this.poSort;
                        }

                        this.IsProgressBarVisibile = false;
                    },
                        (err) => {
                            console.error(err);
                            this.IsProgressBarVisibile = false;
                            this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                        });
            }

        }
        Object.keys(this.poFormGroup.controls).forEach(key => {
            this.poFormGroup.get(key).markAsTouched();
            this.poFormGroup.get(key).markAsDirty();
        });
    }
    PurchaseOrder(po: string) {
        // alert(po);
        this._router.navigate(['/pages/polookup'], { queryParams: { id: po } });
    }
    Acknowledgement(po: string) {
        // alert(po);
        this._router.navigate(['/pages/polookup'], { queryParams: { id: po } });
    }
    POFlip(po: string) {
        this._router.navigate(['/pages/poflip'], { queryParams: { id: po } });
    }
    Checked(po: string): void {
        this._router.navigate(['/pages/polookup'], { queryParams: { id: po } });
    }
    AdvanceShipment(po: string) {
        // alert(po);
        this._router.navigate(['/pages/asn'], { queryParams: { id: po } });
    }
    NextProcess(nextProcess: string, po: string) {
        if (nextProcess === 'ACK') {
            // this.nextProcess = 'ACK';
            this._router.navigate(['/pages/polookup'], { queryParams: { id: po } });
        }
        else if (nextProcess === 'ASN') {
            // this.nextProcess = 'ASN';
            this._router.navigate(['/pages/asn'], { queryParams: { id: po } });
        }
    }
    onMouseMove(event) {
        console.log(event)  // true false
        // if true then the mouse is on control and false when you leave the mouse
    }
    progress1(value: number): void {
        const progress = value / 100;
        this.progressPercentage1 = Math.round(progress * 100);
        this.dashoffset1 = this.circumference * (progress);
    }
    progress2(value: number): void {
        const progress = value / 100;
        this.progressPercentage2 = Math.round(progress * 100);
        this.dashoffset2 = this.circumference * (progress);
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

    getStatusColor(element: PO, StatusFor: string): string {
        switch (StatusFor) {
            case 'ASN':
                return element.Status === 'Open' ? 'gray' : element.Status === 'ACK' ? '#efb577' : '#34ad65';
            case 'Gate':
                return element.Status === 'Open' ? 'gray' : element.Status === 'ACK' ? 'gray' : element.Status === 'ASN' ? '#efb577' : '#34ad65';
            case 'GRN':
                return element.Status === 'Open' ? 'gray' : element.Status === 'ACK' ? 'gray' : element.Status === 'ASN' ? 'gray' :
                    element.Status === 'Gate' ? '#efb577' : '#34ad65';
            default:
                return '';
        }
    }
    getNextProcess(element: any) {
        // console.log(element);
        // if (element.Status === 'Open') {
        //     this.nextProcess = 'ACK';
        // }
        // else if (element.Status === 'ACK') {
        //     this.nextProcess = 'ASN';
        // }
        // else if (element.Status === 'ASN') {
        //     this.nextProcess = 'Gate';
        // }
        // else {
        //     this.nextProcess = 'GRN';
        // }
        if (element.Status === 'Open') {
            element.NextProcess = 'ACK';
        }
        else if (element.Status === 'ACK') {
            element.NextProcess = 'ASN';
        }
        else if (element.Status === 'ASN') {
            element.NextProcess = 'Gate';
        }
        else {
            element.NextProcess = 'GRN';
        }

    }
    getTimeline(element: PO, StatusFor: string): string {
        switch (StatusFor) {
            case 'ASN':
                return element.Status === 'Open' ? 'white-timeline' : element.Status === 'ACK' ? 'orange-timeline' : 'green-timeline';
            case 'Gate':
                return element.Status === 'Open' ? 'white-timeline' : element.Status === 'ACK' ? 'white-timeline' : element.Status === 'ASN' ? 'orange-timeline' : 'green-timeline';
            case 'GRN':
                return element.Status === 'Open' ? 'white-timeline' : element.Status === 'ACK' ? 'white-timeline' : element.Status === 'ASN' ? 'white-timeline' :
                    element.Status === 'Gate' ? 'orange-timeline' : 'green-timeline';
            default:
                return '';
        }
    }
    getRestTimeline(element: PO, StatusFor: string): string {
        switch (StatusFor) {
            case 'ASN':
                return element.Status === 'Open' ? 'white-timeline' : element.Status === 'ACK' ? 'white-timeline' : 'green-timeline';
            case 'Gate':
                return element.Status === 'Open' ? 'white-timeline' : element.Status === 'ACK' ? 'white-timeline' : element.Status === 'ASN' ? 'white-timeline' : 'green-timeline';
            case 'GRN':
                return element.Status === 'Open' ? 'white-timeline' : element.Status === 'ACK' ? 'white-timeline' : element.Status === 'ASN' ? 'white-timeline' :
                    element.Status === 'Gate' ? 'white-timeline' : 'green-timeline';
            default:
                return '';
        }
    }
}
