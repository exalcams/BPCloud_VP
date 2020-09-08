import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SelectdialogComponent } from '../selectdialog/selectdialog.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CreationComponent implements OnInit {

  displayedColumns: string[] = ['select', 'criteria', 'description', 'Action'];
  displayedRatingColumns: string[] = ['select', 'criteria', 'description', 'Action'];
  displayedPartnerColumns: string[] = ['select', 'type', 'usertable', 'Action'];
  displayedVendorColumns: string[] = ['select', 'type', 'vendor', 'gst', 'city', 'Action'];
  displayedOtherColumns: string[] = ['select', 'question', 'answer', 'Action'];
  displayedAttachedColumns: string[] = ['select', 'document', 'remarks', 'Action'];
  displayedItemsColumns: string[] = ['select', 'item', 'material', 'materialtext', 'totalqty', 'per.sche qty', 'no.of.sche', 'biddingprice']
  CriteriaDataSource = new MatTableDataSource<CriteriaData>(EvaluationData);
  ItemDataSource = new MatTableDataSource<ItemData>(ItemsDetails);
  RatingDataSource = new MatTableDataSource<RatingData>(RatingDetails);
  PartnerDataSource = new MatTableDataSource<PartnerData>(PartnerDetails);
  VendorDataSource = new MatTableDataSource<VendorData>(VendorDetails);
  OtherDataSource = new MatTableDataSource<OtherData>(OtherDetails);
  AttachedDataSource = new MatTableDataSource<AttachedData>(AttachedDetails);
  selection = new SelectionModel<CriteriaData>(true, []);
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.CriteriaDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.CriteriaDataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: CriteriaData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Criteria + 1}`;
  }

  constructor(public Dialog: MatDialog) { }

  ngOnInit(): void {
  }
  select_dialog(): void {
    const dialogRef = this.Dialog.open(SelectdialogComponent, {
      width: '1000px',
      height: '550px',
    });
  }

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
