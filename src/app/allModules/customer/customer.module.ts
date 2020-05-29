import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSidebarModule } from '@fuse/components';

import {
    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule
} from '@angular/material';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
    FuseCountdownModule,
    FuseHighlightModule,
    FuseMaterialColorPickerModule,
    FuseWidgetModule
} from '@fuse/components';

import { FuseSharedModule } from '@fuse/shared.module';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from "ng2-charts";
import "chartjs-plugin-labels";
import "chartjs-plugin-annotation";
import { DecimalPipe } from '@angular/common';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerFactComponent } from './customer-fact/customer-fact.component';
import { CustomerOrderfulfilmentComponent } from './customer-orderfulfilment/customer-orderfulfilment.component';
import { CustomerPolookupComponent } from './customer-polookup/customer-polookup.component';
import { PurchaseIndentComponent } from './purchase-indent/purchase-indent.component';
import { ReturnComponent } from './return/return.component';

const routes = [
    {
        path: 'dashboard',
        component: CustomerDashboardComponent
    },
    {
        path: 'orderfulfilment',
        component: CustomerOrderfulfilmentComponent
    },
    {
        path: 'polookup',
        component: CustomerPolookupComponent
    },
    {
        path: 'fact',
        component: CustomerFactComponent
    },
    {
        path: 'purchaseindent',
        component: PurchaseIndentComponent
    },
    {
        path: 'return',
        component: ReturnComponent
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        // HttpClientModule,
        // TranslateModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,

        NgxChartsModule,

        FuseSharedModule,
        FuseSidebarModule,

        FuseCountdownModule,
        FuseHighlightModule,
        FuseMaterialColorPickerModule,
        FuseWidgetModule,

        FormsModule,
        ChartsModule
    ],
    declarations: [CustomerDashboardComponent, CustomerFactComponent,
        CustomerOrderfulfilmentComponent, CustomerPolookupComponent, 
        PurchaseIndentComponent, ReturnComponent],
    providers: [
        DecimalPipe
    ],
    entryComponents: []
})
export class CustomerModule { }
