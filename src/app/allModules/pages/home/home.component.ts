import { Component, OnInit } from '@angular/core';
import { AuthenticationDetails } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FactService } from 'app/services/fact.service';
import { Router } from '@angular/router';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { Guid } from 'guid-typescript';
import { BPCFact, BPCAIACT } from 'app/models/fact';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  menuItems: string[];
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole = '';
  currentDisplayName: string;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  isProgressBarVisibile: boolean;
  searchText = '';
  selectID: string;
  selection = new SelectionModel<any>(true, []);
  todayDate: any;
  selectedFact: BPCFact;
  selectedAIACT: BPCAIACT;
  AllFacts: BPCFact[] = [];
  AllActions: BPCAIACT[] = [];
  AllNotifications: BPCAIACT[] = [];
  AIACTsByPartnerID: BPCAIACT[] = [];
  AIACTsByPartnerIDView: BPCAIACT[] = [];
  constructor(
    private _FactService: FactService,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.selectedFact = new BPCFact();
    this.selectedAIACT = new BPCAIACT();
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.isProgressBarVisibile = false;
    this.todayDate = new Date().getDate();
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserName = this.authenticationDetails.UserName;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.currentDisplayName = this.authenticationDetails.DisplayName;
      this.menuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.menuItems.indexOf('Dashboard') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this._router.navigate(['/auth/login']);
      }
      this.GetFactByPartnerIDAndType();
    } else {
      this._router.navigate(['/auth/login']);
    }
  }

  GetFactByPartnerIDAndType(): void {
    // console.log(this.authenticationDetails.EmailAddress);
    this._FactService.GetFactByPartnerIDAndType(this.currentUserName, 'Vendor').subscribe(
      (data) => {
        const fact = data as BPCFact;
        // console.log(fact);
        if (fact) {
          this.GetAIACTsByPartnerID(fact.PatnerID);
          this.loadSelectedBPCFact(fact);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetAIACTsByPartnerID(PartnerID: any): void {
    this.isProgressBarVisibile = true;
    this._FactService.GetAIACTsByPartnerID(PartnerID).subscribe(
      (data) => {
        this.isProgressBarVisibile = false;
        this.AIACTsByPartnerID = data as BPCAIACT[];
        this.AIACTsByPartnerID.forEach(x => {
          if (x.Type === 'Action') {
            this.AllActions.push(x);
          }
          else {
            this.AllNotifications.push(x);
          }
        });
      },
      (err) => {
        console.error(err);
        this.isProgressBarVisibile = false;
        // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  AcceptAIACT(): void {
    this.selectedAIACT.ModifiedBy = this.authenticationDetails.UserID.toString();
    this.selectedAIACT.Status = 'Accepted';
    this.selectedAIACT.ActionText = 'View';
    this.isProgressBarVisibile = true;
    this._FactService.AcceptAIACT(this.selectedAIACT).subscribe(
      (data) => {
        this.notificationSnackBarComponent.openSnackBar('PO Accepted successfully', SnackBarStatus.success);
        this.isProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.isProgressBarVisibile = false;
      }
    );
  }

  RejectAIACT(): void {
    this.selectedAIACT.ModifiedBy = this.authenticationDetails.UserID.toString();
    this.selectedAIACT.Status = 'Rejected';
    this.selectedAIACT.ActionText = 'View';
    this.isProgressBarVisibile = true;
    this._FactService.RejectAIACT(this.selectedAIACT).subscribe(
      (data) => {
        this.notificationSnackBarComponent.openSnackBar('PO Rejected successfully', SnackBarStatus.success);
        this.isProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.isProgressBarVisibile = false;
      }
    );
  }

  AcceptAIACTs(): void {
    this.AIACTsByPartnerID.forEach(x => {
      if (x.Status === 'Open') {
        x.ModifiedBy = this.authenticationDetails.UserID.toString();
        x.Status = 'Accepted';
        x.ActionText = 'View';
        this.AIACTsByPartnerIDView.push(x);
      }
    });
    console.log(this.AIACTsByPartnerIDView);
    this.isProgressBarVisibile = true;
    this._FactService.AcceptAIACTs(this.AIACTsByPartnerIDView).subscribe(
      (data) => {
        this.notificationSnackBarComponent.openSnackBar('POs Accepted successfully', SnackBarStatus.success);
        this.isProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.isProgressBarVisibile = false;
      }
    );
  }

  loadSelectedBPCFact(selectedBPCFact: BPCFact): void {
    this.selectedFact = selectedBPCFact;
    this.selectID = selectedBPCFact.PatnerID;
  }

  openConfirmationDialog(Actiontype: string, Catagory: string): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: Actiontype,
        Catagory: Catagory
      },
      panelClass: 'confirmation-dialog'
    };
    const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          if (Actiontype === 'Accept') {
            this.AcceptAIACT();
          } else if (Actiontype === 'Reject') {
            this.RejectAIACT();
          } else if (Actiontype === 'Accept All') {
            this.AcceptAIACTs();
          }
        }
      });
  }

  actionTextClicked(aIACTByPartnerID: BPCAIACT): void {
    if (aIACTByPartnerID) {
      if (aIACTByPartnerID.ActionText.toLowerCase() === "accept") {
        this.selectedAIACT = aIACTByPartnerID;
        const Actiontype = 'Accept';
        const Catagory = 'PO';
        this.openConfirmationDialog(Actiontype, Catagory);
      }
      else if (aIACTByPartnerID.ActionText.toLowerCase() === "reject") {
        this.selectedAIACT = aIACTByPartnerID;
        const Actiontype = 'Reject';
        const Catagory = 'PO';
        this.openConfirmationDialog(Actiontype, Catagory);
      } else if (aIACTByPartnerID.ActionText.toLowerCase() === "view") {
        this._router.navigate(['/pages/polookup'], { queryParams: { id: aIACTByPartnerID.DocNumber } });
      }
    }
    else {

    }
  }

  setActionToOpenConfirmation(actiontype: string): void {
    if (this.selectedFact.PatnerID) {
      const Actiontype = actiontype;
      const Catagory = 'Vendor';
      this.openConfirmationDialog(Actiontype, Catagory);
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 8 || charCode === 9 || charCode === 13 || charCode === 46
      || charCode === 37 || charCode === 39 || charCode === 123 || charCode === 190) {
      return true;
    }
    else if (charCode < 48 || charCode > 57) {
      return false;
    }
    return true;
  }

  onFactSheetButtonClicked(): void {
    this._router.navigate(['/pages/orderfulfilmentCenter']);
  }

  onAcceptAllButtonClicked(): void {
    if (this.AIACTsByPartnerID && this.AIACTsByPartnerID.length > 0) {
      const Actiontype = 'Accept All';
      const Catagory = 'PO';
      this.openConfirmationDialog(Actiontype, Catagory);
    }

  }

  onClearAllButtonClicked(): void {

  }

  getTodayDate(): any {
    const today = new Date();
    return today.getDate().toString();
  }

  typeSelected(event): void {
    const selectedType = event.value;
    if (event.value) {
      this.selectedFact.Type = event.value;
    }
  }

}


