import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {
    MatButtonModule, MatIconModule, MatSnackBar, MatSnackBarModule, MatDialogModule, MatToolbarModule,
    MAT_DATE_LOCALE, MatProgressSpinnerModule, MatProgressBarModule, MatExpansionModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { NotificationSnackBarComponent } from './notifications/notification-snack-bar/notification-snack-bar.component';
import { DatePipe } from '@angular/common';
import { NotificationDialogComponent } from './notifications/notification-dialog/notification-dialog.component';
import { WINDOW_PROVIDERS } from './window.providers';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AttachmentDialogComponent } from './allModules/pages/attachment-dialog/attachment-dialog.component';
import { PaymentModule } from './allModules/payment/payment.module';
import { AttachmentViewDialogComponent } from './allModules/pages/attachment-view-dialog/attachment-view-dialog.component';
// import { CustomerModule } from './allModules/customer/customer.module';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BnNgIdleService } from 'bn-ng-idle';
import { InformationDialogComponent } from './notifications/information-dialog/information-dialog.component';
// import { AuditModule } from './allModules/audit/audit.module';

const appRoutes: Routes = [
    {
        path: 'auth',
        loadChildren: './allModules/authentication/authentication.module#AuthenticationModule'
    },
    {
        path: 'pages',
        loadChildren: './allModules/pages/pages.module#PagesModule'
    },
    {
        path: 'master',
        loadChildren: './allModules/master/master.module#MasterModule'
    },
    {
        path: 'configuration',
        loadChildren: './allModules/configurationn/configuration.module#ConfigurationModule'
    },
    {
        path: 'audit',
        loadChildren: './allModules/audit/audit.module#AuditModule'
    },
    {
        path: 'invoice',
        loadChildren: './allModules/invoice/invoice.module#InvoiceModule'
    },
    // {
    //     path: 'payment',
    //     loadChildren: './allModules/payment/payment.module#PaymentModule'
    // },
    {
        path: 'fact',
        loadChildren: './allModules/fact/fact.module#FactModule'
    },
    {
        path: 'reports',
        loadChildren: './allModules/reports/reports.module#ReportsModule'
    },
    {
        path: 'customer',
        loadChildren: './allModules/customer/customer.module#CustomerModule'
    },
    {
        path: 'subcon',
        loadChildren: './allModules/subcon/subcon.module#SubconModule'
    },
    {
        path: 'payment',
        loadChildren: './allModules/payment/payment.module#PaymentModule'
    },
    {
        path: '**',
        redirectTo: 'auth/login'
    }
];

@NgModule({
    declarations: [
        AppComponent,
        NotificationSnackBarComponent,
        NotificationDialogComponent,
        AttachmentDialogComponent,
        AttachmentViewDialogComponent,
        InformationDialogComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, useHash: true }),

        TranslateModule.forRoot(),
        // NgMultiSelectDropDownModule.forRoot(),


        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatDialogModule,
        MatToolbarModule,
        MatExpansionModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,

        // App modules
        LayoutModule,
        PaymentModule,
        // AuditModule
    ],
    providers: [
        DatePipe,
        WINDOW_PROVIDERS,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
        BnNgIdleService
    ],
    bootstrap: [
        AppComponent
    ],
    entryComponents: [
        NotificationDialogComponent,
        AttachmentDialogComponent,
        AttachmentViewDialogComponent,
        InformationDialogComponent
    ]
})
export class AppModule {
}
