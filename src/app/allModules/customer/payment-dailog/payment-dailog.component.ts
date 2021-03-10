import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'app/notifications/notification-dialog/dialog-data';

@Component({
  selector: 'app-payment-dailog',
  templateUrl: './payment-dailog.component.html',
  styleUrls: ['./payment-dailog.component.scss']
})
export class PaymentDailogComponent implements OnInit {
  PaymentAmount:number;
  InvoiceFormGroup:FormGroup;
    invoiceAmount:number;
    constructor(public matDialogRef: MatDialogRef<PaymentDailogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,private _formBuilder: FormBuilder) { }
    

  ngOnInit() {
    this.InitializeReturnFormGroup();
this.invoiceAmount= this.data.InvoiceAmount;
console.log("invoice",this.invoiceAmount);

    //console.log( this.data.InvoiceAmount);
    
  }
  InitializeReturnFormGroup(): void {
    this.InvoiceFormGroup = this._formBuilder.group({
     
      // PaymentAmount: ['', Validators.required,this.AmountValid],
      PaymentAmount: ['',[Validators.required, (control: AbstractControl) => Validators.max(this.invoiceAmount)(control)]],
     
     
    });
   
  }
  AmountValid(control: FormControl){
    let amount=control.value;
    if (amount> this.invoiceAmount){
console.log(this.InvoiceFormGroup.get('PaymentAmount').value);
    return { 'AmountInvalid': true }; 
    }
    return null;
  }
  CloseClicked(): void {
    // console.log('Called');
    this.matDialogRef.close();
  }
  submit(){
    if(this.InvoiceFormGroup.valid)
    {
      console.log("valid")
    }
    else {
      console.log("invalid")
    }
  }
}
