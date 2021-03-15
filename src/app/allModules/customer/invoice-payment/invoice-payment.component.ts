import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import { BPCInvoicePayment, BPCPayRecord } from 'app/models/customer';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { POService } from 'app/services/po.service';
import { ReportService } from 'app/services/report.service';
import { PaymentDailogComponent } from '../payment-dailog/payment-dailog.component';
import { PaymentHistoryDialogComponent } from '../payment-history-dialog/payment-history-dialog.component';


@Component({
  selector: 'app-invoice-payment',
  templateUrl: './invoice-payment.component.html',
  styleUrls: ['./invoice-payment.component.scss']
})
export class InvoicePaymentComponent implements OnInit {
  InvoiceFormGroup: FormGroup;
  InvoiceItemFormGroup:FormGroup;

  // AllReturnItems:any[]=[];
  // AllProducts:any[]=[];
  IsProgressBarVisibile:boolean=false;
  notificationSnackBarComponent: NotificationSnackBarComponent;

  InvoiceFormdata:any[]=[];
  InvoicePaymentDataArray:BPCInvoicePayment[]=[]
  InvoiceDisplayedColumns: string[] = [
    'InvoiceNo',
    'Invoicedate',
    'PaidAmount',
    'AWBNumber',
    'PODStatus',
    'BalanceAmount',
    'Payment'
   
  ];
 
  InvoiceDataSource: MatTableDataSource<BPCInvoicePayment>;
  @ViewChild(MatPaginator) InvoicePaginator: MatPaginator;

  ispayment: boolean;
  InvoicePaymentRecordArray: BPCPayRecord[];
  PayDataSource: MatTableDataSource<BPCPayRecord>;
  constructor(
    private _formBuilder: FormBuilder,
    private poservice:POService,
    public snackBar: MatSnackBar,
   public dialog:MatDialog
  ) {
    this.ispayment=false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);

   }

  ngOnInit() {
    //this.InitializeReturnFormGroup();
    this.GetAllInvoices();
    this.GetAllRecords();
  }
 
  GetAllInvoices(){
    this.poservice.GetAllInvoices().subscribe(
      (data)=>{
        this.InvoicePaymentDataArray=data as BPCInvoicePayment[],
        this.InvoiceDataSource=new MatTableDataSource( this.InvoicePaymentDataArray);
        this.InvoiceDataSource.paginator=this.InvoicePaginator;
        console.log(this.InvoicePaymentDataArray)},
      (err)=>{console.log(err)}
    )
  }
  GetAllRecords(){
    this.poservice.GetAllPaymentRecord().subscribe(
      (data)=>{
        this.InvoicePaymentRecordArray=data as BPCPayRecord[],
        // this.PayDataSource=new MatTableDataSource( this.InvoicePaymentRecordArray);
        // this.PayDataSource.paginator=this.InvoicePaginator;
        console.log(this.InvoicePaymentRecordArray)},
      (err)=>{console.log(err)}
    )
  }
  openPaymentdialog(data){
var Invoicedata=new BPCInvoicePayment();
console.log(data);

Invoicedata=data as BPCInvoicePayment;
console.log(Invoicedata);
    const dialogRef = this.dialog.open(PaymentDailogComponent,{
      width: '400px',
      height:'200px',
      data:Invoicedata
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result!=null){
        var amount= result;
        Invoicedata.PaidAmount=Invoicedata.PaidAmount+parseInt(amount);
        console.log(Invoicedata.PaidAmount,Invoicedata);
        this.CreateInvoice(Invoicedata,amount);
       
      }
     
    });
  
  }
  CreateInvoice(Invoicedata:BPCInvoicePayment,amount){
    console.log(Invoicedata);
    
    this.poservice.UpdateInvoice(Invoicedata).subscribe(
    
      (data)=>{console.log(data)
        this.CreatePayRecord(Invoicedata,amount);
        this.notificationSnackBarComponent.openSnackBar('Succesfully created',SnackBarStatus.success);
      
      },
      (err)=>{
        console.log(err),
        this.notificationSnackBarComponent.openSnackBar('Failed to create',SnackBarStatus.danger);

      }
      
    )
  }
  CreatePayRecord(Invoicedata:BPCInvoicePayment,amount){
var PayRecord= new BPCPayRecord();
PayRecord.Client=Invoicedata.Client;
PayRecord.Company=Invoicedata.Company;
PayRecord.DocumentNumber=Invoicedata.PoReference;
PayRecord.InvoiceNumber=Invoicedata.InvoiceNo;
PayRecord.Type=Invoicedata.Type;
PayRecord.PartnerID=Invoicedata.PatnerID;
// PayRecord.PayRecordNo="002";
PayRecord.PaidAmount=amount;
PayRecord.PaymentDate=new Date();
this.poservice.CreatePaymentRecord(PayRecord).subscribe(
    
  (data)=>console.log(data),
  (err)=>console.log(err)
  
)
  }
  async openPaidAmount(data){

    var Invoicedata=new BPCInvoicePayment();
// console.log(data);

Invoicedata=data as BPCInvoicePayment;
// var PayRecord = new BPCPayRecord();
await this.GetAllRecords();
var paymemtdata= this.InvoicePaymentRecordArray.filter(x=>x.InvoiceNumber==Invoicedata.InvoiceNo);
console.log(paymemtdata);

    const dialogRef = this.dialog.open(PaymentHistoryDialogComponent,{
      width: '700px',
      // height:'300px',
      data:paymemtdata
    });
  
  }
 
}
