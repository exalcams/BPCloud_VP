import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FuseSidebarModule } from "@fuse/components";
import { MatCarouselModule } from "@ngmodule/material-carousel";

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
import { TranslateModule } from "@ngx-translate/core";
import { NgxDropzoneModule } from 'ngx-dropzone';
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

import { ChatModule } from '../chat/chat.module';
import { SupportChatComponent } from './support-chat/support-chat.component';
import { SupportDeskComponent } from './support-desk/support-desk.component';
import { SupportTicketComponent } from './support-ticket/support-ticket.component';
import { FaqComponent } from "./faq/faq.component";
import { DeclarationComponent } from './declaration/declaration.component';
import { ResourceComponent } from "./resource/resource.component";
// import { ChatModule } from '../chat';
// import 'chart.piecelabel.js';

const routes = [
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
        path: "faq",
        component: FaqComponent,
    },
    {
        path: "declaration",
        component: DeclarationComponent,
    },
    {
        path: "resource",
        component: ResourceComponent,
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
        NgxDropzoneModule,
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
        RouterModule.forChild(routes),
        MatCarouselModule,
        ChatModule,
        TranslateModule
    ],
    declarations: [
        SupportDeskComponent,
        SupportTicketComponent,
        SupportChatComponent,
        FaqComponent,
        DeclarationComponent,
        ResourceComponent
    ],
    providers: [DecimalPipe],
    entryComponents: [],
})
export class SupportModule { }
