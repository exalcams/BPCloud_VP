import { Component, OnInit } from '@angular/core';
import { BPCInvoiceAttachment, BPCDocumentCenterMaster } from 'app/models/ASN';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { Guid } from 'guid-typescript';
import { AuthenticationDetails, UserWithRole } from 'app/models/master';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { AttachmentDetails } from 'app/models/task';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttachmentDialogComponent } from '../attachment-dialog/attachment-dialog.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { SupportMaster, SupportHeader, SupportHeaderView } from 'app/models/support-desk';
import { SupportDeskService } from 'app/services/support-desk.service';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { MasterService } from 'app/services/master.service';

@Component({
  selector: 'app-support-ticket',
  templateUrl: './support-ticket.component.html',
  styleUrls: ['./support-ticket.component.scss']
})
export class SupportTicketComponent implements OnInit {

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserRole: string;
  Users: UserWithRole[] = [];
  FilteredUsers: UserWithRole[] = [];
  PartnerID: string;
  invAttach: BPCInvoiceAttachment;
  selectedDocCenterMaster: BPCDocumentCenterMaster;
  fileToUpload: File;
  fileToUploadList: File[] = [];
  invoiceAttachment: File;
  math = Math;
  IsProgressBarVisibile: boolean;
  SupportTicketFormGroup: FormGroup;
  SupportTicket: SupportHeader;
  SupportTicketView: SupportHeaderView;
  SupportMasters: SupportMaster[] = [];
  SupportHeader: SupportHeader;
  dateOfCreation: Date;
  dateOfCreationDay: string;

  notificationSnackBarComponent: NotificationSnackBarComponent;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    public _supportDeskService: SupportDeskService,
    private _masterService: MasterService
  ) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.authenticationDetails = new AuthenticationDetails();
    this.dateOfCreation = new Date();
    this.SupportTicketView = new SupportHeaderView();
    this.SupportTicket = new SupportHeader();
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
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

    this.InitializeSupportTicketFormGroup();
    this.GetSupportMasters();
    this.GetUsers();
  }

  InitializeSupportTicketFormGroup(): void {
    this.SupportTicketFormGroup = this._formBuilder.group({
      ReasonCode: ['', Validators.required],
      DocumentRefNo: ['', Validators.required],
      InvoiceAttachment: [''],
      Remarks: ['', Validators.required]
    });
  }

  GetSupportMasters(): void {
    this.IsProgressBarVisibile = true;
    this._supportDeskService
      .GetSupportMasters(this.PartnerID)
      .subscribe((data) => {
        if (data) {
          this.SupportMasters = <SupportMaster[]>data;
        }
        this.IsProgressBarVisibile = false;
      },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
        });
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

  SaveClicked(): void {
    if (this.SupportTicketFormGroup.valid) {
      this.GetSupportTicket();
      this.OpenNotificationDialog();
    }
  }

  GetSupportTicket(): void {
    this.SupportTicket.ReasonCode = this.SupportTicketView.ReasonCode = this.SupportTicketFormGroup.get('ReasonCode').value;
    this.SupportTicket.ReasonRemarks = this.SupportTicketView.ReasonRemarks = this.SupportTicketFormGroup.get('Remarks').value;
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
          this._router.navigate(['/pages/supportdesk']);
        }
      },
      (err) => {
        this.showErrorNotificationSnackBar(err);
      }
    );
  }

  ResetControl(): void {
    this.fileToUpload = null;
    this.fileToUploadList = [];
    this.SupportTicket = null;
    this.SupportTicketView = null;
  }

  AddInvoiceAttachment(): void {

    this._supportDeskService.AddInvoiceAttachment(this.SupportHeader.SupportID, this.currentUserID.toString(), this.invoiceAttachment).subscribe(
      (dat) => {
        if (this.fileToUploadList && this.fileToUploadList.length) {
          this.AddSupportAttachment();
        } else {
          // this.notificationSnackBarComponent.openSnackBar(`ASN ${Actiontype === 'Submit' ? 'submitted' : 'saved'} successfully`, SnackBarStatus.success);
          this.IsProgressBarVisibile = false;
        }
      },
      (err) => {
        this.showErrorNotificationSnackBar(err);
      });
  }

  AddSupportAttachment(): void {
    this._supportDeskService.AddSupportAttachment(this.SupportHeader.SupportID, this.currentUserID.toString(), this.fileToUploadList).subscribe(
      (dat) => {
        this.notificationSnackBarComponent.openSnackBar('Ticket Created successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        this.ResetControl();
        this._router.navigate(['/pages/supportdesk']);
      },
      (err) => {
        this.showErrorNotificationSnackBar(err);
      }
    );
  }

  showErrorNotificationSnackBar(err: any): void {
    console.error(err);
    this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
    this.IsProgressBarVisibile = false;
  }

  handleFileInput1(evt): void {
    if (evt.target.files && evt.target.files.length > 0) {
      // if (this.invoiceAttachment && this.invoiceAttachment.name) {
      //   this.notificationSnackBarComponent.openSnackBar('Maximum one attachment is allowed, old is attachment is replaced', SnackBarStatus.warning);
      // }
      // if (this.invAttach && this.invAttach.AttachmentName) {
      //   this.notificationSnackBarComponent.openSnackBar('Maximum one attachment is allowed, old is attachment is replaced', SnackBarStatus.warning);
      // }
      this.invoiceAttachment = evt.target.files[0];
      this.fileToUploadList.push(this.invoiceAttachment);
      // this.invAttach = new BPCInvoiceAttachment();
    }
    // if (evt.target.files && evt.target.files.length > 0) {
    //   this.fileToUpload = evt.target.files[0];
    //   this.fileToUploadList.push(this.fileToUpload);
    // }
  }

  handleFileInput(evt): void {
    if (evt.target.files && evt.target.files.length > 0) {
      this.fileToUpload = evt.target.files[0];
      this.fileToUploadList.push(this.fileToUpload);
      console.log(this.fileToUploadList);
    }
  }

  // handleFileInput(evt): void {
  //   if (evt.target.files && evt.target.files.length > 0) {
  //     const fil = evt.target.files[0] as File;
  //     if (fil.type.includes(this.selectedDocCenterMaster.Extension)) {
  //       const fileSize = this.math.round(fil.size / 1024);
  //       if (fileSize <= this.selectedDocCenterMaster.SizeInKB) {
  //         this.fileToUpload = fil;
  //         // this.fileToUploadList.push(this.fileToUpload);
  //         // this.DocumentCenterFormGroup.get('Filename').patchValue(this.fileToUpload.name);
  //       } else {
  //         this.notificationSnackBarComponent.openSnackBar(`Maximum allowed file size is ${this.selectedDocCenterMaster.SizeInKB} KB only`, SnackBarStatus.danger);
  //       }
  //     } else {
  //       this.notificationSnackBarComponent.openSnackBar(`Please select only ${this.selectedDocCenterMaster.Extension} file`, SnackBarStatus.danger);
  //     }
  //   }
  // }

  GetInvoiceAttachment(fileName: string, file?: File): void {
    if (file && file.size) {
      const blob = new Blob([file], { type: file.type });
      this.OpenAttachmentDialog(fileName, blob);
    }
    else {
      this.IsProgressBarVisibile = true;
      this._supportDeskService.DowloandInvoiceAttachment(fileName, this.SupportHeader.SupportID).subscribe(
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
