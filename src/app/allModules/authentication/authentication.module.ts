import { NgModule } from '@angular/core';
import {
    MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
    MatDialogModule, MatProgressSpinnerModule, MatIconModule, MatToolbarModule
} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgetPasswordLinkDialogComponent } from './forget-password-link-dialog/forget-password-link-dialog.component';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { SoccDialogComponent } from './socc-dialog/socc-dialog.component'; 

// import { PdfViewerModule } from 'ng2-pdf-viewer';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
const authRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'changePassword',
        component: ChangePasswordComponent
    },
    {
        path: 'forgotPassword',
        component: ForgotPasswordComponent
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];

@NgModule({
    declarations: [
        LoginComponent,
        ChangePasswordComponent,
        ForgotPasswordComponent,
        ChangePasswordDialogComponent,
        ForgetPasswordLinkDialogComponent,
        SoccDialogComponent
    ],
    imports: [
        // PdfViewerModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        FuseSharedModule,
        MatDialogModule,
        MatIconModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        RouterModule.forChild(authRoutes)
    ],
    providers: [ 
        CookieService 
      ],
    entryComponents: [
        ChangePasswordDialogComponent,
        ForgetPasswordLinkDialogComponent,
        SoccDialogComponent
    ],
    
})
export class AuthenticationModule {
}
