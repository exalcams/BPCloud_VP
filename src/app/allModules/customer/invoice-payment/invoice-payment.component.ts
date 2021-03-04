import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { BPCInvoicePayment } from 'app/models/customer';
import { POService } from 'app/services/po.service';
import { ReportService } from 'app/services/report.service';
export interface Invoice {
  Invoice: number;
  Date: Date;
  Amount: number;
  AWB: number;

}

@Component({
  selector: 'app-invoice-payment',
  templateUrl: './invoice-payment.component.html',
  styleUrls: ['./invoice-payment.component.scss']
})
export class InvoicePaymentComponent implements OnInit {
  InvoiceFormGroup: FormGroup;
  InvoiceItemFormGroup:FormGroup;
  AllReturnItems:any[]=[];
  AllProducts:any[]=[];
  IsProgressBarVisibile:boolean=false;
  InvoiceFormdata:any[]=[];
  InvoiceItemDisplayedColumns: string[] = [
    'Invoice',
    'Date',
    'PaidAmount',
    'AWB',
    'PODStatus',
    'Balance'
   
  ];
  InvoiceItemDataSource: MatTableDataSource<any>;
  InvoiceDisplayedColumns: string[] = [
    'Material',
    'Text',
    'Qty',
    'UOM'
  ];
  InvoiceDataSource: MatTableDataSource<any>;
  constructor(
    private _formBuilder: FormBuilder,
    private poservice:POService
  ) { }

  ngOnInit() {
    this.InitializeReturnFormGroup();
    this.GetAllInvoices();
  }
  InitializeReturnFormGroup(): void {
    this.InvoiceFormGroup = this._formBuilder.group({
      Invoice: ['', Validators.required],
      Date: [new Date(), Validators.required],
      Amount: ['', Validators.required],
      AWB: ['', Validators.required]
     
    });
    this.InvoiceItemFormGroup = this._formBuilder.group({
      Material: ['', Validators.required],
      Text: ['', Validators.required],
      Qty: [ Validators.required],
      UOM: ['', Validators.required],
  
    });
  }
  GetAllInvoices(){
    this.poservice.GetAllInvoices().subscribe(
      (data)=>{console.log(data)},
      (err)=>{console.log(err)}
    )
  }
  AddInvoiceDetails(){
    var Invoicedata:Invoice;
    Invoicedata.AWB=parseInt(this.InvoiceFormGroup.get('AWB').value());
    Invoicedata.Amount=parseInt(this.InvoiceFormGroup.get('Amount').value());
    Invoicedata.Date=this.InvoiceFormGroup.get('Date').value();
    Invoicedata.Invoice=parseInt(this.InvoiceFormGroup.get('Invoice').value());
    this.InvoiceFormdata.push(Invoicedata);
 console.log(this.InvoiceFormdata);
 
  }
  DeleteClicked(){

  }
  SaveClicked()
  {

  }
  SubmitClicked(){

  }
}
