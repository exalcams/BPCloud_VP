import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatFormFieldModule, MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, 
  MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule,
  MatStepperModule, MatDatepickerModule, MatDialogModule, MatDividerModule, MatExpansionModule, 
  MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, 
  MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, 
  MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, 
  MatSortModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatTreeModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule, FuseCountdownModule, FuseHighlightModule, FuseMaterialColorPickerModule, FuseWidgetModule } from '@fuse/components';
import { FormsModule } from '@angular/forms';
import { PoSchedulesComponent } from './po-schedules/po-schedules.component';
import { ASNListComponent } from './asnlist/asnlist.component';
import { GRNListComponent } from './grnlist/grnlist.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';

const route: Routes = [
  {
    path: 'poschedules',
    component: PoSchedulesComponent
  },
  {
    path: 'asnlist',
    component: ASNListComponent
  },
  {
    path: 'grnlist',
    component: GRNListComponent
  },
  {
    path: 'invoicelist',
    component: InvoiceListComponent
  }
];
@NgModule({
  declarations: [PoSchedulesComponent, ASNListComponent, GRNListComponent, InvoiceListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
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


    FuseSharedModule,
    FuseSidebarModule,

    FuseCountdownModule,
    FuseHighlightModule,
    FuseMaterialColorPickerModule,
    FuseWidgetModule,

    FormsModule,
  ]
})
export class OrderFulfilmentModule { }
