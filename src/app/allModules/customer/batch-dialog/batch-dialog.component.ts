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
this.GetBatchByRet();

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
        var RItem = new BPCRetItemBatch();
        RItem.Batch = this.BatchFormGroup.get('Batch').value;
        RItem.RetQty = this.BatchFormGroup.get('RetQty').value;
       RItem.Client=this.ReturnItemBatch.Client;
       RItem.Company=this.ReturnItemBatch.Company;
       RItem.Item=this.ReturnItemBatch.Item;
       RItem.PatnerID=this.ReturnItemBatch.PatnerID;
       RItem.RetReqID=this.ReturnItemBatch.RetReqID;
       RItem.Type=this.ReturnItemBatch.Type;
       RItem.ModifiedOn=RItem.ModifiedBy=RItem.CreatedOn=RItem.CreatedBy=null;
      
       console.log(RItem);
       
        this.AllReturnItems.push(RItem);
        this.BatchDataSource = new MatTableDataSource(this.AllReturnItems);
      console.log(this.BatchDataSource);
        // this.ResetReturnItemFormGroup();
        // this.selectedDocCenterMaster = new BPCDocumentCenterMaster();
      } else {
        // this.ShowValidationErrors(this.ReturnItemFormGroup);
      }
    
  
   
  }
  RemoveReturnBatchItemFromTable(item: BPCRetItemBatch): void {
    const index: number = this.AllReturnItems.indexOf(item);
    if (index > -1) {
      this.AllReturnItems.splice(index, 1);
    }
    this.BatchDataSource = new MatTableDataSource(this.AllReturnItems);
  }
GetBatchByRet(){
  this.customerservice.GetAllReturnbatch(this.ReturnItemBatch.RetReqID).subscribe(
    (data)=>{console.log(data)},
    (err)=>{console.log(err);
    }
  )
}
YesClicked(){
  if(this.AllReturnItems.length){
    this.dialogRef.close(this.AllReturnItems);
    
  }
  
}
}
