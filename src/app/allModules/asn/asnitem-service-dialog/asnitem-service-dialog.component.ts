import { ViewEncapsulation } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { BPCASNItemSES } from 'app/models/ASN';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-asnitem-service-dialog',
  templateUrl: './asnitem-service-dialog.component.html',
  styleUrls: ['./asnitem-service-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ASNItemServiceDialogComponent implements OnInit {
  ASNBPCASNItemSESes: BPCASNItemSES[] = [];
  ASNBPCASNItemSESDisplayedColumns: string[] = [
    'Item',
    'ServiceNo',
    'ServiceItem',
    'OrderedQty',
    'OpenQty',
    'ServiceQty',
  ];
  ASNItemSESFormGroup: FormGroup;
  ASNItemSESFormArray: FormArray = this._formBuilder.array([]);
  ASNItemSESDataSource = new BehaviorSubject<AbstractControl[]>([]);
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.InitializeASNItemSESFormGroup();
    this.InitializeASNItemSESFormGroupValue();
  }
  InitializeASNItemSESFormGroup(): void {
    this.ASNItemSESFormGroup = this._formBuilder.group({
      ASNItemSESes: this.ASNItemSESFormArray
    });
  }
  ClearASNItems(): void {
    this.ClearFormArray(this.ASNItemSESFormArray);
    this.ASNItemSESDataSource.next(this.ASNItemSESFormArray.controls);
  }
  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
  InitializeASNItemSESFormGroupValue(): void {
    if (this.ASNBPCASNItemSESes && this.ASNBPCASNItemSESes.length) {
      this.ASNBPCASNItemSESes.forEach((x, i) => {
        this.InsertASNItemsFormGroup(x);
      });
    }
  }

  InsertASNItemsFormGroup(asnItem: BPCASNItemSES): void {
    const row = this._formBuilder.group({
      Item: [asnItem.Item],
      ServiceNo: [asnItem.ServiceNo],
      ServiceItem: [asnItem.ServiceItem],
      OrderedQty: [asnItem.OrderedQty],
      OpenQty: [asnItem.OpenQty],
      ServiceQty: [asnItem.ServiceQty],
    });
    row.disable();
    this.ASNItemSESFormArray.push(row);
    this.ASNItemSESDataSource.next(this.ASNItemSESFormArray.controls);
    // return row;
  }
}
