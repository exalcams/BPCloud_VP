import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SelectdialogComponent } from '../selectdialog/selectdialog.component';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { MenuApp, AuthenticationDetails, UserWithRole, AppUsage } from 'app/models/master';
import { SupportMaster, SupportHeader, SupportHeaderView } from 'app/models/support-desk';
import { CBPLocation } from 'app/models/vendor-master';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { MasterService } from 'app/services/master.service';
import { RFxService } from 'app/services/rfx.service';
import { SupportDeskService } from 'app/services/support-desk.service';
import { VendorMasterService } from 'app/services/vendor-master.service';
import { Guid } from 'guid-typescript';
import { RFxHC, RFxHeader, RFxIC, RFxItem, RFxOD, RFxPartner, RFxVendor, RFxView } from 'app/models/RFx';

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CreationComponent implements OnInit {

  BGClassName: any;
  fuseConfig: any;
  MenuItems: string[];
  AllMenuApps: MenuApp[] = [];
  SelectedMenuApp: MenuApp;
  authenticationDetails: AuthenticationDetails;
  CurrentUserID: Guid;
  currentUserName: string;
  CurrentUserRole = '';
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  IsDisplayPhone2: boolean;
  IsDisplayEmail2: boolean;
  RFxFormGroup: FormGroup;
  RFxItemFormGroup: FormGroup;
  RFxHCDetailsFormGroup: FormGroup;
  RFxICFormGroup: FormGroup;
  RFxPartnerFormGroup: FormGroup;
  CertificateFormGroup: FormGroup;
  searchText = '';
  AllRFxs: RFxHeader[] = [];
  SelectedRFxID: string;
  SelectedRFx: RFxHeader;
  SelectedRFxView: RFxView;
  RFxItems: RFxItem[] = [];
  RFxHCs: RFxHC[] = [];
  RFxICs: RFxIC[] = [];
  RFxPartners: RFxPartner[] = [];
  RFxVendors: RFxVendor[] = [];

  displayedColumns: string[] = ['select', 'criteria', 'description', 'Action'];
  displayedRatingColumns: string[] = ['select', 'criteria', 'description', 'Action'];
  displayedPartnerColumns: string[] = ['select', 'type', 'usertable', 'Action'];
  displayedVendorColumns: string[] = ['select', 'type', 'vendor', 'gst', 'city', 'Action'];
  displayedOtherColumns: string[] = ['select', 'question', 'answer', 'Action'];
  displayedAttachedColumns: string[] = ['select', 'document', 'remarks', 'Action'];
  displayedItemsColumns: string[] = ['select', 'item', 'material', 'materialtext', 'totalqty', 'per.sche qty', 'no.of.sche', 'biddingprice']

  RFxItemDataSource: MatTableDataSource<RFxItem>;
  RFxHCDataSource: MatTableDataSource<RFxHC>;
  RFxICDataSource: MatTableDataSource<RFxIC>;
  RFxPartnerDataSource: MatTableDataSource<RFxPartner>;
  RFxVendorDataSource: MatTableDataSource<RFxVendor>;
  RFxODDataSource: MatTableDataSource<RFxOD>;

  selection = new SelectionModel<CriteriaData>(true, []);
  @ViewChild('iDNumber') iDNumber: ElementRef;
  @ViewChild('EvalDate') EvalDate: ElementRef;
  @ViewChild('accHolderName') accHolderName: ElementRef;
  @ViewChild('AccountName') AccountName: ElementRef;
  @ViewChild('RFxHCName') RFxHCName: ElementRef;
  @ViewChild('RFxHCID') RFxHCID: ElementRef;
  @ViewChild('RFxHCCity') RFxHCCity: ElementRef;
  @ViewChild('RFxICID') RFxICID: ElementRef;
  @ViewChild('title') title: ElementRef;
  @ViewChild('ContactNumber') ContactNumber: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('activityDate') activityDate: ElementRef;
  @ViewChild('activityTime') activityTime: ElementRef;
  @ViewChild('activityText') activityText: ElementRef;
  fileToUpload: File;
  fileToUploadList: File[] = [];
  math = Math;

  Users: UserWithRole[] = [];
  FilteredUsers: UserWithRole[] = [];
  SupportMasters: SupportMaster[] = [];
  SupportHeader: SupportHeader;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _masterService: MasterService,
    private _RFxService: RFxService,
    private _vendorMasterService: VendorMasterService,
    public _supportDeskService: SupportDeskService,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder
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
    this.SelectedRFx = new RFxHeader();
    this.SelectedRFxView = new RFxView();
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
      if (this.MenuItems.indexOf('RFx') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this._router.navigate(['/auth/login']);
      }
      this.CreateAppUsage();
      this.InitializeRFxFormGroup();
      this.InitializeRFxItemFormGroup();
      this.InitializeRFxHCDetailsFormGroup();
      this.InitializeRFxICFormGroup();
      this.InitializeRFxPartnerFormGroup();
      this.GetRFxByRFxID();
      this.GetSupportMasters();
      this.GetUsers();
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
  InitializeRFxFormGroup(): void {
    this.RFxFormGroup = this._formBuilder.group({
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
    this.RFxFormGroup.get('City').disable();
    this.RFxFormGroup.get('State').disable();
    this.RFxFormGroup.get('Country').disable();
  }

  InitializeRFxItemFormGroup(): void {
    this.RFxItemFormGroup = this._formBuilder.group({
      Type: ['', Validators.required],
      RFxItemText: ['', Validators.required],
      EvalDate: ['', Validators.required],
    });
  }

  InitializeRFxHCDetailsFormGroup(): void {
    this.RFxHCDetailsFormGroup = this._formBuilder.group({
      AccountNumber: ['', Validators.required],
      AccountName: ['', Validators.required],
      RFxHCName: ['', Validators.required],
      RFxHCID: ['', Validators.required],
    });
  }

  InitializeRFxICFormGroup(): void {
    this.RFxICFormGroup = this._formBuilder.group({
      Name: ['', Validators.required],
      RFxICID: ['', Validators.required],
      ContactNumber: ['', [Validators.required, Validators.pattern('^(\\+91[\\-\\s]?)?[0]?(91)?[6789]\\d{9}$')]],
      Email: ['', [Validators.required, Validators.email]],
    });
  }

  InitializeRFxPartnerFormGroup(): void {
    this.RFxPartnerFormGroup = this._formBuilder.group({
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
      Attachment: ['', Validators.required],
    });
  }

  ResetControl(): void {
    this.SelectedRFx = new RFxHeader();
    this.SelectedRFxView = new RFxView();
    this.SelectedRFxID = '';
    this.RFxFormGroup.reset();
    Object.keys(this.RFxFormGroup.controls).forEach(key => {
      this.RFxFormGroup.get(key).enable();
      this.RFxFormGroup.get(key).markAsUntouched();
    });
    this.IsDisplayPhone2 = false;
    this.IsDisplayEmail2 = false;
    // this.fileToUpload = null;
    this.ClearRFxItemFormGroup();
    this.ClearRFxHCDetailsFormGroup();
    this.ClearRFxICFormGroup();
    this.ClearRFxPartnerFormGroup();
    this.ClearRFxItemDataSource();
    this.ClearRFxHCDetailsDataSource();
    this.ClearRFxICDataSource();
    this.ClearRFxPartnerDataSource();
  }

  ClearRFxItemFormGroup(): void {
    this.RFxItemFormGroup.reset();
    Object.keys(this.RFxItemFormGroup.controls).forEach(key => {
      this.RFxItemFormGroup.get(key).markAsUntouched();
    });
  }
  ClearRFxHCDetailsFormGroup(): void {
    this.RFxHCDetailsFormGroup.reset();
    Object.keys(this.RFxHCDetailsFormGroup.controls).forEach(key => {
      this.RFxHCDetailsFormGroup.get(key).markAsUntouched();
    });
  }
  ClearRFxICFormGroup(): void {
    this.RFxICFormGroup.reset();
    Object.keys(this.RFxICFormGroup.controls).forEach(key => {
      this.RFxICFormGroup.get(key).markAsUntouched();
    });
  }
  ClearRFxPartnerFormGroup(): void {
    this.RFxPartnerFormGroup.reset();
    Object.keys(this.RFxPartnerFormGroup.controls).forEach(key => {
      this.RFxPartnerFormGroup.get(key).markAsUntouched();
    });
  }

  ClearCertificateFormGroup(): void {
    this.CertificateFormGroup.reset();
    Object.keys(this.CertificateFormGroup.controls).forEach(key => {
      this.CertificateFormGroup.get(key).markAsUntouched();
    });
  }
  ClearRFxItemDataSource(): void {
    this.RFxItems = [];
    this.RFxItemDataSource = new MatTableDataSource(this.RFxItems);
  }
  ClearRFxHCDetailsDataSource(): void {
    this.RFxHCs = [];
    this.RFxHCDataSource = new MatTableDataSource(this.RFxHCs);
  }
  ClearRFxICDataSource(): void {
    this.RFxICs = [];
    this.RFxICDataSource = new MatTableDataSource(this.RFxICs);
  }
  ClearRFxPartnerDataSource(): void {
    this.RFxPartners = [];
    this.RFxPartnerDataSource = new MatTableDataSource(this.RFxPartners);
  }

  GetRFxByRFxID(): void {
    this._RFxService.GetRFxByRFxID(this.currentUserName).subscribe(
      (data) => {
        const RFx = data as RFxHeader;
        if (RFx) {
         // this.loadSelectedRFx(RFx);
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
            this.RFxFormGroup.get('City').patchValue(loc.District);
            this.RFxFormGroup.get('State').patchValue(loc.State);
            this.RFxFormGroup.get('Country').patchValue(loc.Country);
          }
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  DisplayPhone2(): void {
    this.RFxFormGroup.get('Phone2').setValidators([Validators.required, Validators.pattern('^(\\+91[\\-\\s]?)?[0]?(91)?[6789]\\d{9}$')]);
    this.RFxFormGroup.get('Phone2').updateValueAndValidity();
    this.IsDisplayPhone2 = true;
  }
  DisplayEmail2(): void {
    this.RFxFormGroup.get('Email2').setValidators([Validators.required, Validators.pattern('^(\\+91[\\-\\s]?)?[0]?(91)?[6789]\\d{9}$')]);
    this.RFxFormGroup.get('Email2').updateValueAndValidity();
    this.IsDisplayEmail2 = true;
  }


  // loadSelectedRFx(selectedRFx: RFxHeader): void {
  //   this.ResetControl();
  //   this.SelectedRFx = selectedRFx;
  //   this.SelectedRFxID = selectedRFx.RFxID;
  //   // this.EnableAllRFxTypes();
  //   this.SetRFxValues();
  //   this.GetRFxSubItems();
  // }
  // typeSelected(event): void {
  //   const selectedType = event.value;
  //   if (event.value) {
  //     this.SelectedRFx.Type = event.value;
  //   }
  // }
  // applyFilter(filterValue: string): void {
  //   this.RFxItemDataSource.filter = filterValue.trim().toLowerCase();
  // }

  // // EnableAllRFxTypes(): void {
  // //   Object.keys(this.RFxFormGroup.controls).forEach(key => {
  // //     this.RFxFormGroup.get(key).enable();
  // //   });
  // // }
  // SetRFxValues(): void {
  //   this.RFxFormGroup.get('Client').patchValue(this.SelectedRFx.Client);
  //   this.RFxFormGroup.get('Type').patchValue(this.SelectedRFx.Type);
  //   this.RFxFormGroup.get('Company').patchValue(this.SelectedRFx.Company);
  //   this.RFxFormGroup.get('LegalName').patchValue(this.SelectedRFx.LegalName);
  //   this.RFxFormGroup.get('AddressLine1').patchValue(this.SelectedRFx.AddressLine1);
  //   this.RFxFormGroup.get('AddressLine2').patchValue(this.SelectedRFx.AddressLine2);
  //   this.RFxFormGroup.get('PinCode').patchValue(this.SelectedRFx.PinCode);
  //   this.RFxFormGroup.get('City').patchValue(this.SelectedRFx.City);
  //   this.RFxFormGroup.get('State').patchValue(this.SelectedRFx.State);
  //   this.RFxFormGroup.get('Country').patchValue(this.SelectedRFx.Country);
  //   this.RFxFormGroup.get('Phone1').patchValue(this.SelectedRFx.Phone1);
  //   this.RFxFormGroup.get('Phone2').patchValue(this.SelectedRFx.Phone2);
  //   this.RFxFormGroup.get('Email1').patchValue(this.SelectedRFx.Email1);
  //   this.RFxFormGroup.get('Email2').patchValue(this.SelectedRFx.Email2);
  //   // this.RFxICFormGroup.get('Email').validator({}as AbstractControl);
  // }

  // GetRFxSubItems(): void {
  //   this.GetRFxItemsByRFxID();
  //   this.GetRFxHCsByRFxID();
  //   this.GetRFxICsByRFxID();
  //   this.GetRFxPartnersByRFxID();
  //   this.GetRFxVendorsByRFxID();
  // }

  // GetRFxItemsByRFxID(): void {
  //   this.IsProgressBarVisibile = true;
  //   this._RFxService.GetRFxItemsByRFxID(this.SelectedRFxID).subscribe(
  //     (data) => {
  //       this.IsProgressBarVisibile = false;
  //       this.RFxItems = data as RFxItem[];
  //       this.RFxItemDataSource = new MatTableDataSource(this.RFxItems);
  //     },
  //     (err) => {
  //       console.error(err);
  //       this.IsProgressBarVisibile = false;
  //       // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //     }
  //   );
  // }

  // GetRFxHCsByRFxID(): void {
  //   this.IsProgressBarVisibile = true;
  //   this._RFxService.GetRFxHCsByRFxID(this.SelectedRFxID).subscribe(
  //     (data) => {
  //       this.IsProgressBarVisibile = false;
  //       this.RFxHCs = data as RFxHC[];
  //       this.RFxHCDataSource = new MatTableDataSource(this.RFxHCs);
  //     },
  //     (err) => {
  //       console.error(err);
  //       this.IsProgressBarVisibile = false;
  //       // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //     }
  //   );
  // }

  // GetRFxICsByRFxID(): void {
  //   this.IsProgressBarVisibile = true;
  //   this._RFxService.GetRFxICsByRFxID(this.SelectedRFxID).subscribe(
  //     (data) => {
  //       this.IsProgressBarVisibile = false;
  //       this.RFxICs = data as RFxIC[];
  //       this.RFxICDataSource = new MatTableDataSource(this.RFxICs);
  //     },
  //     (err) => {
  //       console.error(err);
  //       this.IsProgressBarVisibile = false;
  //       // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //     }
  //   );
  // }

  // GetRFxPartnersByRFxID(): void {
  //   this.IsProgressBarVisibile = true;
  //   this._RFxService.GetRFxPartnersByRFxID(this.SelectedRFxID).subscribe(
  //     (data) => {
  //       this.IsProgressBarVisibile = false;
  //       this.RFxPartners = data as RFxPartner[];
  //       this.RFxPartnerDataSource = new MatTableDataSource(this.RFxPartners);
  //     },
  //     (err) => {
  //       console.error(err);
  //       this.IsProgressBarVisibile = false;
  //       // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //     }
  //   );
  // }

  // GetRFxVendorsByRFxID(): void {
  //   this.IsProgressBarVisibile = true;
  //   this._RFxService.GetRFxVendorsByRFxID(this.SelectedRFxID).subscribe(
  //     (data) => {
  //       this.IsProgressBarVisibile = false;
  //       this.RFxVendors = data as RFxVendor[];
  //       this.RFxVendorDataSource = new MatTableDataSource(this.RFxVendors);
  //     },
  //     (err) => {
  //       console.error(err);
  //       this.IsProgressBarVisibile = false;
  //       // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //     }
  //   );
  // }

  // AddRFxItemToTable(): void {
  //   if (this.RFxItemFormGroup.valid) {
  //     const FxItem = new RFxItem();
  //     RFxItem.Type = this.RFxItemFormGroup.get('Type').value;
  //     RFxItem.RFxItemText = this.RFxItemFormGroup.get('RFxItemText').value;
  //     RFxItem.EvalDate = this.RFxItemFormGroup.get('EvalDate').value;
  //     if (!this.RFxItems || !this.RFxItems.length) {
  //       this.RFxItems = [];
  //     }
  //     this.RFxItems.push(RFxItem);
  //     this.RFxItemDataSource = new MatTableDataSource(this.RFxItems);
  //     this.ClearRFxItemFormGroup();
  //   } else {
  //     this.ShowValidationErrors(this.RFxItemFormGroup);
  //   }
  // }

  // AddRFxHCToTable(): void {
  //   if (this.RFxHCDetailsFormGroup.valid) {
  //     const RFxHC = new RFxHC();
  //     RFxHC.AccountNumber = this.RFxHCDetailsFormGroup.get('AccountNumber').value;
  //     RFxHC.AccountName = this.RFxHCDetailsFormGroup.get('AccountName').value;
  //     RFxHC.RFxHCName = this.RFxHCDetailsFormGroup.get('RFxHCName').value;
  //     RFxHC.RFxHCID = this.RFxHCDetailsFormGroup.get('RFxHCID').value;
  //     if (!this.RFxHCs || !this.RFxHCs.length) {
  //       this.RFxHCs = [];
  //     }
  //     this.RFxHCs.push(RFxHC);
  //     this.RFxHCDetailsDataSource = new MatTableDataSource(this.RFxHCs);
  //     this.ClearRFxHCDetailsFormGroup();
  //   } else {
  //     this.ShowValidationErrors(this.RFxHCDetailsFormGroup);
  //   }
  // }


  // AddRFxICToTable(): void {
  //   if (this.RFxICFormGroup.valid) {
  //     const RFxIC = new RFxIC();
  //     RFxIC.Name = this.RFxICFormGroup.get('Name').value;
  //     RFxIC.RFxICID = this.RFxICFormGroup.get('RFxICID').value;
  //     RFxIC.ContactNumber = this.RFxICFormGroup.get('ContactNumber').value;
  //     RFxIC.Email = this.RFxICFormGroup.get('Email').value;
  //     if (!this.RFxICs || !this.RFxICs.length) {
  //       this.RFxICs = [];
  //     }
  //     this.RFxICs.push(RFxIC);
  //     this.RFxICDataSource = new MatTableDataSource(this.RFxICs);
  //     this.ClearRFxICFormGroup();
  //   } else {
  //     this.ShowValidationErrors(this.RFxICFormGroup);
  //   }
  // }

  // AddRFxPartnerToTable(): void {
  //   if (this.RFxPartnerFormGroup.valid) {
  //     const RFxPartner = new RFxPartner();
  //     RFxPartner.SeqNo = this.RFxPartnerFormGroup.get('SeqNo').value;
  //     RFxPartner.Date = this.RFxPartnerFormGroup.get('Date').value;
  //     RFxPartner.Time = this.RFxPartnerFormGroup.get('Time').value;
  //     RFxPartner.ActionText = this.RFxPartnerFormGroup.get('ActionText').value;
  //     if (!this.RFxPartners || !this.RFxPartners.length) {
  //       this.RFxPartners = [];
  //     }
  //     this.RFxPartners.push(RFxPartner);
  //     this.RFxPartnerDataSource = new MatTableDataSource(this.RFxPartners);
  //     this.ClearRFxPartnerFormGroup();
  //   } else {
  //     this.ShowValidationErrors(this.RFxPartnerFormGroup);
  //   }
  // }

  // RFxItemEnterKeyDown(): boolean {
  //   this.EvalDate.nativeElement.blur();
  //   this.AddRFxItemToTable();
  //   return true;
  // }

  // RFxHCEnterKeyDown(): boolean {
  //   this.RFxHCCity.nativeElement.blur();
  //   this.AddRFxHCToTable();
  //   return true;
  // }
  // RFxICEnterKeyDown(): boolean {
  //   this.email.nativeElement.blur();
  //   this.AddRFxICToTable();
  //   return true;
  // }
  // RFxPartnerEnterKeyDown(): boolean {
  //   this.activityText.nativeElement.blur();
  //   this.AddRFxPartnerToTable();
  //   return true;
  // }

  // keytab(elementName): void {
  //   switch (elementName) {
  //     case 'iDNumber': {
  //       this.iDNumber.nativeElement.focus();
  //       break;
  //     }
  //     case 'EvalDate': {
  //       this.EvalDate.nativeElement.focus();
  //       break;
  //     }
  //     case 'accHolderName': {
  //       this.accHolderName.nativeElement.focus();
  //       break;
  //     }
  //     case 'AccountName': {
  //       this.AccountName.nativeElement.focus();
  //       break;
  //     }
  //     case 'RFxHCName': {
  //       this.RFxHCName.nativeElement.focus();
  //       break;
  //     }
  //     case 'RFxHCID': {
  //       this.RFxHCID.nativeElement.focus();
  //       break;
  //     }
  //     case 'RFxHCCity': {
  //       this.RFxHCCity.nativeElement.focus();
  //       break;
  //     }
  //     case 'RFxICID': {
  //       this.RFxICID.nativeElement.focus();
  //       break;
  //     }
  //     case 'title': {
  //       this.title.nativeElement.focus();
  //       break;
  //     }
  //     case 'ContactNumber': {
  //       this.ContactNumber.nativeElement.focus();
  //       break;
  //     }
  //     case 'email': {
  //       this.email.nativeElement.focus();
  //       break;
  //     }
  //     case 'activityDate': {
  //       this.activityDate.nativeElement.focus();
  //       break;
  //     }
  //     case 'activityTime': {
  //       this.activityTime.nativeElement.focus();
  //       break;
  //     }
  //     case 'activityText': {
  //       this.activityText.nativeElement.focus();
  //       break;
  //     }
  //     default: {
  //       break;
  //     }
  //   }
  // }


  // RemoveRFxItemFromTable(RFxItem: RFxItem): void {
  //   const index: number = this.RFxItems.indexOf(RFxItem);
  //   if (index > -1) {
  //     this.RFxItems.splice(index, 1);
  //   }
  //   this.RFxItemDataSource = new MatTableDataSource(this.RFxItems);
  // }

  // RemoveRFxHCFromTable(RFxHC: RFxHC): void {
  //   const index: number = this.RFxHCs.indexOf(RFxHC);
  //   if (index > -1) {
  //     this.RFxHCs.splice(index, 1);
  //   }
  //   this.RFxHCDetailsDataSource = new MatTableDataSource(this.RFxHCs);
  // }


  // RemoveRFxICFromTable(RFxIC: RFxIC): void {
  //   const index: number = this.RFxICs.indexOf(RFxIC);
  //   if (index > -1) {
  //     this.RFxICs.splice(index, 1);
  //   }
  //   this.RFxICDataSource = new MatTableDataSource(this.RFxICs);
  // }

  // RemoveRFxPartnerFromTable(RFxPartner: RFxPartner): void {
  //   const index: number = this.RFxPartners.indexOf(RFxPartner);
  //   if (index > -1) {
  //     this.RFxPartners.splice(index, 1);
  //   }
  //   this.RFxPartnerDataSource = new MatTableDataSource(this.RFxPartners);
  // }

  // OpenConfirmationDialog(Actiontype: string, Catagory: string): void {
  //   const dialogConfig: MatDialogConfig = {
  //     data: {
  //       Actiontype: Actiontype,
  //       Catagory: Catagory
  //     },
  //     panelClass: 'confirmation-dialog'
  //   };
  //   const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
  //   dialogRef.afterClosed().subscribe(
  //     result => {
  //       if (result) {
  //         if (Actiontype === 'Update') {
  //           this.UpdateRFx();
  //         }
  //         else if (Actiontype === 'Approve') {
  //           // this.ApproveVendor();
  //         } else if (Actiontype === 'Reject') {
  //           // this.RejectVendor();
  //         } else if (Actiontype === 'Delete') {
  //           this.DeleteRFx();
  //         }
  //       }
  //     });
  // }

  // GetRFxValues(): void {
  //   this.SelectedRFx.Client = this.SelectedRFxView.Client = this.RFxFormGroup.get('Client').value;
  //   this.SelectedRFx.Type = this.SelectedRFxView.Type = this.RFxFormGroup.get('Type').value;
  //   this.SelectedRFx.Company = this.SelectedRFxView.Company = this.RFxFormGroup.get('Company').value;
  //   this.SelectedRFx.LegalName = this.SelectedRFxView.LegalName = this.RFxFormGroup.get('LegalName').value;
  //   this.SelectedRFx.AddressLine1 = this.SelectedRFxView.AddressLine1 = this.RFxFormGroup.get('AddressLine1').value;
  //   this.SelectedRFx.AddressLine2 = this.SelectedRFxView.AddressLine2 = this.RFxFormGroup.get('AddressLine2').value;
  //   this.SelectedRFx.City = this.SelectedRFxView.City = this.RFxFormGroup.get('City').value;
  //   this.SelectedRFx.State = this.SelectedRFxView.State = this.RFxFormGroup.get('State').value;
  //   this.SelectedRFx.Country = this.SelectedRFxView.Country = this.RFxFormGroup.get('Country').value;
  //   this.SelectedRFx.PinCode = this.SelectedRFxView.PinCode = this.RFxFormGroup.get('PinCode').value;
  //   this.SelectedRFx.Phone1 = this.SelectedRFxView.Phone1 = this.RFxFormGroup.get('Phone1').value;
  //   this.SelectedRFx.Phone2 = this.SelectedRFxView.Phone2 = this.RFxFormGroup.get('Phone2').value;
  //   this.SelectedRFx.Email1 = this.SelectedRFxView.Email1 = this.RFxFormGroup.get('Email1').value;
  //   this.SelectedRFx.Email2 = this.SelectedRFxView.Email2 = this.RFxFormGroup.get('Email2').value;
  //   // this.SelectedRFx.VendorCode = this.SelectedRFxView.VendorCode = this.RFxFormGroup.get('VendorCode').value;
  //   // this.SelectedRFx.ParentVendor = this.SelectedRFxView.ParentVendor = this.RFxFormGroup.get('ParentVendor').value;
  //   // this.SelectedRFx.Status = this.SelectedRFxView.Status = this.RFxFormGroup.get('Status').value;

  // }

  // GetRFxSubItemValues(): void {
  //   this.GetRFxItemValues();
  //   this.GetRFxHCValues();
  //   this.GetRFxICValues();
  //   this.GetRFxPartnerValues();
  // }

  // GetRFxItemValues(): void {
  //   this.SelectedRFxView.RFxItems = [];
  //   // this.SelectedRFxView.bPIdentities.push(...this.RFxItems);
  //   this.RFxItems.forEach(x => {
  //     this.SelectedRFxView.RFxItems.push(x);
  //   });
  // }

  // GetRFxHCValues(): void {
  //   this.SelectedRFxView.RFxHCs = [];
  //   // this.SelectedRFxView.RFxHCs.push(...this.RFxHCs);
  //   this.RFxHCs.forEach(x => {
  //     this.SelectedRFxView.RFxHCs.push(x);
  //   });
  // }

  // GetRFxICValues(): void {
  //   this.SelectedRFxView.RFxICs = [];
  //   // this.SelectedRFxView.bPIdentities.push(...this.RFxItems);
  //   this.RFxICs.forEach(x => {
  //     this.SelectedRFxView.RFxICs.push(x);
  //   });
  // }

  // GetRFxPartnerValues(): void {
  //   this.SelectedRFxView.RFxPartners = [];
  //   // this.SelectedRFxView.RFxHCs.push(...this.RFxHCs);
  //   this.RFxPartners.forEach(x => {
  //     this.SelectedRFxView.RFxPartners.push(x);
  //   });
  // }

  // SaveClicked(): void {
  //   if (this.RFxFormGroup.valid) {
  //     const Actiontype = 'Update';
  //     const Catagory = 'RFx';
  //     this.OpenConfirmationDialog(Actiontype, Catagory);
  //   } else {
  //     this.ShowValidationErrors(this.RFxFormGroup);
  //   }
  // }

  // CreateRFx(): void {
  //   // this.GetRFxValues();
  //   // this.GetRFxSubItemValues();
  //   // this.SelectedRFxView.CreatedBy = this.authenticationDetails.userID.toString();
  //   this.IsProgressBarVisibile = true;
  //   this._RFxService.CreateRFx(this.SelectedRFxView).subscribe(
  //     (data) => {
  //       this.SelectedRFx.PatnerID = data;
  //       this.ResetControl();
  //       this.notificationSnackBarComponent.openSnackBar('Vendor registered successfully', SnackBarStatus.success);
  //       this.IsProgressBarVisibile = false;
  //       // this.GetRegisteredRFxs();
  //     },
  //     (err) => {
  //       console.error(err);
  //       this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //       this.IsProgressBarVisibile = false;
  //     }
  //   );

  // }

  // UpdateRFx(): void {
  //   this.GetRFxValues();
  //   this.GetRFxSubItemValues();
  //   this.SelectedRFxView.PatnerID = this.SelectedRFx.PatnerID;
  //   this.SelectedRFxView.ModifiedBy = this.authenticationDetails.UserID.toString();
  //   this.IsProgressBarVisibile = true;
  //   this._RFxService.UpdateRFx(this.SelectedRFxView).subscribe(
  //     (data) => {
  //       this.CreateSupportTicket();
  //     },
  //     (err) => {
  //       console.error(err);
  //       this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //       this.IsProgressBarVisibile = false;
  //     }
  //   );
  // }

  // DeleteRFx(): void {
  //   this.GetRFxValues();
  //   // this.SelectedRFx.ModifiedBy = this.authenticationDetails.userID.toString();
  //   this.IsProgressBarVisibile = true;
  //   this._RFxService.DeleteRFx(this.SelectedRFx).subscribe(
  //     (data) => {
  //       // console.log(data);
  //       this.ResetControl();
  //       this.notificationSnackBarComponent.openSnackBar('Vendor deleted successfully', SnackBarStatus.success);
  //       this.IsProgressBarVisibile = false;
  //       // this.GetRegisteredRFxs();
  //     },
  //     (err) => {
  //       console.error(err);
  //       this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //       this.IsProgressBarVisibile = false;
  //     }
  //   );
  // }
  // GetSupportTicket(): SupportHeaderView {
  //   const SupportTicketView: SupportHeaderView = new SupportHeaderView();
  //   SupportTicketView.Client = this.SelectedRFx.Client;
  //   SupportTicketView.Company = this.SelectedRFx.Company;
  //   SupportTicketView.Type = this.SelectedRFx.Type;
  //   SupportTicketView.PatnerID = this.SelectedRFx.PatnerID;
  //   SupportTicketView.ReasonCode = '1236';
  //   SupportTicketView.Reason = 'Master Data Change';
  //   SupportTicketView.DocumentRefNo = this.SelectedRFx.PatnerID;
  //   SupportTicketView.CreatedBy = this.CurrentUserID.toString();
  //   let supportMaster = new SupportMaster();
  //   supportMaster = this.SupportMasters.find(x => x.ReasonCode === SupportTicketView.ReasonCode);
  //   if (supportMaster) {
  //     this.GetFilteredUsers(supportMaster);
  //   }
  //   console.log(this.FilteredUsers);
  //   SupportTicketView.Users = this.FilteredUsers;
  //   return SupportTicketView;
  // }

  // GetFilteredUsers(supportMaster: SupportMaster): any {
  //   if (supportMaster.Person1 && supportMaster.Person1 != null) {
  //     let user = new UserWithRole();
  //     user = this.Users.find(x => x.UserName.toLowerCase() === supportMaster.Person1.toLowerCase());
  //     this.FilteredUsers.push(user);
  //   }
  //   else if (supportMaster.Person2 && supportMaster.Person2 != null) {
  //     let user = new UserWithRole();
  //     user = this.Users.find(x => x.UserName.toLowerCase() === supportMaster.Person2.toLowerCase());
  //     this.FilteredUsers.push(user);
  //   }
  //   else if (supportMaster.Person3 && supportMaster.Person3 != null) {
  //     let user = new UserWithRole();
  //     user = this.Users.find(x => x.UserName.toLowerCase() === supportMaster.Person3.toLowerCase());
  //     this.FilteredUsers.push(user);
  //   }
  // }
  // CreateSupportTicket(): void {
  //   this.IsProgressBarVisibile = true;
  //   const SupportTicketView = this.GetSupportTicket();
  //   this._supportDeskService.CreateSupportTicket(SupportTicketView).subscribe(
  //     (data) => {
  //       this.ResetControl();
  //       this.notificationSnackBarComponent.openSnackBar('RFx details updated successfully', SnackBarStatus.success);
  //       this.IsProgressBarVisibile = false;
  //       this.GetRFxByRFxID();
  //     },
  //     (err) => {
  //       this.ShowErrorNotificationSnackBar(err);
  //     }
  //   );
  // }
  // ShowErrorNotificationSnackBar(err: any): void {
  //   console.error(err);
  //   this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //   this.IsProgressBarVisibile = false;
  // }
  // ShowValidationErrors(formGroup: FormGroup): void {
  //   Object.keys(formGroup.controls).forEach(key => {
  //     if (!formGroup.get(key).valid) {
  //       console.log(key);
  //     }
  //     formGroup.get(key).markAsTouched();
  //     formGroup.get(key).markAsDirty();
  //     if (formGroup.get(key) instanceof FormArray) {
  //       const FormArrayControls = formGroup.get(key) as FormArray;
  //       Object.keys(FormArrayControls.controls).forEach(key1 => {
  //         if (FormArrayControls.get(key1) instanceof FormGroup) {
  //           const FormGroupControls = FormArrayControls.get(key1) as FormGroup;
  //           Object.keys(FormGroupControls.controls).forEach(key2 => {
  //             FormGroupControls.get(key2).markAsTouched();
  //             FormGroupControls.get(key2).markAsDirty();
  //             if (!FormGroupControls.get(key2).valid) {
  //               console.log(key2);
  //             }
  //           });
  //         } else {
  //           FormArrayControls.get(key1).markAsTouched();
  //           FormArrayControls.get(key1).markAsDirty();
  //         }
  //       });
  //     }
  //   });

  // }

  // ApproveClicked(): void {
  //   if (this.RFxFormGroup.valid) {
  //     this.GetRFxValues();
  //     this.GetRFxSubItemValues();
  //     this.SetActionToOpenConfirmation('Approve');
  //   } else {
  //     this.ShowValidationErrors(this.RFxFormGroup);
  //   }
  // }
  // RejectClicked(): void {
  //   if (this.RFxFormGroup.valid) {
  //     this.GetRFxValues();
  //     this.GetRFxSubItemValues();
  //     this.SetActionToOpenConfirmation('Reject');
  //   } else {
  //     this.ShowValidationErrors(this.RFxFormGroup);
  //   }
  // }

  // SetActionToOpenConfirmation(actiontype: string): void {
  //   if (this.SelectedRFxID) {
  //     const Actiontype = actiontype;
  //     const Catagory = 'Vendor';
  //     this.OpenConfirmationDialog(Actiontype, Catagory);
  //   }
  // }

  // DeleteClicked(): void {
  //   // if (this.RFxFormGroup.valid) {
  //   if (this.SelectedRFxID) {
  //     const Actiontype = 'Delete';
  //     const Catagory = 'Vendor';
  //     this.OpenConfirmationDialog(Actiontype, Catagory);
  //   }
  //   // } else {
  //   //   this.ShowValidationErrors(this.RFxFormGroup);
  //   // }
  // }

  // handleFileRFxItem(evt): void {
  //   if (evt.target.files && evt.target.files.length > 0) {
  //     this.fileToUpload = evt.target.files[0];
  //     this.fileToUploadList.push(this.fileToUpload);
  //   }
  // }

  // numberOnly(event): boolean {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode === 8 || charCode === 9 || charCode === 13 || charCode === 46
  //     || charCode === 37 || charCode === 39 || charCode === 123 || charCode === 190) {
  //     return true;
  //   }
  //   else if (charCode < 48 || charCode > 57) {
  //     return false;
  //   }
  //   return true;
  // }
  // // GetAttachment(fileName: string, file?: File): void {
  // //   if (file && file.size) {
  // //     const blob = new Blob([file], { type: file.type });
  // //     this.OpenAttachmentDialog(fileName, blob);
  // //   } else {
  // //     this.IsProgressBarVisibile = true;
  // //     this._RFxService.DowloandRFxImage(fileName).subscribe(
  // //       data => {
  // //         if (data) {
  // //           let fileType = 'image/jpg';
  // //           fileType = fileName.toLowerCase().includes('.jpg') ? 'image/jpg' :
  // //             fileName.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
  // //               fileName.toLowerCase().includes('.png') ? 'image/png' :
  // //                 fileName.toLowerCase().includes('.gif') ? 'image/gif' : '';
  // //           const blob = new Blob([data], { type: fileType });
  // //           this.OpenAttachmentDialog(fileName, blob);
  // //         }
  // //         this.IsProgressBarVisibile = false;
  // //       },
  // //       error => {
  // //         console.error(error);
  // //         this.IsProgressBarVisibile = false;
  // //       }
  // //     );
  // //   }
  // // }
  // // OpenAttachmentDialog(FileName: string, blob: Blob): void {
  // //   const attachmentDetails: AttachmentDetails = {
  // //     FileName: FileName,
  // //     blob: blob
  // //   };
  // //   const dialogConfig: MatDialogConfig = {
  // //     data: attachmentDetails,
  // //     panelClass: 'attachment-dialog'
  // //   };
  // //   const dialogRef = this.dialog.open(AttachmentDialogComponent, dialogConfig);
  // //   dialogRef.afterClosed().subscribe(result => {
  // //     if (result) {
  // //     }
  // //   });
  // // }


  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.CriteriaDataSource.data.length;
  //   return numSelected === numRows;
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.CriteriaDataSource.data.forEach(row => this.selection.select(row));
  // }

  // /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: CriteriaData): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Criteria + 1}`;
  // }

  // select_dialog(): void {
  //   const dialogRef = this.Dialog.open(SelectdialogComponent, {
  //     width: '1000px',
  //     height: '550px',
  //   });
  // }

}

export interface CriteriaData {
  Criteria: any;
  Description: any;
}
export interface ItemData {
  Item: any;
  Material: any;
  MaterialText: any;
  Totalqty: any;
  Persche: any;
  Number: any;
  Bidding: any;
}
export interface RatingData {
  Criteria: any;
  Description: any;
}
export interface PartnerData {
  Type: any;
  Usertable: any;
}
export interface VendorData {
  Type: any;
  Vendor: any;
  GST: any;
  City: any;
}
export interface OtherData {
  Question: any;
  Answer: any;
}
export interface AttachedData {
  Document: any;
  Remarks: any;
}
const EvaluationData: CriteriaData[] = [
  {
    Criteria: '', Description: ''
  }, {
    Criteria: '', Description: ''
  }
]
const ItemsDetails: ItemData[] = [
  {
    Item: '', Material: '', MaterialText: '', Totalqty: '', Persche: '', Number: '', Bidding: ''
  },
  {
    Item: '', Material: '', MaterialText: '', Totalqty: '', Persche: '', Number: '', Bidding: ''
  }
]
const RatingDetails: RatingData[] = [
  {
    Criteria: '', Description: ''
  }, {
    Criteria: '', Description: ''
  }
]
const PartnerDetails: PartnerData[] = [
  {
    Type: '', Usertable: ''
  }, {
    Type: '', Usertable: ''
  }
]
const VendorDetails: VendorData[] = [
  {
    Type: '', Vendor: '', GST: '', City: ''
  },
  {
    Type: '', Vendor: '', GST: '', City: ''
  }
]
const OtherDetails: OtherData[] = [
  {
    Question: '', Answer: ''
  },
  {
    Question: '', Answer: ''
  }
]
const AttachedDetails: AttachedData[] = [
  {
    Document: '', Remarks: ''
  },
  {
    Document: '', Remarks: ''
  }
]
