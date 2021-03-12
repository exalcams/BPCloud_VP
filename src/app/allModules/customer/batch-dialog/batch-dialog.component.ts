import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { BPCRetItemBatch } from 'app/models/customer';
import { CustomerService } from 'app/services/customer.service';

@Component({
  selector: 'app-batch-dialog',
  templateUrl: './batch-dialog.component.html',
  styleUrls: ['./batch-dialog.component.scss']
})
export class BatchDialogComponent implements OnInit {
BatchFormGroup:FormGroup;
  AllReturnItems: BPCRetItemBatch[]=[];
  // ReturnItemDataSource: MatTableDataSource<unknown>;
  constructor(@Inject(MAT_DIALOG_DATA) public ReturnItemBatch: BPCRetItemBatch,
  public dialogRef: MatDialogRef<BatchDialogComponent> ,private frombuilder:FormBuilder,private customerservice:CustomerService) { }
BatchDataSource:MatTableDataSource<BPCRetItemBatch>;
BatchDisplayedColumns:string[]=[
  "Batch",
  "RetQty",
  "Remove"
]
  ngOnInit() {
this.InitialiseBAtchFormGroup();
// this.BatchDataSource=new MatTableDataSource<BPCRetItemBatch>();
console.log(this.ReturnItemBatch);

  }

  InitialiseBAtchFormGroup(){
    this.BatchFormGroup=this.frombuilder.group({
      Batch:['',Validators.required],
     RetQty:['', Validators.required]
    }

    )
  }

  decimalOnly(event): boolean {
    // this.AmountSelected();
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 8 || charCode === 9 || charCode === 13 || charCode === 46
      || charCode === 37 || charCode === 39 || charCode === 123 || charCode === 190) {
      return true;
    }
    else if (charCode < 48 || charCode > 57) {
      return false;
    }
    return true;
  }
  CloseClicked(): void {
    this.dialogRef.close(false);
  }
  AddBatchToTable(){
   
      if (this.BatchFormGroup.valid) {
        const RItem = new BPCRetItemBatch();
        RItem.Batch = this.BatchFormGroup.get('Batch').value;
        RItem.RetQty = this.BatchFormGroup.get('RetQty').value;
      
        // PIItem.DeliveryDate = this.ReturnItemFormGroup.get('DeliveryDate').value;
        // PIItem.UOM = this.ReturnItemFormGroup.get('UOM').value;
        // PIItem.ReasonText = this.ReturnItemFormGroup.get('ReasonText').value;
        // PIItem.FileName = this.ReturnItemFormGroup.get('FileName').value;
    
        this.AllReturnItems.push(RItem);
        this.BatchDataSource = new MatTableDataSource(this.AllReturnItems);
        // this.ResetReturnItemFormGroup();
        // this.selectedDocCenterMaster = new BPCDocumentCenterMaster();
      } else {
        // this.ShowValidationErrors(this.ReturnItemFormGroup);
      }
    
  
   
  }
  // RemoveReturnItemFromTable(doc: BPCRetItem): void {
  //   const index: number = this.AllReturnItems.indexOf(doc);
  //   if (index > -1) {
  //     this.AllReturnItems.splice(index, 1);
  //     const indexx = this.fileToUploadList.findIndex(x => x.name === doc.FileName);
  //     if (indexx > -1) {
  //       this.fileToUploadList.splice(indexx, 1);
  //     }
  //   }
  //   this.ReturnItemDataSource = new MatTableDataSource(this.AllReturnItems);
  // }
GetBatchByRet(){
  this.customerservice.GetAllReturnbatch(this.ReturnItemBatch.RetReqID).subscribe(
    (data)=>{console.log(data)},
    (err)=>{console.log(err);
    }
  )
}
}
