import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SupportHeader, SupportMaster } from 'app/models/Support';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SupportdeskService } from 'app/services/supportdesk.service';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { fuseAnimations } from '@fuse/animations';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
@Component({
  selector: 'app-supportdesk',
  templateUrl: './supportdesk.component.html',
  styleUrls: ['./supportdesk.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SupportdeskComponent implements OnInit {

  IsProgressBarVisibile: boolean;
  supportDisplayedColumns: string[] = [
    // 'Item',
    'ReasionCode',
    // 'ReasionCode',
    'Date',
    'Status',
    'Assignto',
  ];
  supportDataSource: MatTableDataSource<SupportHeader>;
  supportTickets: SupportHeader[] = [];
  selectedPORow: SupportHeader = new SupportHeader();
  @ViewChild(MatPaginator) supportPaginator: MatPaginator;
  @ViewChild(MatSort) supportSort: MatSort;
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserRole: string;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  PartnerID: string;
  AllSupportMasters: SupportMaster[] = [];

  constructor(
    private route: ActivatedRoute,
    public _supportdeskService: SupportdeskService,
    private _router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.PartnerID = '';
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.MenuItems.indexOf('SupportDesk') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this._router.navigate(['/auth/login']);
      }

    } else {
      this._router.navigate(['/auth/login']);
    }
    this.GetAllSupportMasters();
    this.GetAllSupportTickets();
  }

  GetAllSupportTickets(): void {
    this.IsProgressBarVisibile = true;
    this._supportdeskService
      .GetSupportTickets(this.authenticationDetails.UserName)
      .subscribe((data) => {
        if (data) {
          this.supportTickets = <SupportHeader[]>data;
          this.supportTickets.forEach(element => {
            element.Reason = this.GetReasonByReasonCode(element.ReasionCode);
          });
          console.log(this.supportTickets);
          this.supportDataSource = new MatTableDataSource(this.supportTickets);
          this.supportDataSource.paginator = this.supportPaginator;
          this.supportDataSource.sort = this.supportSort;
        }
        this.IsProgressBarVisibile = false;
      },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
        });
  }

  GetAllSupportMasters(): void {
    this.IsProgressBarVisibile = true;
    this._supportdeskService
      .GetSupportMasters(this.authenticationDetails.UserName)
      .subscribe((data) => {
        if (data) {
          this.AllSupportMasters = <SupportMaster[]>data;
          console.log(this.AllSupportMasters);
        }
        this.IsProgressBarVisibile = false;
      },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
        });
  }

  GetReasonByReasonCode(reasonCode: string): any {
    console.log(reasonCode);
    this.AllSupportMasters.forEach(element => {
      if (element.ReasionCode.toLowerCase() === reasonCode.toLowerCase()) {
        return element.ReasionText.toString();
      }
    });
  }

  CreateTicket(): void {
    // this._router.navigate(['/pages/polookup'], { queryParams: { id: po } });supportchat
    this._router.navigate(['/pages/createTicket']);
  }

  Checked(row: any): void {
    this._router.navigate(['/pages/supportchat'], { queryParams: { SupportID: row.SupportID } });
  }
}
