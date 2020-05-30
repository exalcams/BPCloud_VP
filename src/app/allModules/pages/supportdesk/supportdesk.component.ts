import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SupportHeader } from 'app/models/Support';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SupportdeskService } from 'app/services/supportdesk.service';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { fuseAnimations } from '@fuse/animations';

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
    'SupportID',
    'ReasionCode',
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
  PartnerID: string;

  constructor(
    private route: ActivatedRoute,
    public _supportdeskService: SupportdeskService,
    private _router: Router,
    private formBuilder: FormBuilder,
  ) {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
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
  }

  ngOnInit() {
    this.GetSupportTickets();
  }
  GetSupportTickets() {
    this.IsProgressBarVisibile = true;
    this._supportdeskService
      .GetSupportTickets(this.PartnerID)
      .subscribe((data) => {
        if (data) {
          this.supportTickets = <SupportHeader[]>data;
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
  CreateTicket(){
    // this._router.navigate(['/pages/polookup'], { queryParams: { id: po } });supportchat
    this._router.navigate(['/pages/createTicket']);
  }
  Checked(row: any): void {
    this._router.navigate(['/pages/supportchat']);
}
}
