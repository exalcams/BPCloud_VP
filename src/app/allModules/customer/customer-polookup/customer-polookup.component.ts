import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AbstractControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { ASNDetails, GRNDetails, QADetails, ItemDetails, OrderFulfilmentDetails, Acknowledgement } from 'app/models/Dashboard';
import { AuthenticationDetails, AppUsage } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'app/services/dashboard.service';
import { DatePipe } from '@angular/common';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { fuseAnimations } from '@fuse/animations';
import { BPCOFItem } from 'app/models/OrderFulFilment';
import { POService } from 'app/services/po.service';
import { MasterService } from 'app/services/master.service';

@Component({
  selector: 'app-customer-polookup',
  templateUrl: './customer-polookup.component.html',
  styleUrls: ['./customer-polookup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CustomerPolookupComponent implements OnInit {

  public tab1: boolean;
  public tab2: boolean;
  public tab3: boolean;
  public ItemCount: number;
  public ASNCount: number;
  public GRNCount: number;
  public QACount: number;
  public DocumentCount: number;
  public FlipCount: number;

  IsProgressBarVisibile: boolean;
  SOItemDisplayedColumns: string[] = [
    'Item',
    'Material',
    'MaterialText',
    'OrderedQty',
    'CompletedQty',
    'OpenQty',
    'UOM'
  ];

  SOItemDataSource: MatTableDataSource<BPCOFItem>;
  SOtems: BPCOFItem[] = [];
  OrderFulfilmentDetails: OrderFulfilmentDetails = new OrderFulfilmentDetails();
  DocNumber: string;
  ACKFormGroup: FormGroup;
  Acknowledgement: Acknowledgement = new Acknowledgement();
  // POItems: ItemDetails[] = [];
  POItemFormArray: FormArray = this.formBuilder.array([]);

  @ViewChild(MatPaginator) itemPaginator: MatPaginator;
  @ViewChild(MatPaginator) asnPaginator: MatPaginator;
  @ViewChild(MatPaginator) grnPaginator: MatPaginator;
  @ViewChild(MatPaginator) qaPaginator: MatPaginator;

  @ViewChild(MatSort) itemSort: MatSort;
  @ViewChild(MatSort) asnSort: MatSort;
  @ViewChild(MatSort) grnSort: MatSort;
  @ViewChild(MatSort) qaSort: MatSort;
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  PartnerID: string;

  constructor(
    private route: ActivatedRoute,
    public _dashboardService: DashboardService,
    public _POService: POService,
    private _masterService: MasterService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private datepipe: DatePipe,
    private dialog: MatDialog,
  ) {

    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserName = this.authenticationDetails.UserName;
      this.PartnerID = this.authenticationDetails.UserName;
      this.currentUserRole = this.authenticationDetails.UserRole;
      // this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      // // console.log(this.authenticationDetails);
      // if (this.MenuItems.indexOf('Dashboard') < 0) {
      //     this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
      //     );
      //     this._router.navigate(['/auth/login']);
      // }

    } else {
      this._router.navigate(['/auth/login']);
    }

    this.route.queryParams.subscribe(params => {
      this.DocNumber = params['id'];
    });
    this.ACKFormGroup = this.formBuilder.group({
      Proposeddeliverydate: ['', Validators.required]
    });
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    // this.tabCount = 1;
  }

  ngOnInit(): void {
    this.CreateAppUsage();
    this.tabone();
  }
  CreateAppUsage(): void {
    const appUsage: AppUsage = new AppUsage();
    appUsage.UserID = this.currentUserID;
    appUsage.AppName = 'SO Lookup';
    appUsage.UsageCount = 1;
    appUsage.CreatedBy = this.currentUserName;
    appUsage.ModifiedBy = this.currentUserName;
    this._masterService.CreateAppUsage(appUsage).subscribe(
      (data) => {
      },
      (err) => {
        console.error(err);
      }
    );
  }
  tabone(): void {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.GetPOItemsByDocAndPartnerID();
    // this.ResetControl();
  }
  tabtwo(): void {
    this.tab1 = false;
    this.tab2 = true;
    this.tab3 = false;
    // this.getallasn();
    // this.ResetControl();
  }
  tabthree(): void {
    this.tab1 = false;
    this.tab2 = false;
    this.tab3 = true;
    // this.getallgrn();
    // this.ResetControl();
  }

  GetPOItemsByDocAndPartnerID(): void {
    this._POService.GetPOItemsByDocAndPartnerID(this.DocNumber, this.PartnerID).subscribe(
      (data) => {
        this.SOtems = data as BPCOFItem[];
        this.ItemCount = this.SOtems.length;
        this.SOItemDataSource = new MatTableDataSource(this.SOtems);
      },
      (err) => {
        console.error(err);
      }
    );
  }
  SaveClicked(): void {

  }
  SubmitClicked(): void {

  }
  DeleteClicked(): void {

  }

}

