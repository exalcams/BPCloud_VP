import { Component, OnInit } from '@angular/core';
import { BPCInvoiceAttachment, BPCDocumentCenterMaster } from 'app/models/ASN';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { Guid } from 'guid-typescript';
import { AuthenticationDetails } from 'app/models/master';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { AttachmentDetails } from 'app/models/task';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttachmentDialogComponent } from '../attachment-dialog/attachment-dialog.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { SupportMaster, SupportHeader } from 'app/models/Support';
import { SupportdeskService } from 'app/services/supportdesk.service';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-support-ticket',
  templateUrl: './support-ticket.component.html',
  styleUrls: ['./support-ticket.component.scss']
})
export class SupportTicketComponent implements OnInit {

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  PartnerID: string;
  currentUserRole: string;
  invAttach: BPCInvoiceAttachment;
  selectedDocCenterMaster: BPCDocumentCenterMaster;
  fileToUpload: File;
  invoiceAttachment: File;
  math = Math;
  IsProgressBarVisibile: boolean;
  SupportFormGroup: FormGroup;
  supportMaster: SupportMaster[] = [];
  fileToUploadList: File[] = [];
  SupportTicket = new SupportHeader();
  supportticket: SupportHeader;
  dateOfCreation: Date;
  dateOfCreationDay: string;

  notificationSnackBarComponent: NotificationSnackBarComponent;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    public _supportdeskService: SupportdeskService,
  ) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.authenticationDetails = new AuthenticationDetails();
    this.dateOfCreation = new Date();
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
      // if (this.MenuItems.indexOf('Dashboard') < 0) {
      //     this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
      //     );
      //     this._router.navigate(['/auth/login']);
      // }

    } else {
      this._router.navigate(['/auth/login']);
    }

    this.InitializeSupportFormGroup();
    this.GetSupportMasters();
  }
  InitializeSupportFormGroup(): void {
    this.SupportFormGroup = this._formBuilder.group({
      ReasonCode: ['', Validators.required],
      DocumentReferenceNo: ['', Validators.required],
      InvoiceAttachment: [''],
      Remarks: ['', Validators.required]
    });
  }
  AddInvoiceAttachment(): void {

    this._supportdeskService.AddInvoiceAttachment(this.supportticket.SupportID, this.currentUserID.toString(), this.invoiceAttachment).subscribe(
      (dat) => {
        if (this.fileToUploadList && this.fileToUploadList.length) {
          this.AddDocumentCenterAttachment();
        } else {
          // this.notificationSnackBarComponent.openSnackBar(`ASN ${Actiontype === 'Submit' ? 'submitted' : 'saved'} successfully`, SnackBarStatus.success);
          this.IsProgressBarVisibile = false;
        }
      },
      (err) => {
        this.showErrorNotificationSnackBar(err);
      });
  }
  AddDocumentCenterAttachment(): void {
    this._supportdeskService.AddDocumentCenterAttachment(this.supportticket.SupportID, this.currentUserID.toString(), this.fileToUploadList).subscribe(
      (dat) => {
        // this.ResetControl();
        // this.notificationSnackBarComponent.openSnackBar(`ASN ${Actiontype === 'Submit' ? 'submitted' : 'saved'} successfully`, SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        // this.GetASNBasedOnCondition();
      },
      (err) => {
        this.showErrorNotificationSnackBar(err);
      }
    );
  }
  SaveClicked(): void {
    if (this.SupportFormGroup.valid) {
      const dialogConfig: MatDialogConfig = {
        data: {
          Actiontype: 'Create',
          Catagory: 'Ticket'
        },
        panelClass: 'confirmation-dialog'
      };
      const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
      // this.IsProgressBarVisibile = false;
      dialogRef.afterClosed().subscribe(
        result => {
          if (result) {
            this.IsProgressBarVisibile = true;
            this.SupportTicket.ReasionCode = this.SupportFormGroup.get('ReasonCode').value;
            this.SupportTicket.ReasionRemarks = this.SupportFormGroup.get('Remarks').value;           
            this.SupportTicket.DocumentReferenceNo = this.SupportFormGroup.get('DocumentReferenceNo').value;
            this.SupportTicket.PatnerID = this.PartnerID;
            this._supportdeskService.CreateSupportTicket(this.SupportTicket).subscribe(
              (data) => {
                this.supportticket = (data as SupportHeader);
                console.log(this.supportticket);
                // if (this.invoiceAttachment) {
                //   this.AddInvoiceAttachment();
                // } else {
                if (this.fileToUploadList && this.fileToUploadList.length) {
                  this.AddDocumentCenterAttachment();
                  this.IsProgressBarVisibile = false;
                  this.notificationSnackBarComponent.openSnackBar('Ticket Create successfully', SnackBarStatus.success);
                  this._router.navigate(['/pages/supportdesk']);
                } else {
                  // this.ResetControl();
                  // this.notificationSnackBarComponent.openSnackBar(`ASN ${Actiontype === 'Submit' ? 'submitted' : 'saved'} successfully`, SnackBarStatus.success);
                  this.IsProgressBarVisibile = false;
                  // this.GetASNBasedOnCondition();
                }
                // }
                // this._router.navigate(['/pages/orderfulfilmentCenter']);

              },
              (err) => {
                this.IsProgressBarVisibile = false;
                console.error(err);
              }
            );
          }
        });
    }
  }
  showErrorNotificationSnackBar(err: any): void {
    console.error(err);
    this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
    this.IsProgressBarVisibile = false;
  }
  GetSupportMasters(): void {
    this.IsProgressBarVisibile = true;
    this._supportdeskService
      .GetSupportMasters(this.PartnerID)
      .subscribe((data) => {
        if (data) {
          this.supportMaster = <SupportMaster[]>data;
        }
        this.IsProgressBarVisibile = false;
      },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
        });
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
      this._supportdeskService.DowloandInvoiceAttachment(fileName, this.supportticket.SupportID).subscribe(
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
