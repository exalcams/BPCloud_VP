import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SupportHeader, SupportMaster } from 'app/models/support-desk';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SupportDeskService } from 'app/services/support-desk.service';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { fuseAnimations } from '@fuse/animations';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
@Component({
  selector: 'app-support-desk',
  templateUrl: './support-desk.component.html',
  styleUrls: ['./support-desk.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SupportDeskComponent implements OnInit {

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserRole: string;
  MenuItems: string[];
  PartnerID: string;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  SupportHeaders: SupportHeader[] = [];
  SelectedSupportHeader: SupportHeader = new SupportHeader();
  SupportDisplayedColumns: string[] = [
    'ReasonCode',
    'Date',
    'Status',
    'AssignTo',
  ];
  SupportDataSource: MatTableDataSource<SupportHeader>;
  @ViewChild(MatPaginator) SupportPaginator: MatPaginator;
  @ViewChild(MatSort) SupportSort: MatSort;
  AllSupportMasters: SupportMaster[] = [];

  constructor(
    private route: ActivatedRoute,
    public _supportdeskService: SupportDeskService,
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
          this.SupportHeaders = <SupportHeader[]>data;
          this.SupportHeaders.forEach(element => {
            element.Reason = this.GetReasonByReasonCode(element.ReasonCode);
          });
          console.log(this.SupportHeaders);
          this.SupportDataSource = new MatTableDataSource(this.SupportHeaders);
          this.SupportDataSource.paginator = this.SupportPaginator;
          this.SupportDataSource.sort = this.SupportSort;
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
    this.AllSupportMasters.forEach(element => {
      if (element.ReasonCode.toLowerCase() === reasonCode.toLowerCase()) {
        return element.ReasonText.toString();
      }
    });
  }

  AddSupportTicketClicked(): void {
    this._router.navigate(['/pages/supportticket']);
  }

  OnSupportHeaderRowClicked(row: any): void {
    this._router.navigate(['/pages/supportchat'], { queryParams: { SupportID: row.SupportID } });
  }
}
