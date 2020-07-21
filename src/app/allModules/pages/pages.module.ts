import { FaqComponent } from "./faq/faq.component";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FuseSidebarModule } from "@fuse/components";
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
    MatTreeModule,
} from "@angular/material";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgxDonutChartModule } from "ngx-doughnut-chart";
import {
    FuseCountdownModule,
    FuseHighlightModule,
    FuseMaterialColorPickerModule,
    FuseWidgetModule,
} from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { FormsModule } from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import { NgCircleProgressModule } from "ng-circle-progress";
import { ChartsModule } from "ng2-charts";
import "chartjs-plugin-labels";
import "chartjs-plugin-annotation";
import { PoFlipComponent } from "./po-flip/po-flip.component";
import { ASNComponent } from "./asn/asn.component";
import { HomeComponent } from "./home/home.component";
import { PaymentComponent } from "./payment/payment.component";
import { ResourceComponent } from "./resource/resource.component";
import { SupportDeskComponent } from "./support-desk/support-desk.component";
import { SupportTicketComponent } from "./support-ticket/support-ticket.component";
import { SupportChatComponent } from "./support-chat/support-chat.component";
import { DataMigrationComponent } from "./data-migration/data-migration.component";
import { PoFactsheetComponent } from "./po-factsheet/po-factsheet.component";
import { OrderFulFilmentCenterComponent } from "./order-fulfilment-center/order-fulfilment-center.component";
import { PerformanceComponent } from "./performance/performance.component";
import { NgImageSliderModule } from "ng-image-slider";
import { TranslateModule } from '@ngx-translate/core';

// import 'chart.piecelabel.js';

const routes = [
    {
        path: "orderfulfilmentCenter",
        component: OrderFulFilmentCenterComponent,
    },
    {
        path: "asn",
        component: ASNComponent,
    },
    {
        path: "poflip",
        component: PoFlipComponent,
    },
    {
        path: "dashboard",
        component: HomeComponent,
    },
    {
        path: "payment",
        component: PaymentComponent,
    },
    {
        path: "polookup",
        component: PoFactsheetComponent,
    },
    {
        path: "resource",
        component: ResourceComponent,
    },
    {
        path: "supportdesk",
        component: SupportDeskComponent,
    },
    {
        path: "supportticket",
        component: SupportTicketComponent,
    },
    {
        path: "supportchat",
        component: SupportChatComponent,
    },
    {
        path: "datamigration",
        component: DataMigrationComponent,
    },
    {
        path: "performance",
        component: PerformanceComponent,
    },
    {
        path: "faq",
        component: FaqComponent,
    },
    {
        path: "**",
        redirectTo: "/auth/login",
    },
];

@NgModule({
    imports: [
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
        NgxDonutChartModule,

        ChartsModule,

        FuseSharedModule,
        FuseSidebarModule,

        FuseCountdownModule,
        FuseHighlightModule,
        FuseMaterialColorPickerModule,
        FuseWidgetModule,
        // NgMultiSelectDropDownModule,

        FormsModule,
        NgCircleProgressModule.forRoot({
            // set defaults here
            radius: 60,
            outerStrokeWidth: 5,
            innerStrokeWidth: 2,
            outerStrokeColor: "#f3705a",
            innerStrokeColor: "#f3705a",
            showInnerStroke: true,
            animationDuration: 300,
        }),
        NgImageSliderModule,
        RouterModule.forChild(routes),
        TranslateModule
    ],
    declarations: [
        OrderFulFilmentCenterComponent,
        ASNComponent,
        PoFlipComponent,
        HomeComponent,
        PoFactsheetComponent,
        PaymentComponent,
        ResourceComponent,
        SupportDeskComponent,
        SupportTicketComponent,
        SupportChatComponent,
        DataMigrationComponent,
        PerformanceComponent,
        FaqComponent
    ],
    providers: [DecimalPipe],
    entryComponents: [],
})
export class PagesModule {}
