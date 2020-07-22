import { Component, OnInit, ViewEncapsulation, OnDestroy, Compiler } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { FuseNavigation } from '@fuse/types';
import { MenuUpdataionService } from 'app/services/menu-update.service';
import { AuthenticationDetails, ChangePassword, EMailModel, UserPreference } from 'app/models/master';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { ForgetPasswordLinkDialogComponent } from '../forget-password-link-dialog/forget-password-link-dialog.component';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  navigation: FuseNavigation[] = [];
  authenticationDetails: AuthenticationDetails;
  menuItems: string[] = [];
  children: FuseNavigation[] = [];
  subChildren: FuseNavigation[] = [];
  reportSubChildren: FuseNavigation[] = [];
  paymentSubChildren: FuseNavigation[] = [];
  configSubChildren: FuseNavigation[] = [];
  private _unsubscribeAll: Subject<any>;
  message = 'Snack Bar opened.';
  actionButtonLabel = 'Retry';
  action = true;
  setAutoHide = true;
  autoHide = 2000;
  addExtraClass: false;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  isProgressBarVisibile: boolean;
  setIntervalID: any;
  currentIndex: number;
  allTexts: string[] = [];
  currentText: string;
  fuseConfig: any;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _menuUpdationService: MenuUpdataionService,
    private _compiler: Compiler,
    // private _loginService: LoginService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    localStorage.removeItem('authorizationData');
    localStorage.removeItem('menuItemsData');
    localStorage.removeItem('userPreferenceData');
    this._compiler.clearCache();

    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };

    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.isProgressBarVisibile = false;
    this.currentIndex = 0;
    this.allTexts = ['Scalability', 'Reliability'];
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.setCurrentText();
    this.setIntervalID = setInterval(() => {
      this.setCurrentText();
    }, 2000);

  }

  setCurrentText(): void {
    if (this.currentIndex >= this.allTexts.length) {
      this.currentIndex = 0;
    }
    this.currentText = this.allTexts[this.currentIndex];
    this.currentIndex++;
  }

  loginClicked(): void {
    if (this.loginForm.valid) {
      this.isProgressBarVisibile = true;
     console.log(new Date().getTimezoneOffset());
      this._authService.login(this.loginForm.get('userName').value, this.loginForm.get('password').value).subscribe(
        (data) => {
          // this._authService.GetUserPreferenceByUserID(data.userID as Guid).subscribe(
          //   data1 => {
          //       let userPre = data1 as UserPreference;
          //       console.log(userPre);
          //       if (!userPre) {
          //           userPre = new UserPreference();
          //           userPre.NavbarPrimaryBackground = 'fuse-navy-700';
          //           userPre.NavbarSecondaryBackground = 'fuse-navy-700';
          //           userPre.ToolbarBackground = 'blue-800';
          //       }
          //       localStorage.setItem('userPreferenceData', JSON.stringify(userPre));
          //       console.log(userPre.ToolbarBackground);
          //       this.UpdateUserPreference();
          //   },
            
          //   );
          this.isProgressBarVisibile = false;
          const dat = data as AuthenticationDetails;
          if (data.isChangePasswordRequired === 'Yes') {
            this.openChangePasswordDialog(dat);
          } else {
            this.saveUserDetails(dat);
          }
        },
        (err) => {
          this.isProgressBarVisibile = false;
          console.error(err);
          this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        }
      );
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const abstractControl = this.loginForm.get(key);
        abstractControl.markAsDirty();
      });
    }

  }
  UpdateUserPreference(): void {
    this._fuseConfigService.config
        //   .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(config => {
            this.fuseConfig = config;
            // Retrive user preference from Local Storage
            const userPre = localStorage.getItem('userPreferenceData');
            if (userPre) {
                const userPrefercence: UserPreference = JSON.parse(userPre) as UserPreference;
                if (userPrefercence.NavbarPrimaryBackground && userPrefercence.NavbarPrimaryBackground !== '-') {
                    this.fuseConfig.layout.navbar.primaryBackground = userPrefercence.NavbarPrimaryBackground;
                } else {
                    this.fuseConfig.layout.navbar.primaryBackground = 'fuse-navy-700';
                }
                if (userPrefercence.NavbarSecondaryBackground && userPrefercence.NavbarSecondaryBackground !== '-') {
                    this.fuseConfig.layout.navbar.secondaryBackground = userPrefercence.NavbarSecondaryBackground;
                } else {
                    this.fuseConfig.layout.navbar.secondaryBackground = 'fuse-navy-700';
                }
                if (userPrefercence.ToolbarBackground && userPrefercence.ToolbarBackground !== '-') {
                    this.fuseConfig.layout.toolbar.background = userPrefercence.ToolbarBackground;
                    this.fuseConfig.layout.toolbar.customBackgroundColor = true;
                } else {
                    this.fuseConfig.layout.toolbar.background = 'blue-800';
                    this.fuseConfig.layout.toolbar.customBackgroundColor = true;
                }
            } else {
                this.fuseConfig.layout.navbar.primaryBackground = 'fuse-navy-700';
                this.fuseConfig.layout.navbar.secondaryBackground = 'fuse-navy-700';
                this.fuseConfig.layout.toolbar.background = 'blue-800';
                this.fuseConfig.layout.toolbar.customBackgroundColor = true;
            }
        });
    this._fuseConfigService.config = this.fuseConfig;
}

  saveUserDetails(data: AuthenticationDetails): void {
    localStorage.setItem('authorizationData', JSON.stringify(data));
    this.updateMenu();
    this.notificationSnackBarComponent.openSnackBar('Logged in successfully', SnackBarStatus.success);
    // if (data.userRole === 'Administrator') {
    //   this._router.navigate(['master/user']);
    // } else {
    //   this._router.navigate(['pages/dashboard']);
    // }
    if (data.UserRole === 'Customer') {
      this._router.navigate(['customer/dashboard']);
    }
    else if (data.UserRole === 'Administrator') {
      this._router.navigate(['pages/datamigration']);
    }
    else if (data.UserRole === 'HelpDeskAdmin') {
      this._router.navigate(['pages/supportdesk']);
    }
    else if (data.UserRole === 'CustomerHelpDeskAdmin') {
      this._router.navigate(['customer/supportdesk']);
    }
    else {
      this._router.navigate(['pages/dashboard']);
    }

  }

  openChangePasswordDialog(data: AuthenticationDetails): void {
    const dialogConfig: MatDialogConfig = {
      data: null,
      panelClass: 'change-password-dialog'
    };
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const changePassword = result as ChangePassword;
          changePassword.UserID = data.UserID;
          changePassword.UserName = data.UserName;
          this._authService.ChangePassword(changePassword).subscribe(
            (res) => {
              // console.log(res);
              // this.notificationSnackBarComponent.openSnackBar('Password updated successfully', SnackBarStatus.success);
              this.notificationSnackBarComponent.openSnackBar('Password updated successfully, please log with new password', SnackBarStatus.success);
              this._router.navigate(['/auth/login']);
            }, (err) => {
              this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
              this._router.navigate(['/auth/login']);
              console.error(err);
            }
          );
        }
      });
  }

  openForgetPasswordLinkDialog(): void {
    const dialogConfig: MatDialogConfig = {
      data: null,
      panelClass: 'forget-password-link-dialog'
    };
    const dialogRef = this.dialog.open(ForgetPasswordLinkDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const emailModel = result as EMailModel;
          this.isProgressBarVisibile = true;
          this._authService.SendResetLinkToMail(emailModel).subscribe(
            (data) => {
              const res = data as string;
              this.notificationSnackBarComponent.openSnackBar(res, SnackBarStatus.success);
              // this.notificationSnackBarComponent.openSnackBar(`Reset password link sent successfully to ${emailModel.EmailAddress}`, SnackBarStatus.success);
              // this.ResetControl();
              this.isProgressBarVisibile = false;
              // this._router.navigate(['auth/login']);
            },
            (err) => {
              console.error(err);
              this.isProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger); console.error(err);
            }
          );
        }
      });
  }

  updateMenu(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.menuItems = this.authenticationDetails.MenuItemNames.split(',');
    } else {
    }
    // Vendor Related Menu Items
    if (this.menuItems.indexOf('Dashboard') >= 0) {
      this.children.push(
        {
          id: 'dashboard',
          title: 'Dashboard',
          translate: 'NAV.VENDOR.DASHBOARD',
          type: 'item',
          icon: 'dashboardIcon',
          isSvgIcon: true,
          // icon: 'dashboard',
          url: '/pages/dashboard',
        }
      );
    }
    if (this.menuItems.indexOf('OrderFulFilmentCenter') >= 0) {
      this.children.push(
        {
          id: 'orderfulfilmentCenter',
          title: 'Order Fulfilment Center',
          translate: 'NAV.VENDOR.ORDER_FULFILMENT_CENTER',
          type: 'item',
          icon: 'orderfulfilmentIcon',
          isSvgIcon: true,
          // icon: 'dashboard',
          url: '/pages/orderfulfilmentCenter',
        }
      );
    }
    if (this.menuItems.indexOf('ASN') >= 0) {
      this.children.push(
        {
          id: 'asn',
          title: 'ASN',
          translate: 'NAV.VENDOR.ASN',
          type: 'item',
          icon: 'asnIcon',
          isSvgIcon: true,
          // icon: 'dashboard',
          url: '/pages/asn',
        }
      );
    }
    if (this.menuItems.indexOf('Flip') >= 0) {
      this.children.push(
        {
          id: 'flip',
          title: 'Flip',
          translate: 'NAV.VENDOR.FLIP',
          type: 'item',
          icon: 'flipIcon',
          isSvgIcon: true,
          // icon: 'dashboard',
          url: '/pages/poflip',
        }
      );
    }
    if (this.menuItems.indexOf('Invoice') >= 0) {
      this.children.push(
        {
          id: 'invoice',
          title: 'Invoice',
          translate: 'NAV.VENDOR.INVOICE',
          type: 'item',
          icon: 'billIcon',
          isSvgIcon: true,
          // icon: 'dashboard',
          url: '/invoice',
        }
      );
    }
    if (this.menuItems.indexOf('Resource') >= 0) {
      this.children.push(
        {
          id: 'resource',
          title: 'Resource',
          translate: 'NAV.VENDOR.RESOURCE',
          type: 'item',
          icon: 'resourceIcon',
          isSvgIcon: true,
          // icon: 'dashboard',
          url: '/pages/resource',
        }
      );
    }
    if (this.menuItems.indexOf('DataMigration') >= 0) {
      this.children.push(
        {
          id: 'datamigration',
          title: 'Data Migration',
          translate: 'NAV.VENDOR.DATA_MIGRATION',
          type: 'item',
          icon: 'receiptIcon',
          isSvgIcon: true,
          // icon: 'receipt',
          url: '/pages/datamigration',
        }
      );
    }
    if (this.menuItems.indexOf('SupportDesk') >= 0) {
      this.children.push(
        {
          id: 'supportdesk',
          title: 'Support Desk',
          translate: 'NAV.VENDOR.SUPPORT_DESK',
          type: 'item',
          icon: 'supportIcon',
          isSvgIcon: true,
          // icon: 'dashboard',
          url: '/pages/supportdesk',
        }
      );
    }
    if (this.menuItems.indexOf('Fact') >= 0) {
      this.children.push(
        {
          id: 'fact',
          title: 'My details',
          translate: 'NAV.VENDOR.MY_DETAILS',
          type: 'item',
          icon: 'detailsIcon',
          isSvgIcon: true,
          // icon: 'dashboard',
          url: '/fact',
        }
      );
    }
    if (this.menuItems.indexOf('Improvement') >= 0) {
      this.children.push(
        {
          id: 'improvement',
          title: 'Improvement',
          translate: 'NAV.VENDOR.IMPROVEMENT',
          type: 'item',
          icon: 'flipIcon',
          isSvgIcon: true,
          // icon: 'dashboard',
          url: '/pages/improvement',
        }
      );
    }
    if (this.menuItems.indexOf('AccountStatement') >= 0) {
      this.paymentSubChildren.push(
        {
          id: 'accountStatement',
          title: 'Account Statement',
          translate: 'NAV.VENDOR.ACCOUNT_STATEMENT',
          type: 'item',
          url: '/payment/accountStatement'
        }
      );
    }
    if (this.menuItems.indexOf('Payable') >= 0) {
      this.paymentSubChildren.push(
        {
          id: 'payable',
          title: 'Payables',
          translate: 'NAV.VENDOR.PAYABLES',
          type: 'item',
          url: '/payment/payable'
        },
      );
    }
    if (this.menuItems.indexOf('Payments') >= 0) {
      this.paymentSubChildren.push(
        {
          id: 'payments',
          title: 'Payments',
          translate: 'NAV.VENDOR.PAYMENTS',
          type: 'item',
          url: '/payment/payments'
        },
      );
    }
    if (this.menuItems.indexOf('TDS') >= 0) {
      this.paymentSubChildren.push(
        {
          id: 'tds',
          title: 'TDS',
          translate: 'NAV.VENDOR.TDS',
          type: 'item',
          url: '/payment/tds'
        },
      );
    }
    if (this.menuItems.indexOf('Payment') >= 0) {
      this.paymentSubChildren.push(
        {
          id: 'payment',
          title: 'Payment Advise',
          translate: 'NAV.VENDOR.PAYMENT_ADVISE',
          type: 'item',
          url: '/pages/payment'
        },
      );
    }
    if (this.menuItems.indexOf('Payments') >= 0 || this.menuItems.indexOf('Payable') >= 0 ||
      this.menuItems.indexOf('AccountStatement') >= 0 || this.menuItems.indexOf('TDS') >= 0 ||
      this.menuItems.indexOf('Payment') >= 0) {
      this.children.push({
        id: 'master',
        title: 'Financials',
        translate: 'NAV.VENDOR.FINANCIALS',
        type: 'collapsable',
        icon: 'paymentmethodIcon',
        isSvgIcon: true,
        // icon: 'view_list',
        children: this.paymentSubChildren
      }
      );
    }
    // Report Related Menu Items
    if (this.menuItems.indexOf('PPM') >= 0) {
      this.reportSubChildren.push(
        {
          id: 'ppm',
          title: 'PPM',
          translate: 'NAV.VENDOR.PPM',
          type: 'item',
          url: '/reports/ppm'
        }
      );
    }
    if (this.menuItems.indexOf('DOL') >= 0) {
      this.reportSubChildren.push(
        {
          id: 'dol',
          title: 'DOL',
          translate: 'NAV.VENDOR.DOL',
          type: 'item',
          url: '/reports/dol'
        }
      );
    }
    if (this.menuItems.indexOf('VendorRating') >= 0) {
      this.reportSubChildren.push(
        {
          id: 'vendorRating',
          title: 'Vendor Rating',
          translate: 'NAV.VENDOR.VENDOR_RATING',
          type: 'item',
          url: '/reports/vendorRating'
        }
      );
    }
    if (this.menuItems.indexOf('Overview') >= 0) {
      this.reportSubChildren.push(
        {
          id: 'overview',
          title: 'Overview',
          translate: 'NAV.VENDOR.OVERVIEW',
          type: 'item',
          url: '/reports/overview'
        }
      );
    }
    if (this.menuItems.indexOf('InspectionPlan') >= 0) {
      this.reportSubChildren.push(
        {
          id: 'inspectionPlan',
          title: 'Inspection Plan',
          translate: 'NAV.VENDOR.INSPECTION_PLAN',
          type: 'item',
          url: '/reports/inspectionPlan'
        }
      );
    }
    if (this.menuItems.indexOf('FGChildPartStock') >= 0) {
      this.reportSubChildren.push(
        {
          id: 'fgChildPartStock',
          title: 'FG Child Part Stock',
          translate: 'NAV.VENDOR.FG_CHILD_PART_STOCK',
          type: 'item',
          url: '/reports/fgChildPartStock'
        }
      );
    }
    if (this.menuItems.indexOf('GRReceipts') >= 0) {
      this.reportSubChildren.push(
        {
          id: 'grReceipts',
          title: 'GR Receipts',
          translate: 'NAV.VENDOR.GR_RECEIPTS',
          type: 'item',
          url: '/reports/grReceipts'
        }
      );
    }

    if (this.menuItems.indexOf('PPM') >= 0 || this.menuItems.indexOf('DOL') >= 0 ||
      this.menuItems.indexOf('VendorRating') >= 0 || this.menuItems.indexOf('Overview') >= 0 ||
      this.menuItems.indexOf('InspectionPlan') >= 0 || this.menuItems.indexOf('FGChildPartStock') >= 0
      || this.menuItems.indexOf('GRReciepts') >= 0) {
      this.children.push({
        id: 'reports',
        title: 'Reports',
        translate: 'NAV.VENDOR.REPORTS',
        type: 'collapsable',
        icon: 'reportIcon',
        isSvgIcon: true,
        // icon: 'view_list',
        children: this.reportSubChildren
      }
      );
    }
    // Customer Related Menu Items
    if (this.menuItems.indexOf('CustomerDashboard') >= 0) {
      this.children.push(
        {
          id: 'custdashboard',
          title: 'Dashboard',
          translate: 'NAV.CUSTOMER.DASHBOARD',
          type: 'item',
          icon: 'dashboardIcon',
          isSvgIcon: true,
          // icon: 'dashboard',
          url: '/customer/dashboard',
        }
      );
    }
    if (this.menuItems.indexOf('CustomerOrderFulFilmentCenter') >= 0) {
      this.children.push(
        {
          id: 'custorderfulfilmentCenter',
          title: 'Order Fulfilment Center',
          translate: 'NAV.CUSTOMER.ORDER_FULFILMENT_CENTER',
          type: 'item',
          icon: 'orderfulfilmentIcon',
          isSvgIcon: true,
          // icon: 'dashboard',
          url: '/customer/orderfulfilment',
        }
      );
    }
    if (this.menuItems.indexOf('PurchaseIndent') >= 0) {
      this.children.push(
        {
          id: 'fact',
          title: 'Purchase Indent',
          translate: 'NAV.CUSTOMER.PURCHASE_INDENT',
          type: 'item',
          icon: 'lookupIcon',
          isSvgIcon: true,
          // icon: 'dashboard',
          url: '/customer/purchaseindent',
        }
      );
    }
    if (this.menuItems.indexOf('Return') >= 0) {
      this.children.push(
        {
          id: 'fact',
          title: 'Return',
          translate: 'NAV.CUSTOMER.RETURN',
          type: 'item',
          icon: 'assignment_return',
          // isSvgIcon: true,
          // icon: 'dashboard',
          url: '/customer/return',
        }
      );
    }
    if (this.menuItems.indexOf('POD') >= 0) {
      this.children.push(
        {
          id: 'pod',
          title: 'POD',
          translate: 'NAV.CUSTOMER.POD',
          type: 'item',
          icon: 'podIcon',
          isSvgIcon: true,
          // icon: 'dashboard',
          url: '/customer/pod',
        }
      );
    }
    if (this.menuItems.indexOf('CustomerSupportDesk') >= 0) {
      this.children.push(
        {
          id: 'custsupportdesk',
          title: 'Support Desk',
          translate: 'NAV.CUSTOMER.SUPPORT_DESK',
          type: 'item',
          icon: 'supportIcon',
          isSvgIcon: true,
          // icon: 'dashboard',
          url: '/customer/supportdesk',
        }
      );
    }
    if (this.menuItems.indexOf('CustomerFact') >= 0) {
      this.children.push(
        {
          id: 'custfact',
          title: 'My details',
          translate: 'NAV.CUSTOMER.MY_DETAILS',
          type: 'item',
          icon: 'detailsIcon',
          isSvgIcon: true,
          // icon: 'dashboard',
          url: '/customer/fact',
        }
      );
    }
    // Admin Related Menu Items
    if (this.menuItems.indexOf('App') >= 0) {
      this.subChildren.push(
        {
          id: 'menuapp',
          title: 'App',
          translate: 'NAV.ADMIN.APP',
          type: 'item',
          url: '/master/menuApp'
        },
      );
    }
    if (this.menuItems.indexOf('Role') >= 0) {
      this.subChildren.push(
        {
          id: 'role',
          title: 'Role',
          translate: 'NAV.ADMIN.ROLE',
          type: 'item',
          url: '/master/role'
        },
      );
    }
    if (this.menuItems.indexOf('User') >= 0) {
      this.subChildren.push(
        {
          id: 'user',
          title: 'User',
          translate: 'NAV.ADMIN.USER',
          type: 'item',
          url: '/master/user'
        }
      );
    }
    if (this.menuItems.indexOf('App') >= 0 || this.menuItems.indexOf('Role') >= 0 ||
      this.menuItems.indexOf('User') >= 0) {
      this.children.push({
        id: 'master',
        title: 'Master',
        translate: 'NAV.ADMIN.MASTER',
        type: 'collapsable',
        icon: 'menuwithdotsIcon',
        isSvgIcon: true,
        // icon: 'view_list',
        children: this.subChildren
      }
      );
    }
    if (this.menuItems.indexOf('Doctype') >= 0) {
      this.configSubChildren.push(
        {
          id: 'doctype',
          title: 'ASN Doctype',
          translate: 'NAV.ADMIN.ASN_DOCTYPE',
          type: 'item',
          url: '/configuration/doctype'
        }
      );
    }
    if (this.menuItems.indexOf('Session') >= 0) {
      this.configSubChildren.push(
        {
          id: 'session',
          title: 'Session',
          translate: 'NAV.ADMIN.SESSION',
          type: 'item',
          url: '/configuration/session'
        }
      );
    }

    if (this.menuItems.indexOf('UserPreferences') >= 0) {
      this.configSubChildren.push(
        {
          id: 'userpreferences',
          title: 'User Preferences',
          type: 'item',
          url: '/master/userpreferences'
        }
      );
    }
    if (this.menuItems.indexOf('ExpenseType') >= 0) {
      this.configSubChildren.push(
        {
          id: 'expensetype',
          title: 'Expense Type',
          type: 'item',
          url: '/master/expensetype'
        }
      );
    }
    if (this.menuItems.indexOf('SupportDeskMaster') >= 0) {
      this.configSubChildren.push(
        {
          id: 'supportmaster',
          title: 'Support',
          translate: 'NAV.ADMIN.SUPPORT',
          type: 'item',
          url: '/configuration/supportmaster'
        }
      );
    }
    if (this.menuItems.indexOf('Doctype') >= 0 || this.menuItems.indexOf('Session') >= 0 ||
      this.menuItems.indexOf('SupportDeskMaster') >= 0) {
      this.children.push({
        id: 'configuration',
        title: 'Configuration',
        translate: 'NAV.ADMIN.CONFIGURATION',
        type: 'collapsable',
        icon: 'settings',
        isSvgIcon: false,
        // icon: 'view_list',
        children: this.configSubChildren
      }
      );
    }
    if (this.menuItems.indexOf('LoginHistory') >= 0) {
      this.children.push(
        {
          id: 'loginHistory',
          title: 'Login History',
          translate: 'NAV.ADMIN.LOGIN_HISTORY',
          type: 'item',
          icon: 'history',
          isSvgIcon: false,
          url: '/audit/loginHistory',
        }
      );
    }
    this.navigation.push({
      id: 'applications',
      title: '',
      translate: 'NAV.APPLICATIONS',
      type: 'group',
      children: this.children
    });
    // Saving local Storage
    localStorage.setItem('menuItemsData', JSON.stringify(this.navigation));
    // Update the service in order to update menu
    this._menuUpdationService.PushNewMenus(this.navigation);
  }

}
