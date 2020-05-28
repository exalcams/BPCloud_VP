import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { AuthenticationDetails, UserWithRole } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { Task } from 'app/models/task';
import { FormGroup, FormBuilder } from '@angular/forms';
import { POSearch, PO, Status, DashboardGraphStatus, OTIFStatus, QualityStatus, FulfilmentStatus, Deliverystatus } from 'app/models/Dashboard';
import { MatTableDataSource, MatPaginator, MatMenuTrigger, MatSort, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { Router } from '@angular/router';
import { DashboardService } from 'app/services/dashboard.service';
import { DatePipe } from '@angular/common';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { ChartType } from 'chart.js';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-customer-orderfulfilment',
  templateUrl: './customer-orderfulfilment.component.html',
  styleUrls: ['./customer-orderfulfilment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CustomerOrderfulfilmentComponent implements OnInit {

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserRole: string;
  PartnerID: string;
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
    // 'NextProcess',
    'Action'
  ];
  poFormGroup: FormGroup;
  isDateError: boolean;
  poSearch: POSearch;
  posDataSource: MatTableDataSource<PO>;
  @ViewChild(MatPaginator) poPaginator: MatPaginator;
  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;
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
  DashboardGraphStatus: DashboardGraphStatus = new DashboardGraphStatus();
  OTIFStatus: OTIFStatus = new OTIFStatus();
  QualityStatus: QualityStatus = new QualityStatus();
  FulfilmentStatus: FulfilmentStatus = new FulfilmentStatus();
  dashboardDeliverystatus: Deliverystatus = new Deliverystatus();
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
    this.poFormGroup = this._formBuilder.group({
      FromDate: [''],
      ToDate: [''],
      Status: ['']
    });
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
    // this.barChartLabels = [this.date1, this.date2, this.date3, this.date4, this.date5];
    this.barChartLabels = [dat1, dat2, dat3, dat4, dat5];
  }

  ngOnInit(): void {
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.PartnerID = this.authenticationDetails.UserName;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      // console.log(this.authenticationDetails);
      if (this.MenuItems.indexOf('CustomerOrderFulFilmentCenter') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this._router.navigate(['/auth/login']);
      }

    } else {
      this._router.navigate(['/auth/login']);
    }
    this.GetPODetails();
    this.GetDashboardGraphStatus();
    console.log(this.dashboardDeliverystatus);
    // const OTIF = Number(this.OTIFStatus.OTIF);
    // this.progress1(OTIF);
    // this.progress2(this.QualityStatus.Quality);
    // this.doughnutChartData = [this.FulfilmentStatus.OpenDetails.Value, this.FulfilmentStatus.ScheduledDetails.Value, this.FulfilmentStatus.InProgressDetails.Value, this.FulfilmentStatus.PendingDetails];
    // this.barChartData = [
    //     { data: [45, 70, 65, 20, 80], label: 'Actual' },
    //     { data: [87, 50, 40, 71, 56], label: 'Planned' }
    // ];
    // console.log(this.barChartData);

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
  openMyMenu(index: any): void  {
    alert(index);
    this.matMenuTrigger.openMenu();

  }
  closeMyMenu(index: any): void  {
    alert(index);
    this.matMenuTrigger.closeMenu();
  }
  GetPODetails(): void  {
    this.IsProgressBarVisibile = true;
    this._dashboardService
      .GetPODetails(this.PartnerID)
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
  GetDashboardGraphStatus(): void  {
    this.IsProgressBarVisibile = true;
    this._dashboardService
      .GetDashboardGraphStatus(this.PartnerID)
      .subscribe((data) => {
        if (data) {
          this.DashboardGraphStatus = <DashboardGraphStatus>data;
          this.dashboardDeliverystatus = this.DashboardGraphStatus.deliverystatus;
          this.OTIFStatus = this.DashboardGraphStatus.oTIFStatus;
          this.QualityStatus = this.DashboardGraphStatus.qualityStatus;
          this.FulfilmentStatus = this.DashboardGraphStatus.fulfilmentStatus;
          if (this.OTIFStatus && this.OTIFStatus.OTIF) {
            const OTIF = Number(this.OTIFStatus.OTIF);
            this.progress1(OTIF);
          }
          if (this.QualityStatus && this.QualityStatus.Quality) {
            const Quality = Number(this.QualityStatus.Quality);
            this.progress2(Quality);
          }
          if (this.FulfilmentStatus && this.FulfilmentStatus.OpenDetails && this.FulfilmentStatus.ScheduledDetails
            && this.FulfilmentStatus.InProgressDetails && this.FulfilmentStatus.PendingDetails) {
            this.doughnutChartData = [this.FulfilmentStatus.OpenDetails.Value,
            this.FulfilmentStatus.ScheduledDetails.Value,
            this.FulfilmentStatus.InProgressDetails.Value,
            this.FulfilmentStatus.PendingDetails.Value];
          }
          // this.dashboardDeliverystatus.Planned1.Date = this.dashboardDeliverystatus.Planned1.Date 
          if (this.dashboardDeliverystatus && this.dashboardDeliverystatus.Planned1 && this.dashboardDeliverystatus.Planned2
            && this.dashboardDeliverystatus.Planned3 && this.dashboardDeliverystatus.Planned4 && this.dashboardDeliverystatus.Planned5) {
            const Planned1Date = this.datePipe.transform(this.dashboardDeliverystatus.Planned1.Date, 'dd/MM/yyyy');
            const Planned2Date = this.datePipe.transform(this.dashboardDeliverystatus.Planned2.Date, 'dd/MM/yyyy');
            const Planned3Date = this.datePipe.transform(this.dashboardDeliverystatus.Planned3.Date, 'dd/MM/yyyy');
            const Planned4Date = this.datePipe.transform(this.dashboardDeliverystatus.Planned4.Date, 'dd/MM/yyyy');
            const Planned5Date = this.datePipe.transform(this.dashboardDeliverystatus.Planned5.Date, 'dd/MM/yyyy');

            // this.barChartLabels = [Planned1Date, Planned2Date, Planned3Date, Planned4Date, Planned5Date];
            this.barChartData = [
              { data: [this.dashboardDeliverystatus.Planned1.Actual, this.dashboardDeliverystatus.Planned2.Actual, this.dashboardDeliverystatus.Planned3.Actual, this.dashboardDeliverystatus.Planned4.Actual, this.dashboardDeliverystatus.Planned5.Actual], label: 'Actual' },
              { data: [this.dashboardDeliverystatus.Planned1.Planned, this.dashboardDeliverystatus.Planned2.Planned, this.dashboardDeliverystatus.Planned3.Planned, this.dashboardDeliverystatus.Planned4.Planned, this.dashboardDeliverystatus.Planned5.Planned], label: 'Planned' }
            ];
          }
          console.log(this.barChartData);
          console.log(this.barChartLabels);
          console.log(this.DashboardGraphStatus);
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
        this.poSearch.PartnerID = this.PartnerID;
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
  PurchaseOrder(po: string): void {
    // alert(po);
    this._router.navigate(['/customer/polookup'], { queryParams: { id: po } });
  }
  // Acknowledgement(po: string): void {
  //   // alert(po);
  //   this._router.navigate(['/pages/polookup'], { queryParams: { id: po } });
  // }
  // POFlip(po: string): void {
  //   this._router.navigate(['/pages/poflip'], { queryParams: { id: po } });
  // }
  // Checked(po: string): void {
  //   this._router.navigate(['/pages/polookup'], { queryParams: { id: po } });
  // }
  // AdvanceShipment(po: string): void {
  //   // alert(po);
  //   this._router.navigate(['/pages/asn'], { queryParams: { id: po } });
  // }
  // NextProcess(nextProcess: string, po: string): void {
  //   if (nextProcess === 'ACK') {
  //     // this.nextProcess = 'ACK';
  //     this._router.navigate(['/pages/polookup'], { queryParams: { id: po } });
  //   }
  //   else if (nextProcess === 'ASN') {
  //     // this.nextProcess = 'ASN';
  //     this._router.navigate(['/pages/asn'], { queryParams: { id: po } });
  //   }
  // }
  onMouseMove(event): void {
    console.log(event);  // true false
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
  // getNextProcess(element: any) {
  //   // console.log(element);
  //   // if (element.Status === 'Open') {
  //   //     this.nextProcess = 'ACK';
  //   // }
  //   // else if (element.Status === 'ACK') {
  //   //     this.nextProcess = 'ASN';
  //   // }
  //   // else if (element.Status === 'ASN') {
  //   //     this.nextProcess = 'Gate';
  //   // }
  //   // else {
  //   //     this.nextProcess = 'GRN';
  //   // }
  //   if (element.Status === 'Open') {
  //     element.NextProcess = 'ACK';
  //   }
  //   else if (element.Status === 'ACK') {
  //     element.NextProcess = 'ASN';
  //   }
  //   else if (element.Status === 'ASN') {
  //     element.NextProcess = 'Gate';
  //   }
  //   else {
  //     element.NextProcess = 'GRN';
  //   }

  // }
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
