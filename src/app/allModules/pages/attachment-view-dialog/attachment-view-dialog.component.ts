import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { AttachmentDetails } from 'app/models/task';
import { saveAs } from 'file-saver';
import { BPCInvoiceAttachment } from 'app/models/ASN';
import { AttachmentDialogComponent } from '../attachment-dialog/attachment-dialog.component';
import { DashboardService } from 'app/services/dashboard.service';

@Component({
  selector: 'attachment-view-dialog',
  templateUrl: './attachment-view-dialog.component.html',
  styleUrls: ['./attachment-view-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AttachmentViewDialogComponent implements OnInit {
  isProgressBarVisibile: boolean;
  public AttachmentData: any;
  constructor(
    private dialog: MatDialog,
    public _dashboardService: DashboardService,
    public matDialogRef: MatDialogRef<AttachmentViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public ofAttachments: BPCInvoiceAttachment[],
    private sanitizer: DomSanitizer
  ) { this.isProgressBarVisibile = false ; }

  ngOnInit(): void {
  }

  closeClicked(): void {
    this.matDialogRef.close(null);
  }

  attachmentClicked(attachment: BPCInvoiceAttachment): void {
    this.DownloadOfAttachment(attachment.AttachmentName, attachment.AttachmentName);
  }

  DownloadOfAttachment(fileName: string, docNumber: string): void {
    this.isProgressBarVisibile = true;
    this._dashboardService.DownloadOfAttachment(fileName, docNumber).subscribe(
      data => {
        if (data) {
          let fileType = 'image/jpg';
          fileType = fileName.toLowerCase().includes('.jpg') ? 'image/jpg' :
            fileName.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
              fileName.toLowerCase().includes('.png') ? 'image/png' :
                fileName.toLowerCase().includes('.gif') ? 'image/gif' :
                  fileName.toLowerCase().includes('.pdf') ? 'application/pdf' : '';
          const blob = new Blob([data], { type: fileType });
          this.openAttachmentDialog(fileName, blob);
        }
        this.isProgressBarVisibile = false;
      },
      error => {
        console.error(error);
        this.isProgressBarVisibile = false;
      }
    );
  }

  openAttachmentDialog(FileName: string, blob: Blob): void {
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
