import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MenuApp, AuthenticationDetails, AppUsage, UserWithRole } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatTableDataSource, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { MasterService } from 'app/services/master.service';
import { FactService } from 'app/services/fact.service';
import { VendorMasterService } from 'app/services/vendor-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CBPLocation } from 'app/models/vendor-master';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { Guid } from 'guid-typescript';
import { BPCFact, BPCFactView, BPCFactContactPerson, BPCKRA, BPCFactBank, BPCAIACT, BPCCertificate, FactViewSupport, BPCCertificateAttachment } from 'app/models/fact';
import { SupportDeskService } from 'app/services/support-desk.service';
import { SupportHeaderView, SupportMaster, SupportHeader } from 'app/models/support-desk';
import { formatDate } from '@angular/common';
import { forEach } from 'lodash';
import { InformationDialogComponent } from 'app/notifications/information-dialog/information-dialog.component';
import { AttachmentDetails } from 'app/models/task';
import { AttachmentDialogComponent } from 'app/notifications/attachment-dialog/attachment-dialog.component';
import { OfAttachmentData } from 'app/models/OrderFulFilment';
import { UpdateAttachmentComponent } from './update-attachment/update-attachment.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-fact',
  templateUrl: './fact.component.html',
  styleUrls: ['./fact.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class FactComponent implements OnInit {
  BGClassName: any;
  fuseConfig: any;
  MenuItems: string[];
  AllMenuApps: MenuApp[] = [];
  SelectedMenuApp: MenuApp;
  authenticationDetails: AuthenticationDetails;
  CurrentUserID = Guid.parse("100744");
  currentUserName = "100744";
  CurrentUserRole = '';
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  IsDisplayPhone2: boolean;
  IsDisplayEmail2: boolean;
  FactFormGroup: FormGroup;
  KRAFormGroup: FormGroup;
  bankDetailsFormGroup: FormGroup;
  ContactPersonFormGroup: FormGroup;
  AIACTFormGroup: FormGroup;
  CertificateFormGroup: FormGroup;
  searchText = '';
  AllFacts: BPCFact[] = [];
  selectID: string;
  SelectedBPCFactSupport: FactViewSupport;
  SelectedBPCFact: BPCFact;
  SelectedBPCFactView: BPCFactView;
  KRAsByPartnerID: BPCKRA[] = [];
  BanksByPartnerID: BPCFactBank[] = [];
  BankSupport: BPCFactBank[] = [];
  CertificateSupport: BPCCertificate[] = [];
  CertificateFileList: BPCCertificateAttachment[] = [];
  ContactPersonsByPartnerID: BPCFactContactPerson[] = [];
  AIACTsByPartnerID: BPCAIACT[] = [];
  CertificatesByPartnerID: BPCCertificate[] = [];
  KRADisplayedColumns: string[] = [
    'KRA',
    'KRAText',
    'KRAValue',
    'EvalDate',
    // 'Action'
  ];
  bankDetailsDisplayedColumns: string[] = [
    'AccountNumber',
    // 'Name',
    'AccountName',
    'BankName',
    'BankID',
    // 'City',
    'Action'
  ];

  ContactPersonDisplayedColumns: string[] = [
    'Name',
    'ContactPersonID',
    'ContactNumber',
    'Email',
    // 'Action'
  ];
  AIACTDisplayedColumns: string[] = [
    'SeqNo',
    'Date',
    'Time',
    'ActionText',
    // 'Action'
  ];
  CertificateDisplayedColumns: string[] = [
    'CertificateType',
    'CertificateName',
    'Validity',
    'Attachment',
    'Action'
  ];
  ///
  Bankadd = 0;
  BankClear = true;
  Certificateadd = 0;
  Temp: any;
  Bankrender = false;
  Certificaterender = false;
  Bankcount = 0;
  Certificatecount = 0;
  BankOriginal = 0;
  Certificateprevious = 0;
  change = true;
  bankDeleteIndex = null;
  CertificateDeleteIndex = null;
  BankPrevious = 0;
  deletefact = false;
  ////
  KRADataSource = new MatTableDataSource<BPCKRA>();
  bankDetailsDataSource = new MatTableDataSource<BPCFactBank>();
  ContactPersonDataSource = new MatTableDataSource<BPCFactContactPerson>();
  AIACTDataSource = new MatTableDataSource<BPCAIACT>();
  CertificateDataSource = new MatTableDataSource<BPCCertificate>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild('iDNumber') iDNumber: ElementRef;
  @ViewChild('EvalDate') EvalDate: ElementRef;
  @ViewChild('accHolderName') accHolderName: ElementRef;
  @ViewChild('AccountName') AccountName: ElementRef;
  @ViewChild('bankName') bankName: ElementRef;
  @ViewChild('BankID') BankID: ElementRef;
  @ViewChild('bankCity') bankCity: ElementRef;
  @ViewChild('ContactPersonID') ContactPersonID: ElementRef;
  @ViewChild('title') title: ElementRef;
  @ViewChild('ContactNumber') ContactNumber: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('activityDate') activityDate: ElementRef;
  @ViewChild('activityTime') activityTime: ElementRef;
  @ViewChild('activityText') activityText: ElementRef;
  fileToUpload: File = null;
  fileToUploadList: File[] = [];

  math = Math;
  FactFormGroupNew: FormGroup;
  Users: UserWithRole[] = [];
  FilteredUsers: UserWithRole[] = [];
  SupportMasters: SupportMaster[] = [];

  SupportHeader: SupportHeader;
  //BankTable
  BankTable = [];
  Account_Number = '';
  Account_Name = '';
  Bank_ID = '';
  Bank_Name = '';
  bankIndex: any;
  BankTemp: BPCFactBank;
  CerificateTemp: BPCCertificate;
  PerviousCertificate: number;
  fileStatus: boolean;
  viewattachmentData: BPCCertificate;
  sub: any;
  id: number;
  renderdata: number;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _masterService: MasterService,
    private _FactService: FactService,
    private _vendorMasterService: VendorMasterService,
    public _supportDeskService: SupportDeskService,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    // this._fuseConfigService.config = {
    //   layout: {
    //     navbar: {
    //       hidden: true
    //     },
    //     toolbar: {
    //       hidden: true
    //     },
    //     footer: {
    //       hidden: true
    //     },
    //     sidepanel: {
    //       hidden: true
    //     }
    //   }
    // };
    this.SelectedBPCFact = new BPCFact();
    this.SelectedBPCFactView = new BPCFactView();
    this.SelectedBPCFactSupport = new FactViewSupport();
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
    this.IsDisplayPhone2 = false;
    this.IsDisplayEmail2 = false;
  }

  ngOnInit(): void {
    this.SetUserPreference();
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserID = this.authenticationDetails.UserID;
      this.currentUserName = this.authenticationDetails.UserName;
      this.CurrentUserRole = this.authenticationDetails.UserRole;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.MenuItems.indexOf('Fact') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this._router.navigate(['/auth/login']);
      }

      this.CreateAppUsage();
      this.InitializeFactFormGroup();
      this.InitializeKRAFormGroup();
      this.InitializeBankDetailsFormGroup();
      this.InitializeContactPersonFormGroup();
      this.InitializeCertificateFormGroup();
      this.InitializeAIACTFormGroup();
      this.GetFactByPartnerIDAndType();
      this.GetSupportMasters();
      this.GetUsers();

      // TO display backbutton
      this.sub = this.route.queryParams.subscribe(params => {
        this.renderdata = +params['render'] || 0;
      });
      this.sub.unsubscribe();

      this.BankTable.push({
        AccountNumber: "",
        AccountName: "",
        BankID: "",
        BankName: "starsb"
      });
    } else {
      this._router.navigate(['/auth/login']);
    }
  }
  CreateAppUsage(): void {
    const appUsage: AppUsage = new AppUsage();
    appUsage.UserID = this.CurrentUserID;
    appUsage.AppName = 'My details';
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
  SetUserPreference(): void {
    this._fuseConfigService.config
      .subscribe((config) => {
        this.fuseConfig = config;
        this.BGClassName = config;
      });
    // this._fuseConfigService.config = this.fuseConfig;
  }
  InitializeFactFormGroup(): void {
    this.FactFormGroup = this._formBuilder.group({
      Client: ['', Validators.required],
      Company: ['', Validators.required],
      LegalName: ['', Validators.required],
      AddressLine1: ['', Validators.required],
      AddressLine2: ['', Validators.required],
      City: ['', Validators.required],
      State: ['', Validators.required],
      Country: ['', Validators.required],
      PinCode: ['', Validators.required],
      Type: [''],
      Phone1: ['', [Validators.required, Validators.pattern('^(\\+91[\\-\\s]?)?[0]?(91)?[6789]\\d{9}$')]],
      Phone2: ['', [Validators.pattern('^(\\+91[\\-\\s]?)?[0]?(91)?[6789]\\d{9}$')]],
      Email1: ['', [Validators.required, Validators.email]],
      Email2: ['', [Validators.email]],
    });
    // this.FactFormGroup.get('City').disable();
    // this.FactFormGroup.get('State').disable();
    // this.FactFormGroup.get('Country').disable();
    // this.FactFormGroup.get('Client').disable();
    // this.FactFormGroup.get('Company').disable();
    // this.FactFormGroup.get('LegalName').disable();
    // this.FactFormGroup.get('PinCode').disable();
    this.FactFormGroup.disable();
  }

  InitializeKRAFormGroup(): void {
    this.KRAFormGroup = this._formBuilder.group({
      Type: ['', Validators.required],
      KRAText: ['', Validators.required],
      EvalDate: ['', Validators.required],
    });
  }

  InitializeBankDetailsFormGroup(): void {
    this.bankDetailsFormGroup = this._formBuilder.group({
      AccountNumber: ['', Validators.required],
      AccountName: ['', Validators.required],
      BankName: ['', Validators.required],
      BankID: ['', Validators.required],
    });
    this.bankDetailsFormGroup.disable();
  }

  InitializeContactPersonFormGroup(): void {
    this.ContactPersonFormGroup = this._formBuilder.group({
      Name: ['', Validators.required],
      ContactPersonID: ['', Validators.required],
      ContactNumber: ['', [Validators.required, Validators.pattern('^(\\+91[\\-\\s]?)?[0]?(91)?[6789]\\d{9}$')]],
      Email: ['', [Validators.required, Validators.email]],
    });
    this.ContactPersonFormGroup.disable();
  }

  InitializeAIACTFormGroup(): void {
    this.AIACTFormGroup = this._formBuilder.group({
      SeqNo: ['', Validators.required],
      Date: ['', Validators.required],
      Time: ['', Validators.required],
      ActionText: ['', Validators.required],
    });
  }

  InitializeCertificateFormGroup(): void {
    this.CertificateFormGroup = this._formBuilder.group({
      CertificateType: ['', Validators.required],
      CertificateName: ['', Validators.required],
      Validity: ['', Validators.required],
      // Attachment: ['', Validators.required],
    });
    this.CertificateFormGroup.disable();
    this.CertificateFormGroup.get('CertificateName').disable();
  }

  ResetControl(): void {
    this.SelectedBPCFact = new BPCFact();
    this.SelectedBPCFactView = new BPCFactView();
    this.selectID = '';
    // this.FactFormGroup.reset();
    // Object.keys(this.FactFormGroup.controls).forEach(key => {
    //   this.FactFormGroup.get(key).enable();
    //   this.FactFormGroup.get(key).markAsUntouched();
    // });
    this.IsDisplayPhone2 = false;
    this.IsDisplayEmail2 = false;
    // this.fileToUpload = null;
    this.ClearKRAFormGroup();
    this.ClearBankDetailsFormGroup();
    this.ClearContactPersonFormGroup();
    this.ClearAIACTFormGroup();
    this.ClearKRADataSource();
    this.ClearBankDetailsDataSource();
    this.ClearContactPersonDataSource();
    this.ClearAIACTDataSource();
  }

  ClearKRAFormGroup(): void {
    this.KRAFormGroup.reset();
    Object.keys(this.KRAFormGroup.controls).forEach(key => {
      this.KRAFormGroup.get(key).markAsUntouched();
    });
  }
  ClearBankDetailsFormGroup(): void {
    this.bankDetailsFormGroup.reset();
    Object.keys(this.bankDetailsFormGroup.controls).forEach(key => {
      this.bankDetailsFormGroup.get(key).markAsUntouched();
    });
  }
  ClearContactPersonFormGroup(): void {
    this.ContactPersonFormGroup.reset();
    Object.keys(this.ContactPersonFormGroup.controls).forEach(key => {
      this.ContactPersonFormGroup.get(key).markAsUntouched();
    });
  }
  ClearAIACTFormGroup(): void {
    this.AIACTFormGroup.reset();
    Object.keys(this.AIACTFormGroup.controls).forEach(key => {
      this.AIACTFormGroup.get(key).markAsUntouched();
    });
  }

  ClearCertificateFormGroup(): void {
    this.CertificateFormGroup.reset();
    Object.keys(this.CertificateFormGroup.controls).forEach(key => {
      this.CertificateFormGroup.get(key).markAsUntouched();
    });
  }
  ClearKRADataSource(): void {
    this.KRAsByPartnerID = [];
    this.KRADataSource = new MatTableDataSource(this.KRAsByPartnerID);
  }
  ClearBankDetailsDataSource(): void {
    this.BanksByPartnerID = [];
    this.bankDetailsDataSource = new MatTableDataSource(this.BanksByPartnerID);

  }



  ClearContactPersonDataSource(): void {
    this.ContactPersonsByPartnerID = [];
    this.ContactPersonDataSource = new MatTableDataSource(this.ContactPersonsByPartnerID);
  }
  ClearAIACTDataSource(): void {
    this.AIACTsByPartnerID = [];
    this.AIACTDataSource = new MatTableDataSource(this.AIACTsByPartnerID);
  }

  GetFactByPartnerIDAndType(): void {
    this._FactService.GetFactByPartnerIDAndType(this.currentUserName, 'V').subscribe(
      (data) => {
        const fact = data as BPCFact;
        if (fact) {
          this.loadSelectedBPCFact(fact);
        }
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
  GetLocationByPincode(event): void {
    const Pincode = event.target.value;
    if (Pincode) {
      this._vendorMasterService.GetLocationByPincode(Pincode).subscribe(
        (data) => {
          const loc = data as CBPLocation;
          if (loc) {
            this.FactFormGroup.get('City').patchValue(loc.District);
            this.FactFormGroup.get('State').patchValue(loc.State);
            this.FactFormGroup.get('Country').patchValue(loc.Country);
          }
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  DisplayPhone2(): void {
    this.FactFormGroup.get('Phone2').setValidators([Validators.required, Validators.pattern('^(\\+91[\\-\\s]?)?[0]?(91)?[6789]\\d{9}$')]);
    this.FactFormGroup.get('Phone2').updateValueAndValidity();
    this.IsDisplayPhone2 = true;
  }
  DisplayEmail2(): void {
    this.FactFormGroup.get('Email2').setValidators([Validators.required, Validators.pattern('^(\\+91[\\-\\s]?)?[0]?(91)?[6789]\\d{9}$')]);
    this.FactFormGroup.get('Email2').updateValueAndValidity();
    this.IsDisplayEmail2 = true;
  }


  loadSelectedBPCFact(selectedBPCFact: BPCFact): void {
    this.ResetControl();
    // for (let i = 0; i < length; i++) {
    //   this.stepFormGroups.push(1);
    // }
    // this.SelectedBPCFactSupport.BPCFact = selectedBPCFact;
    this.SelectedBPCFact = selectedBPCFact;
    // this.SelectedBPCFactSupport.BPCFact = selectedBPCFact;
    // console.log("SelectBP", this.SelectedBPCFactSupport);
    this.selectID = selectedBPCFact.PatnerID;
    // this.EnableAllFactTypes();
    this.SetBPCFactValues();
    this.GetBPCFactSubItems();
  }
  typeSelected(event): void {
    const selectedType = event.value;
    if (event.value) {
      this.SelectedBPCFact.Type = event.value;
    }
  }
  applyFilter(filterValue: string): void {
    this.KRADataSource.filter = filterValue.trim().toLowerCase();
  }

  // EnableAllFactTypes(): void {
  //   Object.keys(this.FactFormGroup.controls).forEach(key => {
  //     this.FactFormGroup.get(key).enable();
  //   });
  // }
  SetBPCFactValues(): void {
    this.FactFormGroup.get('Client').patchValue(this.SelectedBPCFact.Client);
    this.FactFormGroup.get('Type').patchValue(this.SelectedBPCFact.Type);
    this.FactFormGroup.get('Company').patchValue(this.SelectedBPCFact.Company);
    this.FactFormGroup.get('LegalName').patchValue(this.SelectedBPCFact.LegalName);
    this.FactFormGroup.get('AddressLine1').patchValue(this.SelectedBPCFact.AddressLine1);
    this.FactFormGroup.get('AddressLine2').patchValue(this.SelectedBPCFact.AddressLine2);
    this.FactFormGroup.get('PinCode').patchValue(this.SelectedBPCFact.PinCode);
    this.FactFormGroup.get('City').patchValue(this.SelectedBPCFact.City);
    this.FactFormGroup.get('State').patchValue(this.SelectedBPCFact.State);
    this.FactFormGroup.get('Country').patchValue(this.SelectedBPCFact.Country);
    this.FactFormGroup.get('Phone1').patchValue(this.SelectedBPCFact.Phone1);
    this.FactFormGroup.get('Phone2').patchValue(this.SelectedBPCFact.Phone2);
    this.FactFormGroup.get('Email1').patchValue(this.SelectedBPCFact.Email1);
    this.FactFormGroup.get('Email2').patchValue(this.SelectedBPCFact.Email2);

    // this.ContactPersonFormGroup.get('Email').validator({}as AbstractControl);
  }

  GetBPCFactSubItems(): void {
    this.GetCertificatesByPartnerID();
    this.GetKRAsByPartnerID();
    this.GetBanksByPartnerID();
    this.GetContactPersonsByPartnerID();
    this.GetAIACTsByPartnerID();

  }

  GetKRAsByPartnerID(): void {
    this.IsProgressBarVisibile = true;
    this._FactService.GetKRAsByPartnerID(this.SelectedBPCFact.PatnerID).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.KRAsByPartnerID = data as BPCKRA[];
        this.KRADataSource = new MatTableDataSource(this.KRAsByPartnerID);
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
        // console.log("INITIAL", data);
        this.IsProgressBarVisibile = false;
        this.BanksByPartnerID = data as BPCFactBank[];
        for (let i = 0; i < this.BanksByPartnerID.length; i++) {
          this.BanksByPartnerID[i].ID = i + 1;
        }
        this.bankDetailsDataSource = new MatTableDataSource(this.BanksByPartnerID);
        this.Bankcount = this.bankDetailsDataSource.data.length;
        this.BankPrevious = this.Bankcount;
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
        this.ContactPersonDataSource = new MatTableDataSource(this.ContactPersonsByPartnerID);
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAIACTsByPartnerID(): void {
    this.IsProgressBarVisibile = true;
    this._FactService.GetAIACTsByPartnerID(this.SelectedBPCFact.PatnerID).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.AIACTsByPartnerID = data as BPCAIACT[];
        this.AIACTDataSource = new MatTableDataSource(this.AIACTsByPartnerID);
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }
  openAttachmentViewDialog(FileName: string, blob: Blob): void {
    const attachmentDetails: AttachmentDetails = {
      FileName: FileName,
      blob: blob
    };
    const dialogConfig: MatDialogConfig = {
      data: attachmentDetails,
      panelClass: "update-attachment",
    };
    const dialogRef = this.dialog.open(
      UpdateAttachmentComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.CertificatesByPartnerID.findIndex(x => x.CertificateName === this.viewattachmentData.CertificateName);
        console.log("Index", index);
        // this.CertificatesByPartnerID[index].Attachment = this.fileToUpload.name;
        // if (this.CertificateFileList.length > 0) {
        //   for (let i = 0; this.CertificateFileList.length; i++) {
        //     if (this.CertificateFileList[i].CertificateName === this.CertificatesByPartnerID[index].CertificateName) {
        //       this.CertificateFileList[i].file = this.fileToUpload;
        //     }
        //   }
        // }
        // else {
        //   const attachment = new BPCCertificateAttachment();
        //   attachment.CertificateType = this.CertificateFormGroup.get('CertificateType').value;
        //   attachment.CertificateName = this.CertificateFormGroup.get('CertificateName').value;
        //   attachment.client = this.SelectedBPCFact.Client;
        //   attachment.company = this.SelectedBPCFact.Company;
        //   attachment.patnerID = this.SelectedBPCFact.PatnerID;
        //   attachment.file = this.fileToUpload;
        //   this.CertificateFileList.push(attachment);
        // }
        // console.log("change CertificateFileList Attachment", this.CertificateFileList);
      }
    });
  }
  ViewAttachmentClicked(element: BPCCertificate): void {
    this.IsProgressBarVisibile = true;
    this.viewattachmentData = element;
    this._FactService.DownloadOfAttachment(this.authenticationDetails.UserName, element.CertificateName, element.CertificateType).subscribe(
      data => {
        if (data) {
          let fileType = 'image/jpg';
          fileType = element.Attachment.toLowerCase().includes('.jpg') ? 'image/jpg' :
            element.Attachment.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
              element.Attachment.toLowerCase().includes('.png') ? 'image/png' :
                element.Attachment.toLowerCase().includes('.gif') ? 'image/gif' :
                  element.Attachment.toLowerCase().includes('.pdf') ? 'application/pdf' : '';
          const blob = new Blob([data], { type: fileType });
          // this.openAttachmentViewDialog(element.Attachment, blob);
          this.openAttachmentDialog(element.CertificateName, blob);
        }
        this.IsProgressBarVisibile = false;
      },
      error => {
        console.error(error);
        this.IsProgressBarVisibile = false;
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
  GetCertificatesByPartnerID(): void {
    this.IsProgressBarVisibile = true;
    this._FactService.GetCertificatesByPartnerID(this.SelectedBPCFact.PatnerID).subscribe(
      (data) => {
        this.CertificatesByPartnerID = data as BPCCertificate[];
        this.CertificateDataSource = new MatTableDataSource(this.CertificatesByPartnerID);
        console.log("CertificateDataSource", this.CertificatesByPartnerID);
        this.Certificatecount = this.CertificateDataSource.data.length;
        // console.log("Source", this.Certificatecount);
        this.PerviousCertificate = this.Certificatecount;
        this.IsProgressBarVisibile = false;
        // if (this.PerviousCertificate === 0) {
        //   this.AddInitialCertiticateTable();
        // }
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }
  handleFileInputCertificate(evt): void {
    if (evt.target.files && evt.target.files.length > 0) {
      console.log("handleFileInputCertificate");
      this.fileToUpload = evt.target.files[0];
      this.fileStatus = false;
      // this.CertificateFormGroup.get('CertificateName').patchValue(this.fileToUpload.name);
      this.AddCertificateToTable();
      // this.fileToUploadList.push(this.fileToUpload);
    }
  }
  // ChangehandleFileInputCertificate(evt, index, name): void {
  //   if (evt.target.files && evt.target.files.length > 0) {
  //     this.fileToUpload = evt.target.files[0];
  //     this.AddCertificateToTable();
  //     // this.changeCertificateData
  //     // this.fileToUploadList.push(this.fileToUpload);
  //   }
  // }
  AddKRAToTable(): void {
    if (this.KRAFormGroup.valid) {
      const bPCKRA = new BPCKRA();
      bPCKRA.Type = this.KRAFormGroup.get('Type').value;
      bPCKRA.KRAText = this.KRAFormGroup.get('KRAText').value;
      bPCKRA.EvalDate = this.KRAFormGroup.get('EvalDate').value;
      if (!this.KRAsByPartnerID || !this.KRAsByPartnerID.length) {
        this.KRAsByPartnerID = [];
      }
      this.KRAsByPartnerID.push(bPCKRA);
      this.KRADataSource = new MatTableDataSource(this.KRAsByPartnerID);
      this.ClearKRAFormGroup();
    } else {
      this.ShowValidationErrors(this.KRAFormGroup);
    }
  }
  AddInitialBankTable(): void {
    if (this.BanksByPartnerID.length > 0) {
      this.BankTemp = Object.assign({}, this.BanksByPartnerID[0]);
    }
    else {
      this.BankTemp = new BPCFactBank();
      this.BankTemp.Client = this.SelectedBPCFact.Client;
      this.BankTemp.Company = this.SelectedBPCFact.Company;
      this.BankTemp.Type = this.SelectedBPCFact.Type;
      this.BankTemp.PatnerID = this.SelectedBPCFact.PatnerID;
    }
    this.Bankrender = true;
    this.Bankadd = 0;
    this.Bankadd = this.Bankadd + 1;
    this.Temp = new BPCFactBank();
    this.Temp.AccountNumber = '';
    this.Temp.AccountName = '';
    this.Temp.BankID = '';
    this.Temp.BankName = '';
    this.BanksByPartnerID.push(this.Temp);

    this.bankDetailsDataSource = new MatTableDataSource(this.BanksByPartnerID);
    this.Bankcount = this.bankDetailsDataSource.data.length;
    // console.log("AddDataSource", this.bankDetailsDataSource.data);
  }
  Change(): void {
    if (this.change) { // Enable
      this.change = false;
      this.FactFormGroup.enable();
      this.bankDetailsFormGroup.enable();
      this.CertificateFormGroup.enable();
      this.snackBar.open('Change Enabled', '', {
        duration: 2000,
        horizontalPosition: "right",
        verticalPosition: "bottom",
      });
    }
    else { // Disbale
      this.change = true;
      this.FactFormGroup.disable();
      this.bankDetailsFormGroup.disable();
      this.CertificateFormGroup.disable();
      this.snackBar.open('Change Disabled', '', {
        duration: 2000,
        horizontalPosition: "right",
        verticalPosition: "bottom",
      });
    }
  }
  AddInitialCertiticateTable(): void {
    this.fileStatus = false;
    if (this.CertificatesByPartnerID.length > 0) {
      this.CerificateTemp = Object.assign({}, this.CertificatesByPartnerID[0]);
    }
    else {
      this.CerificateTemp = new BPCCertificate();
      this.CerificateTemp.Client = this.SelectedBPCFact.Client;
      this.CerificateTemp.PatnerID = this.SelectedBPCFact.PatnerID;
      this.CerificateTemp.Type = this.SelectedBPCFact.Type;
      this.CerificateTemp.Company = this.SelectedBPCFact.Company;
    }
    this.CertificateDeleteIndex = null;
    this.Certificaterender = true;
    this.Certificateadd = this.Certificateadd + 1;
    this.Temp = new BPCCertificate();
    this.Temp.CertificateType = '';
    this.Temp.CertificateName = '';
    this.Temp.Validity = '';
    this.Temp.Attachment = '';
    this.CertificatesByPartnerID.push(this.Temp);
    this.CertificateDataSource = new MatTableDataSource(this.CertificatesByPartnerID);
    this.Certificatecount = this.CertificateDataSource.data.length;
    // console.log("Add", "Add", this.add, "Count", this.count);
  }
  clearBankTable(index): void {
    // if (index === 0 && this.BankPrevious === 1) {
    //   this.openInformationDialog("bank");
    // }
    // else 
    if (index < this.BankPrevious) {
      this.openDialog(index, "Bank");
    }
    else {

      if (this.BankSupport.length > 0) {
        for (let i = 0; i < this.BankSupport.length; i++) {
          if (this.BankSupport[i].AccountNumber === this.BanksByPartnerID[index].AccountNumber) {
            this.BankSupport.splice(index, 1);
          }
        }
      }
      this.BanksByPartnerID.splice(index, 1);
      this.bankDetailsDataSource = new MatTableDataSource(this.BanksByPartnerID);
      this.Bankadd = 0;
      this.ClearBankDetailsFormGroup();
      this.Bankrender = false;
      this.Bankcount = this.Bankcount - 1;
      this.deletefact = false;
    }
    // console.log("Bankcount", this.Bankcount, "bankadd", this.Bankadd);
    // if (this.Bankcount === 0 && this.Bankadd === 0) {
    //   // this.Bankrender = true;
    //   this.AddInitialBankTable();
    // }
  }
  openInformationDialog(name: string): void {
    let message = '';
    if (name === "bank") {
      message = 'Final bank details cannot be deleted,You can edit the details';

    }
    else {
      message = 'Final certificate details cannot be deleted,You can edit the details';

    }
    const Catagory = name;
    const dialogConfig: MatDialogConfig = {
      data: message,
      panelClass: 'information-dialog'
    };
    const dialogRef = this.dialog.open(InformationDialogComponent, dialogConfig);
  }
  openDialog(index, name): any {
    const Actiontype = 'Delete';
    const Catagory = name;
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
          if (Actiontype === 'Delete') {
            this.deletefact = true;
            this.IsProgressBarVisibile = true;
            if (name === "Bank") {
              this._FactService.DeleteFactBank(this.BanksByPartnerID[index]).subscribe(
                (data) => {
                  this.BanksByPartnerID.splice(index, 1);
                  this.bankDetailsDataSource = new MatTableDataSource(this.BanksByPartnerID);
                  this.Bankadd = 0;
                  this.ClearBankDetailsFormGroup();
                  this.Bankrender = false;
                  this.Bankcount = this.Bankcount - 1;
                  this.BankPrevious = this.BankPrevious - 1;
                  this.deletefact = false;
                  this.IsProgressBarVisibile = false;
                  // if (this.Bankcount === 0 && this.Bankadd === 0) {
                  //   this.AddInitialBankTable();
                  // }
                },
              );
            }
            else {
              this._FactService.DeleteFactCertificate(this.CertificatesByPartnerID[index]).subscribe(
                (data) => {
                  this.CertificatesByPartnerID.splice(index, 1);
                  this.CertificateDataSource = new MatTableDataSource(this.CertificatesByPartnerID);
                  this.Certificateadd = 0;
                  this.ClearCertificateFormGroup();
                  this.Certificaterender = false;
                  this.Certificateprevious = this.Certificateprevious - 1;
                  this.Certificatecount = this.Certificatecount - 1;
                  this.IsProgressBarVisibile = false;

                  // if (this.Certificatecount === 0 && this.Certificateadd === 0) {
                  //   this.AddInitialCertiticateTable();
                  // }
                },
              );
            }
          }
        }
      });
  }
  clearCertificateTable(index): void {
    // if (index === 0 && this.PerviousCertificate === 1) {
    //   this.openInformationDialog("certificate");
    // }
    // else 
    if (index < this.PerviousCertificate) {
      this.openDialog(index, "Certificate");
    }
    else {
      if (this.CertificateSupport.length > 0) {
        for (let i = 0; i < this.CertificateSupport.length; i++) {
          if (this.CertificateSupport[i].CertificateName === this.CertificatesByPartnerID[index].CertificateName) {
            this.CertificateSupport.splice(index, 1);
          }
        }
      }
      if (this.CertificateFileList.length > 0) {
        for (let i = 0; i < this.CertificateFileList.length; i++) {
          if (this.CertificateFileList[i].CertificateName === this.CertificatesByPartnerID[index].CertificateName) {
            this.CertificateFileList.splice(index, 1);
          }
        }
      }
      this.CertificatesByPartnerID.splice(index, 1);

      this.CertificateDataSource = new MatTableDataSource(this.CertificatesByPartnerID);
      this.Certificateadd = 0;
      this.ClearCertificateFormGroup();
      this.Certificaterender = false;
      this.Certificatecount = this.Certificatecount - 1;
    }

    // console.log("Bankcount", this.Bankcount, "bankadd", this.Bankadd);
    // if (this.Certificatecount === 0 && this.Certificateadd === 0) {
    //   // this.Bankrender = true;
    //   this.AddInitialCertiticateTable();
    // }

  }
  AddBankToTable(): void {
    // this.add.push(1);
    if (this.bankDetailsFormGroup.valid) {
      this.Bankrender = false;
      // BpcFactBank = this.BanksByPartnerID[0];
      this.BankTemp.AccountNumber = this.bankDetailsFormGroup.get('AccountNumber').value;
      this.BankTemp.AccountName = this.bankDetailsFormGroup.get('AccountName').value;
      this.BankTemp.BankName = this.bankDetailsFormGroup.get('BankName').value;
      this.BankTemp.BankID = this.bankDetailsFormGroup.get('BankID').value;
      this.BankTemp.ID = this.Bankcount;
      // this.BankTemp.CreatedOn = formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530').toString();
      if (!this.BanksByPartnerID || !this.BanksByPartnerID.length) {
        this.BanksByPartnerID = [];
      }
      this.BanksByPartnerID.pop();
      this.BanksByPartnerID.push(this.BankTemp);
      this.BankSupport.push(this.BankTemp);
      this.bankDetailsDataSource = new MatTableDataSource(this.BanksByPartnerID);
      this.ClearBankDetailsFormGroup();
      this.Bankadd = 0;
      this.Bankcount = this.bankDetailsDataSource.data.length;
    } else {
      this.ShowValidationErrors(this.bankDetailsFormGroup);
    }
  }
  changeBankData(data, index, name): void {
    // console.log("ChangedData", data, "index", index, "name", name);
    // console.log(this.BanksByPartnerID[index]);

    if (name === "BankID") {
      this.BanksByPartnerID[index].BankID = data;
    }
    if (name === "BankName") {
      this.BanksByPartnerID[index].BankName = data;
    }
    if (name === "AccountNumber") {
      this.BanksByPartnerID[index].AccountNumber = data;
    }
    if (name === "AccountName") {
      this.BanksByPartnerID[index].AccountName = data;
    }
    let count = 0;
    if (this.BankSupport.length > 0) {
      for (let i = 0; i < this.BankSupport.length; i++) {
        if (this.BanksByPartnerID[index].AccountNumber !== this.BankSupport[i].AccountNumber) {
          count++;
        }
        if (count === this.BankSupport.length) {
          this.BankSupport.push(this.BanksByPartnerID[index]);
        }
      }
    }
    else {
      this.BankSupport.push(this.BanksByPartnerID[index]);
    }
    this.bankDetailsDataSource = new MatTableDataSource(this.BanksByPartnerID);
    console.log("AfterChange", this.BankSupport);
  }
  changeCertificateData(data, index, name): void {
    // console.log("ChangedData", data, "index", index, "name", name);
    console.log(this.CertificatesByPartnerID[index]);
    if (name === "CertificateName") {
      this.ChangeOnCertificateFileList(index, this.CertificatesByPartnerID[index].CertificateName, data, "CertificateName");
      this.CertificatesByPartnerID[index].CertificateName = data;
    }
    if (name === "CertificateType") {
      this.ChangeOnCertificateFileList(index, this.CertificatesByPartnerID[index].CertificateType, data, "CertificateType");

      this.CertificatesByPartnerID[index].CertificateType = data;
    }
    if (name === "Validity") {
      this.CertificatesByPartnerID[index].Validity = data;
    }
    if (name === "Attachment") {
      this.fileToUpload = data.target.files[0];
      // if (this.Bankadd === 1) {
      //   this.AddCertificateToTable();
      // }
      this.CertificatesByPartnerID[index].Attachment = this.fileToUpload.name;
      // this.CertificateFormGroup.get('CertificateName').patchValue(this.fileToUpload.name);

      if (this.CertificateFileList.length > 0) {
        for (var i = 0; i < this.CertificateFileList.length; i++) {
          if (this.CertificateFileList[i].CertificateName === this.CertificatesByPartnerID[index].CertificateName) {
            this.CertificateFileList[i].file = this.fileToUpload;
          }
        }
        this.fileStatus = false;
      }
      else {
        const attachment = new BPCCertificateAttachment();
        attachment.CertificateType = this.CertificatesByPartnerID[index].CertificateType;
        attachment.CertificateName = this.CertificatesByPartnerID[index].CertificateName;
        attachment.client = this.SelectedBPCFact.Client;
        attachment.company = this.SelectedBPCFact.Company;
        attachment.patnerID = this.SelectedBPCFact.PatnerID;
        attachment.file = this.fileToUpload;
        this.fileStatus = false;
        this.CertificateFileList.push(attachment);
      }
      console.log("change CertificateFileList Attachment", this.CertificateFileList);
    }
    let count = 0;
    if (this.CertificateSupport.length > 0) {
      for (let i = 0; i < this.CertificateSupport.length; i++) {
        if (this.CertificatesByPartnerID[index].CertificateName !== this.CertificateSupport[i].CertificateName) {
          count++;
        }
        if (count === this.CertificateSupport.length) {
          this.CertificateSupport.push(this.CertificatesByPartnerID[index]);
        }
      }
    }
    else {
      this.CertificateSupport.push(this.CertificatesByPartnerID[index]);
    }
    this.CertificateDataSource = new MatTableDataSource(this.CertificatesByPartnerID);
    console.log("FinalData CertificateSupport", this.CertificateSupport);
  }
  ChangeOnCertificateFileList(index: any, OldData: any, data: any, columnName: any): void {
    for (var i = 0; i < this.CertificateFileList.length; i++) {
      if (columnName === "CertificateName") {
        if (this.CertificateFileList[i].CertificateName === OldData) {
          this.CertificateFileList[i].CertificateName = data;
        }
      }
      else {
        if (this.CertificateFileList[i].CertificateType === OldData) {
          this.CertificateFileList[i].CertificateType = data;
        }
      }
    }
    console.log("ChangeOnCertificateFileList", this.CertificateFileList);
  }
  AddCertificateToTable(): void {
    // this.add.push(1);
    if (this.CertificateFormGroup.valid && !this.fileStatus) {
      this.Certificaterender = false;
      this.fileStatus = true;
      const attachment = new BPCCertificateAttachment();
      const bpcCertificate = new BPCCertificate();
      this.CerificateTemp.CertificateType = attachment.CertificateType = this.CertificateFormGroup.get('CertificateType').value;
      this.CerificateTemp.CertificateName = attachment.CertificateName = this.CertificateFormGroup.get('CertificateName').value;
      this.CerificateTemp.Validity = this.CertificateFormGroup.get('Validity').value;
      // bpcCertificate.Attachment = this.CertificateFormGroup.get('Attachment').value;
      this.CerificateTemp.Attachment = this.fileToUpload.name;

      attachment.client = this.SelectedBPCFact.Client;
      attachment.company = this.SelectedBPCFact.Company;
      attachment.patnerID = this.SelectedBPCFact.PatnerID;
      attachment.file = this.fileToUpload;
      this.CertificateFileList.push(attachment);

      console.log("CertificateFileList", this.CertificateFileList);
      this.fileToUpload = null;
      if (!this.CertificatesByPartnerID || !this.CertificatesByPartnerID.length) {
        this.CertificatesByPartnerID = [];
      }
      this.CertificatesByPartnerID.pop();
      this.CertificatesByPartnerID.push(this.CerificateTemp);
      this.CertificateSupport.push(this.CerificateTemp);
      this.CertificateDataSource = new MatTableDataSource(this.CertificatesByPartnerID);
      this.ClearCertificateFormGroup();
      this.Certificateadd = 0;
      this.Certificatecount = this.CertificateDataSource.data.length;
      console.log(this.CertificateFileList);
    }
    else {
      this.ShowValidationErrors(this.CertificateFormGroup);
      this.fileStatus = true;
    }
  }
  getOpacityDelete(): any {
    if ((this.Bankcount - this.Bankadd) === this.bankDeleteIndex) {
      if (!this.change) {
        return {
          'opacity': '1'
        };
      }
      else {
        return {
          'opacity': '0.5'
        };
      }
    }
    else {
      return {
        'opacity': '1'
      };
    }
  }
  getOpacityCertificateDelete(): any {
    if ((this.Certificatecount - this.Certificateadd) === this.CertificateDeleteIndex) {
      return {
        'opacity': '0.5'
      };
    }
    else {
      return {
        'opacity': '1'
      };
    }
  }
  getOpacityBankAdd(): any {
    if (!this.Bankrender) {
      return {
        'opacity': '1'
      };
    }
    else {
      return {
        'opacity': '0.5'
      };
    }
  }
  getOpacityCertificateAdd(): any {
    if (!this.Certificaterender) {
      return {
        'opacity': '1'
      };
    }
    else {
      return {
        'opacity': '0.5'
      };
    }
  }
  GetCursor(): any {
    if (this.change) {
      console.log("Not Allowed");
      return {
        // 'cursor': 'not-allowed !important'
        'background-color': 'red'
      };
    }
    else {
      return {
        'cursor': 'default'
      };
    }
  }
  DeleteBankTableRow(event): void {
    // console.log("row clicked", event);
    if (this.change) {
      this.bankDeleteIndex = this.bankDetailsDataSource.data.indexOf(event);
      console.log(this.bankIndex, this.change);
    }
  }
  DeleteCertificateTableRow(event): void {
    // console.log("row clicked", event);
    if (this.change) {
      this.CertificateDeleteIndex = this.CertificateDataSource.data.indexOf(event);
    }
  }
  AddContactPersonToTable(): void {
    if (this.ContactPersonFormGroup.valid) {
      const bPCFactContactPerson = new BPCFactContactPerson();
      bPCFactContactPerson.Name = this.ContactPersonFormGroup.get('Name').value;
      bPCFactContactPerson.ContactPersonID = this.ContactPersonFormGroup.get('ContactPersonID').value;
      bPCFactContactPerson.ContactNumber = this.ContactPersonFormGroup.get('ContactNumber').value;
      bPCFactContactPerson.Email = this.ContactPersonFormGroup.get('Email').value;
      if (!this.ContactPersonsByPartnerID || !this.ContactPersonsByPartnerID.length) {
        this.ContactPersonsByPartnerID = [];
      }
      this.ContactPersonsByPartnerID.push(bPCFactContactPerson);
      this.ContactPersonDataSource = new MatTableDataSource(this.ContactPersonsByPartnerID);
      this.ClearContactPersonFormGroup();
    } else {
      this.ShowValidationErrors(this.ContactPersonFormGroup);
    }
  }

  AddAIACTToTable(): void {

    if (this.AIACTFormGroup.valid) {
      const bPCAIACT = new BPCAIACT();
      bPCAIACT.SeqNo = this.AIACTFormGroup.get('SeqNo').value;
      bPCAIACT.Date = this.AIACTFormGroup.get('Date').value;
      bPCAIACT.Time = this.AIACTFormGroup.get('Time').value;
      bPCAIACT.ActionText = this.AIACTFormGroup.get('ActionText').value;
      if (!this.AIACTsByPartnerID || !this.AIACTsByPartnerID.length) {
        this.AIACTsByPartnerID = [];
      }
      this.AIACTsByPartnerID.push(bPCAIACT);
      this.AIACTDataSource = new MatTableDataSource(this.AIACTsByPartnerID);
      this.ClearAIACTFormGroup();

    } else {
      this.ShowValidationErrors(this.AIACTFormGroup);
    }
  }

  KRAEnterKeyDown(): boolean {
    this.EvalDate.nativeElement.blur();
    this.AddKRAToTable();
    return true;
  }

  BankEnterKeyDown(): boolean {
    this.bankCity.nativeElement.blur();
    this.AddBankToTable();
    return true;
  }
  ContactPersonEnterKeyDown(): boolean {
    this.email.nativeElement.blur();
    this.AddContactPersonToTable();
    return true;
  }
  AIACTEnterKeyDown(): boolean {
    this.activityText.nativeElement.blur();
    this.AddAIACTToTable();
    return true;
  }

  keytab(elementName): void {
    switch (elementName) {
      case 'iDNumber': {
        this.iDNumber.nativeElement.focus();
        break;
      }
      case 'EvalDate': {
        this.EvalDate.nativeElement.focus();
        break;
      }
      case 'accHolderName': {
        this.accHolderName.nativeElement.focus();
        break;
      }
      case 'AccountName': {
        this.AccountName.nativeElement.focus();
        break;
      }
      case 'bankName': {
        this.bankName.nativeElement.focus();
        break;
      }
      case 'BankID': {
        this.BankID.nativeElement.focus();
        break;
      }
      case 'bankCity': {
        this.bankCity.nativeElement.focus();
        break;
      }
      case 'ContactPersonID': {
        this.ContactPersonID.nativeElement.focus();
        break;
      }
      case 'title': {
        this.title.nativeElement.focus();
        break;
      }
      case 'ContactNumber': {
        this.ContactNumber.nativeElement.focus();
        break;
      }
      case 'email': {
        this.email.nativeElement.focus();
        break;
      }
      case 'activityDate': {
        this.activityDate.nativeElement.focus();
        break;
      }
      case 'activityTime': {
        this.activityTime.nativeElement.focus();
        break;
      }
      case 'activityText': {
        this.activityText.nativeElement.focus();
        break;
      }
      default: {
        break;
      }
    }
  }


  RemoveKRAFromTable(bPCKRA: BPCKRA): void {
    const index: number = this.KRAsByPartnerID.indexOf(bPCKRA);
    if (index > -1) {
      this.KRAsByPartnerID.splice(index, 1);
    }
    this.KRADataSource = new MatTableDataSource(this.KRAsByPartnerID);
  }

  RemoveBankFromTable(bPCFactBank: BPCFactBank): void {
    const index: number = this.BanksByPartnerID.indexOf(bPCFactBank);
    if (index > -1) {
      this.BanksByPartnerID.splice(index, 1);
    }
    this.bankDetailsDataSource = new MatTableDataSource(this.BanksByPartnerID);
  }


  RemoveContactPersonFromTable(bPCFactContactPerson: BPCFactContactPerson): void {
    const index: number = this.ContactPersonsByPartnerID.indexOf(bPCFactContactPerson);
    if (index > -1) {
      this.ContactPersonsByPartnerID.splice(index, 1);
    }
    this.ContactPersonDataSource = new MatTableDataSource(this.ContactPersonsByPartnerID);
  }

  RemoveAIACTFromTable(bPCAIACT: BPCAIACT): void {
    const index: number = this.AIACTsByPartnerID.indexOf(bPCAIACT);
    if (index > -1) {
      this.AIACTsByPartnerID.splice(index, 1);
    }
    this.AIACTDataSource = new MatTableDataSource(this.AIACTsByPartnerID);
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
          if (Actiontype === 'Update') {
            this.UpdateFact();
          }
          else if (Actiontype === 'Approve') {
            // this.ApproveVendor();
          } else if (Actiontype === 'Reject') {
            // this.RejectVendor();
          } else if (Actiontype === 'Delete') {
            this.DeleteFact();
          }
        }
      });
  }

  GetBPCFactValues(): void {
    this.SelectedBPCFactSupport.BPCFact = this.SelectedBPCFact;
    this.SelectedBPCFact.Client = this.SelectedBPCFactSupport.BPCFact.Client = this.SelectedBPCFactView.Client = this.FactFormGroup.get('Client').value;
    this.SelectedBPCFact.Type = this.SelectedBPCFactSupport.BPCFact.Type = this.SelectedBPCFactView.Type = this.FactFormGroup.get('Type').value;
    this.SelectedBPCFact.Company = this.SelectedBPCFactSupport.BPCFact.Company = this.SelectedBPCFactView.Company = this.FactFormGroup.get('Company').value;
    this.SelectedBPCFact.LegalName = this.SelectedBPCFactSupport.BPCFact.LegalName = this.SelectedBPCFactView.LegalName = this.FactFormGroup.get('LegalName').value;
    this.SelectedBPCFact.AddressLine1 = this.SelectedBPCFactSupport.BPCFact.AddressLine1 = this.SelectedBPCFactView.AddressLine1 = this.FactFormGroup.get('AddressLine1').value;
    this.SelectedBPCFact.AddressLine2 = this.SelectedBPCFactSupport.BPCFact.AddressLine2 = this.SelectedBPCFactView.AddressLine2 = this.FactFormGroup.get('AddressLine2').value;
    this.SelectedBPCFact.City = this.SelectedBPCFactSupport.BPCFact.City = this.SelectedBPCFactView.City = this.FactFormGroup.get('City').value;
    this.SelectedBPCFact.State = this.SelectedBPCFactSupport.BPCFact.State = this.SelectedBPCFactView.State = this.FactFormGroup.get('State').value;
    this.SelectedBPCFact.Country = this.SelectedBPCFactSupport.BPCFact.Country = this.SelectedBPCFactView.Country = this.FactFormGroup.get('Country').value;
    this.SelectedBPCFact.PinCode = this.SelectedBPCFactSupport.BPCFact.PinCode = this.SelectedBPCFactView.PinCode = this.FactFormGroup.get('PinCode').value;
    this.SelectedBPCFact.Phone1 = this.SelectedBPCFactSupport.BPCFact.Phone1 = this.SelectedBPCFactView.Phone1 = this.FactFormGroup.get('Phone1').value;
    this.SelectedBPCFact.Phone2 = this.SelectedBPCFactSupport.BPCFact.Phone2 = this.SelectedBPCFactView.Phone2 = this.FactFormGroup.get('Phone2').value;
    this.SelectedBPCFact.Email1 = this.SelectedBPCFactSupport.BPCFact.Email1 = this.SelectedBPCFactView.Email1 = this.FactFormGroup.get('Email1').value;
    this.SelectedBPCFact.Email2 = this.SelectedBPCFactSupport.BPCFact.Email2 = this.SelectedBPCFactView.Email2 = this.FactFormGroup.get('Email2').value;
    // this.SelectedBPCFact.VendorCode = this.SelectedBPCFactView.VendorCode = this.FactFormGroup.get('VendorCode').value;
    // this.SelectedBPCFact.ParentVendor = this.SelectedBPCFactView.ParentVendor = this.FactFormGroup.get('ParentVendor').value;
    // this.SelectedBPCFact.Status = this.SelectedBPCFactView.Status = this.FactFormGroup.get('Status').value;

  }

  GetBPCFactSubItemValues(): void {
    // this.GetBPCKRAValues();
    this.GetBPCFactBankValues();
    // this.GetBPCFactContactPersonValues();
    // this.GetBPCAIACTValues();
    this.GetBPCFactCertificateValues();
  }
  GetBPCFactCertificateValues(): void {
    this.SelectedBPCFactView.BPCFactCerificate = [];
    // this.SelectedBPCFactView.bPIdentities.push(...this.KRAsByPartnerID);
    this.CertificatesByPartnerID.forEach(x => {
      this.SelectedBPCFactView.BPCFactCerificate.push(x);
    });

  }
  // GetBPCKRAValues(): void {
  //   this.SelectedBPCFactView.BPCKRAs = [];
  //   // this.SelectedBPCFactView.bPIdentities.push(...this.KRAsByPartnerID);
  //   this.KRAsByPartnerID.forEach(x => {
  //     this.SelectedBPCFactView.BPCKRAs.push(x);
  //   });
  // }

  GetBPCFactBankValues(): void {
    this.SelectedBPCFactView.BPCFactBanks = [];
    // this.SelectedBPCFactView.BPCFactBanks.push(...this.BanksByPartnerID);
    this.BanksByPartnerID.forEach(x => {
      this.SelectedBPCFactView.BPCFactBanks.push(x);
    });
  }

  // GetBPCFactContactPersonValues(): void {
  //   this.SelectedBPCFactView.BPCFactContactPersons = [];
  //   // this.SelectedBPCFactView.bPIdentities.push(...this.KRAsByPartnerID);
  //   this.ContactPersonsByPartnerID.forEach(x => {
  //     this.SelectedBPCFactView.BPCFactContactPersons.push(x);
  //   });
  // }

  // GetBPCAIACTValues(): void {
  //   this.SelectedBPCFactView.BPCAIACTs = [];
  //   // this.SelectedBPCFactView.BPCFactBanks.push(...this.BanksByPartnerID);
  //   this.AIACTsByPartnerID.forEach(x => {
  //     this.SelectedBPCFactView.BPCAIACTs.push(x);
  //   });
  // }

  SaveClicked(): void {
    if (this.FactFormGroup.valid && this.Bankadd === 0 && this.Certificateadd === 0) {
      const Actiontype = 'Update';
      const Catagory = 'Fact';
      this.UpdateFact();
      // this.OpenConfirmationDialog(Actiontype, Catagory);
    } else {
      this.ShowValidationErrors(this.FactFormGroup);
      this.ShowValidationErrors(this.bankDetailsFormGroup);
      this.ShowValidationErrors(this.CertificateFormGroup);
      this.notificationSnackBarComponent.openSnackBar("Please fill all the required fleids", SnackBarStatus.danger);
    }
  }

  CreateFact(): void {
    // this.GetBPCFactValues();
    // this.GetBPCFactSubItemValues();
    // this.SelectedBPCFactView.CreatedBy = this.authenticationDetails.userID.toString();
    this.IsProgressBarVisibile = true;
    this._FactService.CreateFact(this.SelectedBPCFactView).subscribe(
      (data) => {
        this.SelectedBPCFact.PatnerID = data;
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('Vendor registered successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        // this.GetRegisteredFacts();
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );

  }

  UpdateFact(): void {
    this.GetBPCFactValues();
    // console.log(this.SelectedBPCFact);
    this.GetBPCFactSubItemValues();
    this.SelectedBPCFactSupport.BPCFact.PatnerID = this.SelectedBPCFact.PatnerID;
    this.SelectedBPCFactSupport.BPCFact.ModifiedBy = this.authenticationDetails.UserID.toString();
    this.SelectedBPCFactSupport.BPCFactBanks = [];
    this.SelectedBPCFactSupport.BPCFactCerificate = [];
    for (let i = 0; i < this.BankSupport.length; i++) {
      this.SelectedBPCFactSupport.BPCFactBanks.push(this.BankSupport[i]);
    }
    for (let i = 0; i < this.CertificateSupport.length; i++) {
      this.SelectedBPCFactSupport.BPCFactCerificate.push(this.CertificateSupport[i]);
    }
    console.log("Final Data Sent to Api", this.SelectedBPCFactSupport);
    this.IsProgressBarVisibile = true;
    for (let i = 0; i < this.CertificateFileList.length; i++) {
      for (let j = 0; j < this.SelectedBPCFactSupport.BPCFactCerificate.length; j++) {
        if (this.CertificateFileList[i].CertificateName === this.SelectedBPCFactSupport.BPCFactCerificate[j].CertificateName) {
          this.SelectedBPCFactSupport.BPCFactCerificate[j].AttachmentFile = null;
        }
      }
    }
    this._FactService.UpdateFactSupport(this.SelectedBPCFactSupport).subscribe(
      (data) => {
        for (let i = 0; i < this.CertificateFileList.length; i++) {
          this._FactService.UploadOfAttachment(this.CertificateFileList[i]).subscribe(
            (data2) => {
              if (data2) {
                console.log("Update Success");
                this.CreateSupportTicket();
                this.IsProgressBarVisibile = false;
              }
            },
            (err) => {
              this.IsProgressBarVisibile = false;
              console.error("error in upload",err);
              this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            });
        }
        this.CertificateFileList = [];
        this.IsProgressBarVisibile = false;

      },
      (err) => {
        this.IsProgressBarVisibile = false;
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  DeleteFact(): void {
    this.GetBPCFactValues();
    // this.SelectedBPCFact.ModifiedBy = this.authenticationDetails.userID.toString();
    this.IsProgressBarVisibile = true;
    this._FactService.DeleteFact(this.SelectedBPCFact).subscribe(
      (data) => {
        // console.log(data);
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('Vendor deleted successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        // this.GetRegisteredFacts();
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
  }
  Save(): void {
    this.GetBPCFactValues();
  }
  GetSupportTicket(): SupportHeaderView {
    const SupportTicketView: SupportHeaderView = new SupportHeaderView();
    SupportTicketView.Client = this.SelectedBPCFactSupport.BPCFact.Client;
    SupportTicketView.Company = this.SelectedBPCFactSupport.BPCFact.Company;
    SupportTicketView.Type = this.SelectedBPCFactSupport.BPCFact.Type;
    SupportTicketView.PatnerID = this.SelectedBPCFactSupport.BPCFact.PatnerID;
    SupportTicketView.ReasonCode = '1236';
    SupportTicketView.Reason = 'Master Data Change';
    SupportTicketView.DocumentRefNo = this.SelectedBPCFactSupport.BPCFact.PatnerID;
    SupportTicketView.CreatedBy = this.CurrentUserID.toString();
    let supportMaster = new SupportMaster();
    supportMaster = this.SupportMasters.find(x => x.ReasonCode === SupportTicketView.ReasonCode);
    if (supportMaster) {
      this.GetFilteredUsers(supportMaster);
    }
    console.log(this.FilteredUsers);
    SupportTicketView.Users = this.FilteredUsers;
    return SupportTicketView;
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
    const SupportTicketView = this.GetSupportTicket();
    this._supportDeskService.CreateSupportTicket(SupportTicketView).subscribe(
      (data) => {
        this.ResetControl();
        console.log("Support Ticket Created");
        this.notificationSnackBarComponent.openSnackBar('Support Ticket Created successfully ', SnackBarStatus.success);
        this.change = true;
        this.IsProgressBarVisibile = false;
        this.FactFormGroup.disable();
        this.GetFactByPartnerIDAndType();
      },
      (err) => {
        this.ShowErrorNotificationSnackBar(err);
      }
    );
  }
  ShowErrorNotificationSnackBar(err: any): void {
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

  ApproveClicked(): void {
    if (this.FactFormGroup.valid) {
      this.GetBPCFactValues();
      this.GetBPCFactSubItemValues();
      this.SetActionToOpenConfirmation('Approve');
    } else {
      this.ShowValidationErrors(this.FactFormGroup);
    }
  }
  RejectClicked(): void {
    if (this.FactFormGroup.valid) {
      this.GetBPCFactValues();
      this.GetBPCFactSubItemValues();
      this.SetActionToOpenConfirmation('Reject');
    } else {
      this.ShowValidationErrors(this.FactFormGroup);
    }
  }

  SetActionToOpenConfirmation(actiontype: string): void {
    if (this.SelectedBPCFact.PatnerID) {
      const Actiontype = actiontype;
      const Catagory = 'Vendor';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    }
  }

  DeleteClicked(): void {
    // if (this.FactFormGroup.valid) {
    if (this.SelectedBPCFact.PatnerID) {
      const Actiontype = 'Delete';
      const Catagory = 'Vendor';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    }
    // } else {
    //   this.ShowValidationErrors(this.FactFormGroup);
    // }
  }

  handleFileBPCKRA(evt): void {
    if (evt.target.files && evt.target.files.length > 0) {
      this.fileToUpload = evt.target.files[0];
      this.fileToUploadList.push(this.fileToUpload);
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
  // GetAttachment(fileName: string, file?: File): void {
  //   if (file && file.size) {
  //     const blob = new Blob([file], { type: file.type });
  //     this.OpenAttachmentDialog(fileName, blob);
  //   } else {
  //     this.IsProgressBarVisibile = true;
  //     this._FactService.DowloandBPCFactImage(fileName).subscribe(
  //       data => {
  //         if (data) {
  //           let fileType = 'image/jpg';
  //           fileType = fileName.toLowerCase().includes('.jpg') ? 'image/jpg' :
  //             fileName.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
  //               fileName.toLowerCase().includes('.png') ? 'image/png' :
  //                 fileName.toLowerCase().includes('.gif') ? 'image/gif' : '';
  //           const blob = new Blob([data], { type: fileType });
  //           this.OpenAttachmentDialog(fileName, blob);
  //         }
  //         this.IsProgressBarVisibile = false;
  //       },
  //       error => {
  //         console.error(error);
  //         this.IsProgressBarVisibile = false;
  //       }
  //     );
  //   }
  // }
  // OpenAttachmentDialog(FileName: string, blob: Blob): void {
  //   const attachmentDetails: AttachmentDetails = {
  //     FileName: FileName,
  //     blob: blob
  //   };
  //   const dialogConfig: MatDialogConfig = {
  //     data: attachmentDetails,
  //     panelClass: 'attachment-dialog'
  //   };
  //   const dialogRef = this.dialog.open(AttachmentDialogComponent, dialogConfig);
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //     }
  //   });
  // }
}

