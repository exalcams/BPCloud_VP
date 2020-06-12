import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationDetails, UserWithRole } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { BPCPIHeader, BPCPIView, BPCPIItem, BPCProd } from 'app/models/customer';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BPCOFHeader, BPCOFItem, POScheduleLineView } from 'app/models/OrderFulFilment';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { BPCInvoiceAttachment, BPCCountryMaster, BPCCurrencyMaster, BPCDocumentCenterMaster } from 'app/models/ASN';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { MasterService } from 'app/services/master.service';
import { FactService } from 'app/services/fact.service';
import { POService } from 'app/services/po.service';
import { CustomerService } from 'app/services/customer.service';
import { ASNService } from 'app/services/asn.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { AttachmentDetails } from 'app/models/task';
import { AttachmentDialogComponent } from '../pages/attachment-dialog/attachment-dialog.component';
import { SubconService } from 'app/services/subcon.service';

@Component({
  selector: 'app-subcon',
  templateUrl: './subcon.component.html',
  styleUrls: ['./subcon.component.scss']
})
export class SubconComponent implements OnInit {

  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  SelectedPO: BPCOFHeader;
  SelectedPONumber: string;
  POScheduleLines: POScheduleLineView[] = [];
  searchText = '';
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _masterService: MasterService,
    private _FactService: FactService,
    private _POService: POService,
    private _CustomerService: CustomerService,
    private _ASNService: ASNService,
    private _subConService: SubconService,
    private _datePipe: DatePipe,
    private _route: ActivatedRoute,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
    this.SelectedPO = new BPCOFHeader();

  }

  ngOnInit(): void {
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserName = this.authenticationDetails.UserName;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      // if (this.MenuItems.indexOf('PurchaseIndent') < 0) {
      //   this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
      //   );
      //   this._router.navigate(['/auth/login']);
      // }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this._route.queryParams.subscribe(params => {
      this.SelectedPONumber = params['id'];
    });
    this.GetPOByDocAndPartnerID();
  }



  ResetControl(): void {

  }



  ResetFormGroup(formGroup: FormGroup): void {
    formGroup.reset();
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).enable();
      formGroup.get(key).markAsUntouched();
    });
  }
  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }





  GetPOByDocAndPartnerID(): void {
    this._POService.GetPOByDocAndPartnerID(this.SelectedPONumber, this.currentUserName).subscribe(
      (data) => {
        this.SelectedPO = data as BPCOFHeader;
        if (this.SelectedPO) {
          this.LoadSelectedPO(this.SelectedPO);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  LoadSelectedPO(po: BPCOFHeader): void {
    // this.SelectedPurchaseIndentHeader = seletedPurchaseIndent;
    // this.SelectedPurchaseIndentView.PINumber = this.SelectedPurchaseIndentHeader.PINumber;
    // this.SelectedPurchaseIndentNumber = this.SelectedPurchaseIndentHeader.PINumber;
    // this.SetPurchaseIndentHeaderValues();
    // this.GetPurchaseIndentItemsByPI();
    this.GetPOSLByDocAndPartnerID();
  }

  GetPOSLByDocAndPartnerID(): void {
    this._subConService.GetPOSLByDocAndPartnerID(this.SelectedPO.DocNumber, this.currentUserName).subscribe(
      (data) => {
        this.POScheduleLines = data as POScheduleLineView[];

      },
      (err) => {
        console.error(err);
      }
    );
  }

  SetActionToOpenConfirmation(Actiontype: string): void {
    // if (this.SelectedPurchaseIndentHeader.PurchaseIndentNumber) {
    //     const Catagory = 'PurchaseIndent';
    //     this.OpenConfirmationDialog(Actiontype, Catagory);
    // } else {
    //     const Catagory = 'PurchaseIndent';
    //     this.OpenConfirmationDialog(Actiontype, Catagory);
    // }
    const Catagory = 'PurchaseIndent';
    this.OpenConfirmationDialog(Actiontype, Catagory);
  }

  OpenConfirmationDialog(Actiontype: string, Catagory: string): void {
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
          if (Actiontype === 'Save' || Actiontype === 'Submit') {

          }
        }
      });
  }



  showErrorNotificationSnackBar(err: any): void {
    console.error(err);
    this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
    this.IsProgressBarVisibile = false;
  }



  ShowValidationErrors(formGroup: FormGroup): void {
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


  getStatusColor(StatusFor: string): string {
    switch (StatusFor) {
      case 'ASN':
        return this.SelectedPO.Status === 'Open' ? 'gray' : this.SelectedPO.Status === 'ACK' ? '#efb577' : '#34ad65';
      case 'Gate':
        return this.SelectedPO.Status === 'Open' ? 'gray' : this.SelectedPO.Status === 'ACK' ? 'gray' : this.SelectedPO.Status === 'ASN' ? '#efb577' : '#34ad65';
      case 'GRN':
        return this.SelectedPO.Status === 'Open' ? 'gray' : this.SelectedPO.Status === 'ACK' ? 'gray' : this.SelectedPO.Status === 'ASN' ? 'gray' :
          this.SelectedPO.Status === 'Gate' ? '#efb577' : '#34ad65';
      default:
        return '';
    }
  }
  getTimeline(StatusFor: string): string {
    switch (StatusFor) {
      case 'ASN':
        return this.SelectedPO.Status === 'Open' ? 'white-timeline' : this.SelectedPO.Status === 'ACK' ? 'orange-timeline' : 'green-timeline';
      case 'Gate':
        return this.SelectedPO.Status === 'Open' ? 'white-timeline' : this.SelectedPO.Status === 'ACK' ? 'white-timeline' :
          this.SelectedPO.Status === 'ASN' ? 'orange-timeline' : 'green-timeline';
      case 'GRN':
        return this.SelectedPO.Status === 'Open' ? 'white-timeline' : this.SelectedPO.Status === 'ACK' ? 'white-timeline' : this.SelectedPO.Status === 'ASN' ? 'white-timeline' :
          this.SelectedPO.Status === 'Gate' ? 'orange-timeline' : 'green-timeline';
      default:
        return '';
    }
  }

  getRestTimeline(StatusFor: string): string {
    switch (StatusFor) {
      case 'ASN':
        return this.SelectedPO.Status === 'Open' ? 'white-timeline' : this.SelectedPO.Status === 'ACK' ? 'white-timeline' : 'green-timeline';
      case 'Gate':
        return this.SelectedPO.Status === 'Open' ? 'white-timeline' : this.SelectedPO.Status === 'ACK' ? 'white-timeline' :
          this.SelectedPO.Status === 'ASN' ? 'white-timeline' : 'green-timeline';
      case 'GRN':
        return this.SelectedPO.Status === 'Open' ? 'white-timeline' : this.SelectedPO.Status === 'ACK' ? 'white-timeline' : this.SelectedPO.Status === 'ASN' ? 'white-timeline' :
          this.SelectedPO.Status === 'Gate' ? 'white-timeline' : 'green-timeline';
      default:
        return '';
    }
  }


}
