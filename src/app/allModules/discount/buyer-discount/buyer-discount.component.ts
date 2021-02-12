import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatMenuTrigger, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { AuthenticationDetails } from 'app/models/master';
import { BPCPayDis } from 'app/models/Payment.model';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { DiscountService } from 'app/services/discount.service';
import { Guid } from 'guid-typescript';
import { DiscountDialogueComponent } from '../discount-dialogue/discount-dialogue.component';

@Component({
  selector: 'app-buyer-discount',
  templateUrl: './buyer-discount.component.html',
  styleUrls: ['./buyer-discount.component.scss']
})
export class BuyerDiscountComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  MenuItems: string[];
  BGClassName: any;
  fuseConfig: any;
  BuyerDiscountData: BPCPayDis[];
  notificationSnackBarComponent:NotificationSnackBarComponent;
  BuyerDiscDisplayedColumns = ["PartnerID", "InvoiceNumber", "InvoiceDate", "DocumentNumber", "DocumentDate", "PaidAmount",
    "BalanceAmount","PostDiscountAmount", "DueDate","ProfitCenter", "Proceed"];
  BuyerDiscDataSource: MatTableDataSource<BPCPayDis>;
  @ViewChild(MatPaginator) discountPaginator: MatPaginator;
  @ViewChild(MatSort) discountSort: MatSort;
  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;
  isProgressBarVisibile:boolean;

  constructor(private _discountService: DiscountService,
     public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private _fuseConfigService: FuseConfigService,
    private _router:Router
    )
     {
      this.isProgressBarVisibile = false;
      this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
   }

  ngOnInit() {
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserName = this.authenticationDetails.UserName;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      // if (this.MenuItems.indexOf('ASN') < 0) {
      //     this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
      //     );
      //     this._router.navigate(['/auth/login']);
      // }

    } else {
      this._router.navigate(['/auth/login']);
    }
    this.SetUserPreference();
    this.GetTableData();
  }

  SetUserPreference(): void {
    this._fuseConfigService.config
      .subscribe((config) => {
        this.fuseConfig = config;
        this.BGClassName = config;
      });
    // this._fuseConfigService.config = this.fuseConfig;
  }

  GetTableData() {
    this.isProgressBarVisibile=true;
    this._discountService.GetDiscountByPartnerID(this.currentUserName).subscribe(data => {
      console.log(data);
      this.BuyerDiscountData = data;
      this.BuyerDiscDataSource = new MatTableDataSource(this.BuyerDiscountData);
      this.BuyerDiscDataSource.paginator = this.discountPaginator;
      this.BuyerDiscDataSource.sort = this.discountSort;
      this.isProgressBarVisibile=false;
    },err=>{

    })
  }

  handleProceed(item) {
    this.OpenProceedeDialogue(item);
  }

  OpenProceedeDialogue(Data: any) {
    Data.isBuyer = true;
    const dialogConfig: MatDialogConfig = {
      panelClass: 'discount-dialog',
      data: Data
    };
    const dialogRef = this.dialog.open(DiscountDialogueComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        console.log(result);
        if (result.Status=="Accepted") {
          result.ApprovedBy=this.currentUserName;
          this.ApproveDiscount(result);
          //console.log(result);
        }
        else if(result.Status=="Rejected"){
          this.RejectDiscount(result);
        }
      });
  }
  ApproveDiscount(data: BPCPayDis) {
    this.isProgressBarVisibile=true;
    this._discountService.ApproveBPCPayDiscount(data).subscribe(x => {
      this.isProgressBarVisibile=false;
      this.notificationSnackBarComponent.openSnackBar('Discount Approved', SnackBarStatus.success);
      
    },
      err => {
        console.log(err);
        this.isProgressBarVisibile=false;
        this.notificationSnackBarComponent.openSnackBar("something went wrong", SnackBarStatus.danger);
        
      });
  }
  RejectDiscount(data: BPCPayDis) {
    this.isProgressBarVisibile=true;
    this._discountService.RejecteBPCPayDiscount(data).subscribe(x => {
      this.isProgressBarVisibile=false;
      this.notificationSnackBarComponent.openSnackBar('Discount Rejected', SnackBarStatus.success);
    },
      err => {
        this.isProgressBarVisibile=false;
        this.notificationSnackBarComponent.openSnackBar("something went wrong", SnackBarStatus.danger);
      });
  }

}
