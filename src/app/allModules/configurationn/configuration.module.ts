import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    // tslint:disable-next-line:max-line-length
    MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,
    MatStepperModule, MatListModule, MatMenuModule, MatRadioModule, MatSidenavModule, MatToolbarModule,
    MatProgressSpinnerModule, MatTooltipModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import { DocTypeMasterComponent } from './doc-type-master/doc-type-master.component';
import { SessionMasterComponent } from './session-master/session-master.component';
import { SupportDeskMasterComponent } from './support-desk-master/support-desk-master.component';
import { CEOMessageComponent } from './ceomessage/ceomessage.component';
import { SCOCMessageComponent } from './scocmessage/scocmessage.component';

const menuRoutes: Routes = [
    {
        path: 'doctype',
        component: DocTypeMasterComponent,
    },
    {
        path: 'session',
        component: SessionMasterComponent,
    },
    {
        path: 'supportmaster',
        component: SupportDeskMasterComponent
    },
    {
        path: 'ceomsg',
        component: CEOMessageComponent
    },
    {
        path: 'scocmsg',
        component: SCOCMessageComponent
    }
];
@NgModule({
    declarations: [
        DocTypeMasterComponent,
        SessionMasterComponent,
        SupportDeskMasterComponent,
        CEOMessageComponent,
        SCOCMessageComponent
    ],
    imports: [
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatMenuModule,
        MatRadioModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTooltipModule,
        FuseSharedModule,
        FileUploadModule,
        RouterModule.forChild(menuRoutes)
    ],
    providers: [

    ]
})
export class ConfigurationModule {
}

