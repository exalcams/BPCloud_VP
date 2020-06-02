import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'app/services/dashboard.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { FormBuilder, NgForm, FormGroup, Validators } from '@angular/forms';
import { SupportdeskService } from 'app/services/supportdesk.service';
import { SupportChartDetails, SupportHeader, SupportItem, BPCSupportAttachment } from 'app/models/Support';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { AttachmentDetails } from 'app/models/task';
import { AttachmentDialogComponent } from '../attachment-dialog/attachment-dialog.component';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';

@Component({
  selector: 'app-support-chat',
  templateUrl: './support-chat.component.html',
  styleUrls: ['./support-chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SupportChatComponent implements OnInit {

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserRole: string;
  PartnerID: string;
  SupportID: string;
  SupportChartDetails: SupportChartDetails = new SupportChartDetails();
  SupportHeader: SupportHeader = new SupportHeader();
  SupportItem: SupportItem[] = [];
  SupportAttachments: BPCSupportAttachment[] = [];
  IsProgressBarVisibile: boolean;
  fileToUpload: File;
  fileToUploadList: File[] = [];
  // dialog: any;
  SupportTicketResponseFormGroup: FormGroup;
  Status: string;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  constructor(
    private route: ActivatedRoute,
    public _supportdeskService: SupportdeskService,
    private _router: Router,
    public snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _formBuilder: FormBuilder
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

    this.route.queryParams.subscribe(params => {
      this.SupportID = params['SupportID'];
      this._supportdeskService.GetSupportChartDetails(this.SupportID, this.PartnerID).subscribe(
        data => {
          if (data) {
            this.SupportChartDetails = data as SupportChartDetails;
            this.SupportHeader = this.SupportChartDetails.supportHeader;
            this.Status = this.SupportHeader.Status;
            this.SupportItem = this.SupportChartDetails.supportItem;
            this.SupportAttachments = this.SupportChartDetails.supportAttachments;
            console.log(this.SupportItem);
            // console.log(this.SupportChartDetails);
          }
        },
        err => {
          console.error(err);
        }
      );
    });
    this.SupportTicketResponseFormGroup = this._formBuilder.group({
      Comments: ['', Validators.required],
    });
  }

  ngOnInit() {
  }
  GetInvoiceAttachment(fileName: string, file?: File): void {
    if (file && file.size) {
      const blob = new Blob([file], { type: file.type });
      this.OpenAttachmentDialog(fileName, blob);
    }
    else {
      this.IsProgressBarVisibile = true;
      this._supportdeskService.DowloandInvoiceAttachment(fileName, this.SupportID).subscribe(
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
    const dialogRef = this._dialog.open(AttachmentDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
  getStatusColor(StatusFor: string): string {
    // alert(this.Status);
    switch (StatusFor) {
      case 'Pending':
        return this.Status === 'Open' ? 'gray' : this.Status === 'Pending' ? '#efb577' : '#34ad65';
      case 'Closed':
        return this.Status === 'Open' ? 'gray' : this.Status === 'Pending' ? 'gray' : this.Status === 'Closed' ? '#34ad65' : this.Status === 'Pending' ? '#efb577' : '#34ad65';
      default:
        return '';
    }
  }
  getTimeline(StatusFor: string): string {
    switch (StatusFor) {
      case 'Pending':
        return this.Status === 'Open' ? 'white-timeline' : this.Status === 'Pending' ? 'orange-timeline' : 'green-timeline';
      case 'Closed':
        return this.Status === 'Open' ? 'white-timeline' : this.Status === 'Pending' ? 'white-timeline' : this.Status === 'Closed' ? 'orange-timeline' : 'green-timeline';
      default:
        return '';
    }
  }

  getRestTimeline(StatusFor: string): string {
    switch (StatusFor) {
      case 'Pending':
        return this.Status === 'Open' ? 'white-timeline' : this.Status === 'Pending' ? 'white-timeline' : 'green-timeline';
      case 'Closed':
        return this.Status === 'Open' ? 'white-timeline' : this.Status === 'Pending' ? 'white-timeline' : this.Status === 'Closed' ? 'white-timeline' : 'green-timeline';
      default:
        return '';
    }
  }


  ValidateSupportTicketResponse(): void {
    if (this.SupportTicketResponseFormGroup.valid) {
      const Actiontype = 'Reply';
      const Catagory = 'Support ticket';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    } else {
      this.ShowValidationErrors(this.SupportTicketResponseFormGroup);
    }
  }
  OpenConfirmationDialog(Actiontype: string, Catagory: string): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: Actiontype,
        Catagory: Catagory
      },
      panelClass: 'confirmation-dialog'
    };
    const dialogRef = this._dialog.open(NotificationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          if (Actiontype === 'Reply') {
            this.CreateSupportTicketResponse();
          }
          // else if (Actiontype === 'Create') {
          //   this.CreateSupportTicket();
          // }
        }
      });
  }
  CreateSupportTicketResponse(): void {
    this.IsProgressBarVisibile = true;
    const supportTicketResponse: SupportItem = new SupportItem();
    supportTicketResponse.SupportID = this.SupportID;
    supportTicketResponse.PatnerID = this.PartnerID;
    supportTicketResponse.Remarks = this.SupportTicketResponseFormGroup.get('Comments').value;
    supportTicketResponse.CreatedBy = this.PartnerID;
    this._supportdeskService.CreateSupportTicketResponse(supportTicketResponse).subscribe(
      () => {
        this.IsProgressBarVisibile = false;
        // this.notificationSnackBarComponent.openSnackBar('Support Ticket Response details updated successfully', SnackBarStatus.success);
        this.GetSupportItem();
        this.ResetForm();
        // this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }
  ResetForm(): void {
    this.ResetSupportTicketResponseForm();
  }
  ResetSupportTicketResponseForm(): void {
    this.SupportTicketResponseFormGroup.reset();
    Object.keys(this.SupportTicketResponseFormGroup.controls).forEach(key => {
      this.SupportTicketResponseFormGroup.get(key).markAsUntouched();
    });
  }
  GetSupportItem() {
    // this.IsProgressBarVisibile = true;
    this._supportdeskService
      .GetSupportItems(this.SupportID, this.PartnerID)
      .subscribe((data) => {
        if (data) {
          this.SupportItem = <SupportItem[]>data;
        }
        this.IsProgressBarVisibile = false;
      },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
        });
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
}
