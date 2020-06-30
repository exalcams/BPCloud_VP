import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuApp, AuthenticationDetails } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatTableDataSource, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { MasterService } from 'app/services/master.service';
import { FactService } from 'app/services/fact.service';
import { VendorMasterService } from 'app/services/vendor-master.service';
import { Router } from '@angular/router';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { Guid } from 'guid-typescript';
import { BPCFact, BPCFactView, BPCFactContactPerson, BPCKRA, BPCFactBank, BPCAIACT } from 'app/models/fact';
import { LEAVE_SELECTOR } from '@angular/animations/browser/src/util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  MenuItems: string[];
  AllMenuApps: MenuApp[] = [];
  SelectedMenuApp: MenuApp;
  authenticationDetails: AuthenticationDetails;
  CurrentUserID: Guid;
  CurrentUserName: string;
  CurrentUserRole = '';
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  searchText = '';
  AllFacts: BPCFact[] = [];
  selectID: string;
  SelectedBPCFact: BPCFact;
  SelectedBPCFactView: BPCFactView;
  KRAsByPartnerID: BPCKRA[] = [];
  BanksByPartnerID: BPCFactBank[] = [];
  ContactPersonsByPartnerID: BPCFactContactPerson[] = [];
  AIACTsByPartnerID: BPCAIACT[] = [];
  AllActions: BPCAIACT[] = [];
  AllNotifications: BPCAIACT[] = [];
  selection = new SelectionModel<any>(true, []);
  todayDate: any;
  SelectedBPCAIACTByPartnerID: BPCAIACT;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _masterService: MasterService,
    private _FactService: FactService,
    private _vendorMasterService: VendorMasterService,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder
  ) {
    this.SelectedBPCFact = new BPCFact();
    this.SelectedBPCAIACTByPartnerID = new BPCAIACT();
    this.SelectedBPCFactView = new BPCFactView();
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
    this.todayDate = new Date().getDate();
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserID = this.authenticationDetails.UserID;
      this.CurrentUserName = this.authenticationDetails.UserName;
      this.CurrentUserRole = this.authenticationDetails.UserRole;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.MenuItems.indexOf('Dashboard') < 0) {
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
    this._FactService.GetFactByPartnerIDAndType(this.CurrentUserName, 'Vendor').subscribe(
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

  GetKRAsByPartnerID(): void {
    this.IsProgressBarVisibile = true;
    this._FactService.GetKRAsByPartnerID(this.SelectedBPCFact.PatnerID).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.KRAsByPartnerID = data as BPCKRA[];
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetBanksByPartnerID(): void {
    this.IsProgressBarVisibile = true;
    this._FactService.GetBanksByPartnerID(this.SelectedBPCFact.PatnerID).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.BanksByPartnerID = data as BPCFactBank[];
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetContactPersonsByPartnerID(): void {
    this.IsProgressBarVisibile = true;
    this._FactService.GetContactPersonsByPartnerID(this.SelectedBPCFact.PatnerID).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.ContactPersonsByPartnerID = data as BPCFactContactPerson[];
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAIACTsByPartnerID(PartnerID: any): void {
    this.IsProgressBarVisibile = true;
    this._FactService.GetAIACTsByPartnerID(PartnerID).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
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
        this.IsProgressBarVisibile = false;
        // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  AcceptAIACT(): void {
    this.SelectedBPCAIACTByPartnerID.ModifiedBy = this.authenticationDetails.UserID.toString();
    this.SelectedBPCAIACTByPartnerID.Status = 'Accepted';
    this.SelectedBPCAIACTByPartnerID.ActionText = 'View';
    this.IsProgressBarVisibile = true;
    this._FactService.AcceptAIACT(this.SelectedBPCAIACTByPartnerID).subscribe(
      (data) => {
        this.notificationSnackBarComponent.openSnackBar('PO Accepted successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  RejectAIACT(): void {
    this.SelectedBPCAIACTByPartnerID.ModifiedBy = this.authenticationDetails.UserID.toString();
    this.SelectedBPCAIACTByPartnerID.Status = 'Rejected';
    this.SelectedBPCAIACTByPartnerID.ActionText = 'View';
    this.IsProgressBarVisibile = true;
    this._FactService.RejectAIACT(this.SelectedBPCAIACTByPartnerID).subscribe(
      (data) => {
        this.notificationSnackBarComponent.openSnackBar('PO Rejected successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  AcceptAIACTs(): void {
    this.SelectedBPCAIACTByPartnerID.ModifiedBy = this.authenticationDetails.UserID.toString();
    this.SelectedBPCAIACTByPartnerID.Status = 'Accepted';
    this.SelectedBPCAIACTByPartnerID.ActionText = 'View';
    this.IsProgressBarVisibile = true;
    this._FactService.AcceptAIACT(this.SelectedBPCAIACTByPartnerID).subscribe(
      (data) => {
        this.notificationSnackBarComponent.openSnackBar('PO Accepted successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  loadSelectedBPCFact(selectedBPCFact: BPCFact): void {
    this.SelectedBPCFact = selectedBPCFact;
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

  getBPCFactSubItemValues(): void {
    this.getBPCKRAValues();
    this.getBPCFactBankValues();
    this.getBPCFactContactPersonValues();
    this.getBPCAIACTValues();
  }

  getBPCKRAValues(): void {
    this.SelectedBPCFactView.BPCKRAs = [];
    // this.SelectedBPCFactView.bPIdentities.push(...this.KRAsByPartnerID);
    this.KRAsByPartnerID.forEach(x => {
      this.SelectedBPCFactView.BPCKRAs.push(x);
    });
  }

  getBPCFactBankValues(): void {
    this.SelectedBPCFactView.BPCFactBanks = [];
    // this.SelectedBPCFactView.BPCFactBanks.push(...this.BanksByPartnerID);
    this.BanksByPartnerID.forEach(x => {
      this.SelectedBPCFactView.BPCFactBanks.push(x);
    });
  }

  getBPCFactContactPersonValues(): void {
    this.SelectedBPCFactView.BPCFactContactPersons = [];
    // this.SelectedBPCFactView.bPIdentities.push(...this.KRAsByPartnerID);
    this.ContactPersonsByPartnerID.forEach(x => {
      this.SelectedBPCFactView.BPCFactContactPersons.push(x);
    });
  }

  getBPCAIACTValues(): void {
    this.SelectedBPCFactView.BPCAIACTs = [];
    // this.SelectedBPCFactView.BPCFactBanks.push(...this.BanksByPartnerID);
    this.AIACTsByPartnerID.forEach(x => {
      this.SelectedBPCFactView.BPCAIACTs.push(x);
    });
  }

  showValidationErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      if (!formGroup.get(key).valid) {
        console.log(key);
      }
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
      if (formGroup.get(key) instanceof FormArray) {
        const FormArrayControls = formGroup.get(key) as FormArray;
        Object.keys(FormArrayControls.controls).forEach(key1 => {
          if (FormArrayControls.get(key1) instanceof FormGroup) {
            const FormGroupControls = FormArrayControls.get(key1) as FormGroup;
            Object.keys(FormGroupControls.controls).forEach(key2 => {
              FormGroupControls.get(key2).markAsTouched();
              FormGroupControls.get(key2).markAsDirty();
              if (!FormGroupControls.get(key2).valid) {
                console.log(key2);
              }
            });
          } else {
            FormArrayControls.get(key1).markAsTouched();
            FormArrayControls.get(key1).markAsDirty();
          }
        });
      }
    });

  }

  actionTextClicked(aIACTByPartnerID: BPCAIACT): void {
    if (aIACTByPartnerID) {
      if (aIACTByPartnerID.ActionText.toLowerCase() === "accept") {
        this.SelectedBPCAIACTByPartnerID = aIACTByPartnerID;
        const Actiontype = 'Accept';
        const Catagory = 'PO';
        this.openConfirmationDialog(Actiontype, Catagory);
      }
      else if (aIACTByPartnerID.ActionText.toLowerCase() === "reject") {
        this.SelectedBPCAIACTByPartnerID = aIACTByPartnerID;
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
    if (this.SelectedBPCFact.PatnerID) {
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
      this.SelectedBPCFact.Type = event.value;
    }
  }

}


