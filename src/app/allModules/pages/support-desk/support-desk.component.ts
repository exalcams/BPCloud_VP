import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SupportHeader, SupportMaster } from 'app/models/support-desk';
import { SupportDeskService } from 'app/services/support-desk.service';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { fuseAnimations } from '@fuse/animations';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-support-desk',
  templateUrl: './support-desk.component.html',
  styleUrls: ['./support-desk.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class SupportDeskComponent implements OnInit {
  // private paginator: MatPaginator; private sort: MatSort;
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserRole: string;
  menuItems: string[];
  partnerID: string;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  isProgressBarVisibile: boolean;
  docRefNo: any;
  supports: SupportHeader[] = [];
  selectedSupport: SupportHeader = new SupportHeader();
  supportDisplayedColumns: string[] = [
    'Reason',
    'Date',
    'Status',
    'AssignTo',
  ];
  supportDataSource: MatTableDataSource<SupportHeader>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  supportMasters: SupportMaster[] = [];
  isSupport: boolean;

  constructor(
    public _supportdeskService: SupportDeskService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) {
    this.partnerID = '';
    this.isSupport = false;
  }


  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.menuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.menuItems.indexOf('SupportDesk') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this._router.navigate(['/auth/login']);
      }
      this.GetSupportMasters();
      this.GetSupportTicketsByPartnerID();
    } else {
      this._router.navigate(['/auth/login']);
    }
    this._activatedRoute.queryParams.subscribe(params => {
      this.docRefNo = params['id'];
    });
  }

  loadSupportDeskBasedOnCondition(): void {
    if (this.docRefNo) {
      this._router.navigate(['/pages/supportticket'], { queryParams: { DocRefNo: this.docRefNo } });
    }
    else {
      this.GetSupportMasters();
      this.GetSupportTicketsByPartnerID();
    }
  }

  GetSupportTicketsByPartnerID(): void {
    this.isProgressBarVisibile = true;
    this._supportdeskService
      .GetSupportTicketsByPartnerID(this.authenticationDetails.UserName)
      .subscribe((data) => {
        if (data) {
          this.supports = <SupportHeader[]>data;
          if (this.supports && this.supports.length === 0) {
            this.isSupport = true;
          }
          this.supportDataSource = new MatTableDataSource(this.supports);
          this.supportDataSource.paginator = this.paginator;
          this.supportDataSource.sort = this.sort;
        }
        this.isProgressBarVisibile = false;
      },
        (err) => {
          console.error(err);
          this.isProgressBarVisibile = false;
        });
  }

  GetSupportMasters(): void {
    this.isProgressBarVisibile = true;
    this._supportdeskService
      .GetSupportMasters()
      .subscribe((data) => {
        if (data) {
          this.supportMasters = <SupportMaster[]>data;
        }
        this.isProgressBarVisibile = false;
      },
        (err) => {
          console.error(err);
          this.isProgressBarVisibile = false;
        });
  }

  addSupportTicketClicked(): void {
    this._router.navigate(['/pages/supportticket']);
  }

  onSupportRowClicked(row: any): void {
    this._router.navigate(['/pages/supportchat'], { queryParams: { SupportID: row.SupportID } });
  }
}
