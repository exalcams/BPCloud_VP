import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialogConfig, MatDialog } from "@angular/material";
import { fuseAnimations } from "@fuse/animations";
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ExcelService } from 'app/services/excel.service';
import { DatePipe } from '@angular/common';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { DataMigrationService } from 'app/services/data-migration.service';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import * as XLSX from 'xlsx';
import { BPCFactBank, BPCFact } from 'app/models/fact';
import { FactService } from 'app/services/fact.service';
@Component({
  selector: "app-data-migration",
  templateUrl: "./data-migration.component.html",
  styleUrls: ["./data-migration.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DataMigrationComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserRole: string;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  arrayBuffer: any;
  fileToUpload: File;
  fileToUploadList: File[] = [];
  BPCFacts: BPCFact[] = [];
  BPCFactBanks: BPCFactBank[] = [];
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    public snackBar: MatSnackBar,
    private _dataMigrationService: DataMigrationService,
    private _factService: FactService,
    private _excelService: ExcelService,
    private _datePipe: DatePipe,
    private dialog: MatDialog,
  ) {
    this.IsProgressBarVisibile = false;
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.MenuItems.indexOf('DataMigration') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    // this.InitializeSearchFormGroup();
    // this.GetAllPayments();
  }

  UploadDataMigrationClicked(): void {
    if (this.fileToUpload) {
      this.fileToUploadList.push(this.fileToUpload);
      this.fileToUpload = null;
    }
    this.SetActionToOpenConfirmation('Submit');
  }

  UploadDataMigrationAttachment(Actiontype: string): void {
    this.IsProgressBarVisibile = true;
    if (this.fileToUploadList && this.fileToUploadList.length) {
      // this.UpdateFacts();
      this.UpdateFactBanks();
      this.IsProgressBarVisibile = false;
      // this._dataMigrationService.UploadDataMigrationAttachment(this.currentUserID.toString(), this.fileToUploadList).subscribe(
      //   (dat) => {
      //     this.ResetControl();
      //     this.notificationSnackBarComponent.openSnackBar(`Data Migration ${Actiontype === 'Submit' ? 'submitted' : 'saved'} successfully`, SnackBarStatus.success);
      //     this.IsProgressBarVisibile = false;
      //   },
      //   (err) => {
      //     this.showErrorNotificationSnackBar(err);
      //   });
    }
  }

  UpdateFacts(): void {
    this.IsProgressBarVisibile = true;
    if (this.BPCFacts) {
      this._factService.CreateFacts(this.BPCFacts).subscribe((data) => {
        this.IsProgressBarVisibile = false;
      },
        (err) => {
          this.IsProgressBarVisibile = false;
        });
    }
  }

  UpdateFactBanks(): void {
    this.IsProgressBarVisibile = true;
    if (this.BPCFactBanks) {
      this._factService.CreateFactBanks(this.BPCFactBanks).subscribe((data) => {
        this.IsProgressBarVisibile = false;
      },
        (err) => {
          this.IsProgressBarVisibile = false;
        });
    }
  }


  ResetControl(): void {
    this.fileToUpload = null;
    this.fileToUploadList = [];
  }

  SetActionToOpenConfirmation(Actiontype: string): void {
    const Catagory = 'Data Migration';
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
    dialogRef.updateSize('900', '300');
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          if (Actiontype === 'Submit') {
            this.UploadDataMigrationAttachment(Actiontype);
          }
        }
      });
  }

  handleFileInput(evt): void {
    if (evt.target.files && evt.target.files.length > 0) {
      this.fileToUpload = evt.target.files[0];
      // this.fileToUploadList.push(this.fileToUpload);
    }
  }

  handleFileInput1(event): void {
    this.fileToUpload = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.fileToUpload);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
      const bstr = arr.join("");
      const workbook = XLSX.read(bstr, { type: "binary" });
      workbook.SheetNames.forEach(element => {
        if (element.toLowerCase() === 'bpc_fact') {
          const worksheet1 = workbook.Sheets[element];
          this.BPCFacts = XLSX.utils.sheet_to_json(worksheet1, { raw: true }) as BPCFact[];
        }
        else if (element.toLowerCase() === 'bpc_fact_bank') {
          const worksheet1 = workbook.Sheets[element];
          this.BPCFactBanks = XLSX.utils.sheet_to_json(worksheet1, { raw: true }) as BPCFactBank[];
          // this.AddFactBank(bPCFactBanks);
        }
      });
      // const first_sheet_name = workbook.SheetNames[0];
      // const worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      // const arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      // this.fileToUploadList = [];
      // console.log(this.fileToUploadList);
    };
  }

  AddFactBank(bankArrayList: any): void {
    for (let i = 0; i < bankArrayList.length; i++) {
      const bPCFactBank = new BPCFactBank();
      const obj = bankArrayList[i];
      bPCFactBank.PatnerID = obj.Partnerid;
      bPCFactBank.BankName = obj.Bankname;
      bPCFactBank.BankID = obj.Bankid;
      bPCFactBank.AccountNumber = obj.Accountnumber;
      bPCFactBank.AccountName = obj.Accountname;
      this.BPCFactBanks.push(bPCFactBank);
    }
    console.log(this.BPCFactBanks);
  }

  showErrorNotificationSnackBar(err: any): void {
    console.error(err);
    this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
    this.IsProgressBarVisibile = false;
  }

}
