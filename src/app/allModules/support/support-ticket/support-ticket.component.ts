import { Component, OnInit } from '@angular/core';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { Guid } from 'guid-typescript';
import { AuthenticationDetails, UserWithRole, AppUsage, MenuApp } from 'app/models/master';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { AttachmentDetails } from 'app/models/task';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttachmentDialogComponent } from 'app/notifications/attachment-dialog/attachment-dialog.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { SupportMaster, SupportHeader, SupportHeaderView } from 'app/models/support-desk';
import { SupportDeskService } from 'app/services/support-desk.service';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { MasterService } from 'app/services/master.service';
import { BPCFact } from 'app/models/fact';
import { FactService } from 'app/services/fact.service';
import { POService } from 'app/services/po.service';
import { BPCOFItem } from 'app/models/OrderFulFilment';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-support-ticket',
  templateUrl: './support-ticket.component.html',
  styleUrls: ['./support-ticket.component.scss']
})
export class SupportTicketComponent implements OnInit {

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  Users: UserWithRole[] = [];
  FilteredUsers: UserWithRole[] = [];
  PartnerID: string;
  fileToUpload: File;
  fileToUploadList: File[] = [];
  math = Math;
  IsProgressBarVisibile: boolean;
  SelectedBPCFact: BPCFact;
  SupportTicketFormGroup: FormGroup;
  SupportTicket: SupportHeader;
  SupportTicketView: SupportHeaderView;
  SupportMasters: SupportMaster[] = [];
  SupportHeader: SupportHeader;
  dateOfCreation: Date;
  docRefNo: string;
  reason: string;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  navigator_page: any;
  OFItems: BPCOFItem[] = [];
  AllMenuApp: MenuApp[] = [];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    public _supportDeskService: SupportDeskService,
    private _masterService: MasterService,
    private _FactService: FactService,
    private _POService: POService,
    private _datePipe: DatePipe,
    private _location: Location
  ) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.authenticationDetails = new AuthenticationDetails();
    this.dateOfCreation = new Date();
    this.SupportTicketView = new SupportHeaderView();
    this.SupportTicket = new SupportHeader();
    this.SelectedBPCFact = new BPCFact();
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserName = this.authenticationDetails.UserName;
      this.PartnerID = this.authenticationDetails.UserName;
      this.currentUserRole = this.authenticationDetails.UserRole;
      // this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      // // console.log(this.authenticationDetails);
      // if (this.MenuItems.indexOf('SupportDesk') < 0) {
      //     this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
      //     );
      //     this._router.navigate(['/auth/login']);
      // }

    } else {
      this._router.navigate(['/auth/login']);
    }

    this._activatedRoute.queryParams.subscribe(params => {
      this.docRefNo = params['id'];
      this.reason = params['reason'];
      this.navigator_page = params["navigator_page"];
    });
    console.log(this.navigator_page);
    if (!this.docRefNo) {
      this.docRefNo = '';
    }
    this.InitializeSupportTicketFormGroup();
    this.GetSupportMasters();
    this.GetUsers();
    this.GetFactByPartnerID();
  }
  backbutton(): void {
    // if (this.navigator_page === "orderfulfilmentCenter") {
    //   this._router.navigate(['/orderfulfilment/orderfulfilmentCenter']);
    // }
    // else if (this.navigator_page === "polookup") {
    //   this._router.navigate(['/pages/polookup']);
    // }
    // else if (this.navigator_page === "po-schedules") {
    //   this._router.navigate(['/orderfulfilment/poschedules']);
    // }
    // else if (this.navigator_page === "asnlist") {
    //   this._router.navigate(['/orderfulfilment/asnlist']);
    // }
    this._location.back();
  }
  CreateAppUsage(): void {
    const appUsage: AppUsage = new AppUsage();
    appUsage.UserID = this.currentUserID;
    appUsage.AppName = 'Support ticket';
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
  InitializeSupportTicketFormGroup(): void {
    this.SupportTicketFormGroup = this._formBuilder.group({
      ReasonCode: ['', Validators.required],
      DocumentRefNo: [this.docRefNo, Validators.required],
      Remarks: ['', Validators.required]
    });
  }

  ClearSupportTicketForm(): void {
    this.SupportTicketFormGroup.reset();
    Object.keys(this.SupportTicketFormGroup.controls).forEach(key => {
      this.SupportTicketFormGroup.get(key).markAsUntouched();
    });
  }

  ResetControl(): void {
    this.fileToUpload = null;
    this.fileToUploadList = [];
    this.SupportTicket = null;
    this.SupportTicketView = null;
    this.ClearSupportTicketForm();
  }
  GetFactByPartnerID(): void {
    this._FactService.GetFactByPartnerID(this.currentUserName).subscribe(
      (data) => {
        this.SelectedBPCFact = data as BPCFact;
      },
      (err) => {
        console.error(err);
      }
    );
  }
  GetSupportMasters(): void {
    this.IsProgressBarVisibile = true;
    this._supportDeskService
      .GetSupportMasters()
      .subscribe((data) => {
        if (data) {
          this.SupportMasters = <SupportMaster[]>data;
          if (this.reason) {
            const reson = this.SupportMasters.filter(x => x.ReasonText === this.reason)[0];
            if (reson) {
              this.SupportTicketFormGroup.get('ReasonCode').patchValue(reson.ReasonCode);
            }
            if (this.docRefNo && this.reason === 'Delivery Date Mismatch') {
              this.GetSupportPOItemsByDoc();
            }
          }
        }
        this.IsProgressBarVisibile = false;
      },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
        });
  }
  GetSupportPOItemsByDoc(): void {
    this._POService.GetSupportPOItemsByDoc(this.docRefNo).subscribe(
      (data) => {
        this.OFItems = data as BPCOFItem[];
        let message = '';
        this.OFItems.forEach(x => {
          let delDate = x.DeliveryDate as Date;
          let actDelDate = x.AckDeliveryDate as Date;
          if (delDate && actDelDate && actDelDate !== delDate) {
            message = message + `Delivery date changed from ${this._datePipe.transform(delDate, 'dd/MM/yyyy')} to ${this._datePipe.transform(actDelDate, 'dd/MM/yyyy')} for Item ${x.Item}, `;
          }
        });
        // this.SupportTicketFormGroup.get('Remarks').patchValue(message);
        // this.SupportTicketFormGroup.get('Remarks').disable();
      },
      (err) => {
        console.log(err);
      }
    );
  }
  GetUsers(): void {
    this.IsProgressBarVisibile = true;
    this._masterService.GetAllUsers().subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.Users = <UserWithRole[]>data;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllMenuApp(): void {
    this.IsProgressBarVisibile = true;
    this._masterService.GetAllMenuApp().subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.AllMenuApp = <MenuApp[]>data;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  SaveClicked(): void {
    if (this.SupportTicketFormGroup.valid) {
      this.GetSupportTicket();
      this.OpenNotificationDialog();
    } else {
      this.ShowValidationErrors(this.SupportTicketFormGroup);
    }
  }
  ShowValidationErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      if (!formGroup.get(key).valid) {
        console.log(key);
      }
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
    });

  }
  OnFileClicked(evt): void {
    if (evt.target.files && evt.target.files.length > 0) {
      this.fileToUpload = evt.target.files[0];
      this.fileToUploadList.push(this.fileToUpload);
      console.log(this.fileToUploadList);
    }
  }

  GetSupportTicket(): void {
    if (this.SelectedBPCFact) {
      this.SupportTicket.Client = this.SupportTicketView.Client = this.SelectedBPCFact.Client;
      this.SupportTicket.Company = this.SupportTicketView.Company = this.SelectedBPCFact.Company;
      this.SupportTicket.Type = this.SupportTicketView.Type = this.SelectedBPCFact.Type;
      this.SupportTicket.PatnerID = this.SupportTicketView.PatnerID = this.SelectedBPCFact.PatnerID;
    }
    this.SupportTicket.ReasonCode = this.SupportTicketView.ReasonCode = this.SupportTicketFormGroup.get('ReasonCode').value;
    this.SupportTicket.Remarks = this.SupportTicketView.Remarks = this.SupportTicketFormGroup.get('Remarks').value;
    this.SupportTicket.DocumentRefNo = this.SupportTicketView.DocumentRefNo = this.SupportTicketFormGroup.get('DocumentRefNo').value;
    this.SupportTicket.PatnerID = this.SupportTicketView.PatnerID = this.PartnerID;
    let supportMaster = new SupportMaster();
    supportMaster = this.SupportMasters.find(x => x.ReasonCode === this.SupportTicket.ReasonCode);
    if (supportMaster) {
      this.GetFilteredUsers(supportMaster);
    }
    console.log(this.FilteredUsers);
    this.SupportTicketView.Users = this.FilteredUsers;
  }

  GetFilteredUsers(supportMaster: SupportMaster): any {
    if (supportMaster.Person1 && supportMaster.Person1 != null) {
      let user = new UserWithRole();
      user = this.Users.find(x => x.UserName.toLowerCase() === supportMaster.Person1.toLowerCase());
      this.FilteredUsers.push(user);
    }
    else if (supportMaster.Person2 && supportMaster.Person2 != null) {
      let user = new UserWithRole();
      user = this.Users.find(x => x.UserName.toLowerCase() === supportMaster.Person2.toLowerCase());
      this.FilteredUsers.push(user);
    }
    else if (supportMaster.Person3 && supportMaster.Person3 != null) {
      let user = new UserWithRole();
      user = this.Users.find(x => x.UserName.toLowerCase() === supportMaster.Person3.toLowerCase());
      this.FilteredUsers.push(user);
    }
  }

  CreateSupportTicket(): void {
    this.IsProgressBarVisibile = true;
    this._supportDeskService.CreateSupportTicket(this.SupportTicketView).subscribe(
      (data) => {
        this.SupportHeader = (data as SupportHeader);
        if (this.fileToUploadList && this.fileToUploadList.length) {
          this.AddSupportAttachment();
        } else {
          this.ResetControl();
          this.notificationSnackBarComponent.openSnackBar(`Ticket Created successfully`, SnackBarStatus.success);
          this.IsProgressBarVisibile = false;
          this._router.navigate(['/support/supportdesk']);
        }
      },
      (err) => {
        this.ShowErrorNotificationSnackBar(err);
      }
    );
  }

  AddSupportAttachment(): void {
    this._supportDeskService.AddSupportAttachment(this.SupportHeader.SupportID, this.currentUserID.toString(), this.fileToUploadList).subscribe(
      (dat) => {
        this.notificationSnackBarComponent.openSnackBar('Ticket Created successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        this.ResetControl();
        this._router.navigate(['/support/supportdesk']);
      },
      (err) => {
        this.ShowErrorNotificationSnackBar(err);
      }
    );
  }

  OpenNotificationDialog(): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: 'Create',
        Catagory: 'Ticket'
      },
      panelClass: 'confirmation-dialog'
    };
    const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.CreateSupportTicket();
        }
      });
  }

  ShowErrorNotificationSnackBar(err: any): void {
    console.error(err);
    this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
    this.IsProgressBarVisibile = false;
  }

  GetSupportAttachment(fileName: string, file?: File): void {
    if (file && file.size) {
      const blob = new Blob([file], { type: file.type });
      this.OpenAttachmentDialog(fileName, blob);
    }
    else {
      this.IsProgressBarVisibile = true;
      this._supportDeskService.DownloadSupportAttachment(fileName, this.SupportHeader.SupportID).subscribe(
        data => {
          if (data) {
            let fileType = 'image/jpg';
            fileType = fileName.toLowerCase().includes('.jpg') ? 'image/jpg' :
              fileName.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
                fileName.toLowerCase().includes('.png') ? 'image/png' :
                  fileName.toLowerCase().includes('.gif') ? 'image/gif' :
                    fileName.toLowerCase().includes('.pdf') ? 'application/pdf' : '';
            const blob = new Blob([data], { type: fileType });
            this.OpenAttachmentDialog(fileName, blob);
          }
          this.IsProgressBarVisibile = false;
        },
        error => {
          console.error(error);
          this.IsProgressBarVisibile = false;
        }
      );
    }
  }

  OpenAttachmentDialog(FileName: string, blob: Blob): void {
    const attachmentDetails: AttachmentDetails = {
      FileName: FileName,
      blob: blob
    };
    const dialogConfig: MatDialogConfig = {
      data: attachmentDetails,
      panelClass: 'attachment-dialog'
    };
    const dialogRef = this.dialog.open(AttachmentDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }


}

