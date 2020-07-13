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

const menuRoutes: Routes = [
    {
        path: 'doctype',
        component: DocTypeMasterComponent,
    },
    // {
    //     path: 'role',
    //     component: RoleComponent,
    // },
    // {
    //     path: 'user',
    //     component: UserComponent,
    // },

];
@NgModule({
    declarations: [
        DocTypeMasterComponent
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

