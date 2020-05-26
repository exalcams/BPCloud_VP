import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { Guid } from 'guid-typescript';
import { catchError } from 'rxjs/operators';
import { BPCInvoice, BPCPayment } from 'app/models/ReportModel';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseAddress: string;
  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService
  ) {
    this.baseAddress = _authService.baseAddress;
  }
  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || 'Server Error');
  }

  GetAllInvoices(): Observable<BPCInvoice[] | string> {
    return this._httpClient.get<BPCInvoice[]>(`${this.baseAddress}reportapi/InvoiceReport/GetAllInvoices`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllInvoicesByPartnerID(PartnerID: string): Observable<BPCInvoice[] | string> {
    return this._httpClient.get<BPCInvoice[]>(`${this.baseAddress}reportapi/InvoiceReport/GetAllInvoicesByPartnerID?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }
  GetFilteredInvoices(InvoiceNo: string, PoReference: string, FromDate: string, ToDate: string, Status: string): Observable<BPCInvoice[] | string> {
    return this._httpClient.get<BPCInvoice[]>
      (`${this.baseAddress}reportapi/InvoiceReport/GetFilteredInvoices?InvoiceNo=${InvoiceNo}&PoReference=${PoReference}&FromDate=${FromDate}&ToDate=${ToDate}&Status=${Status}`)
      .pipe(catchError(this.errorHandler));
  }
  GetFilteredInvoicesByPartnerID(PartnerID: string, InvoiceNo: string, PoReference: string, FromDate: string, ToDate: string, Status: string): Observable<BPCInvoice[] | string> {
    return this._httpClient.get<BPCInvoice[]>
      (`${this.baseAddress}reportapi/InvoiceReport/GetFilteredInvoicesByPartnerID?PartnerID=${PartnerID}&InvoiceNo=${InvoiceNo}&PoReference=${PoReference}&FromDate=${FromDate}&ToDate=${ToDate}&Status=${Status}`)
      .pipe(catchError(this.errorHandler));
  }


  GetAllPayments(): Observable<BPCPayment[] | string> {
    return this._httpClient.get<BPCPayment[]>(`${this.baseAddress}reportapi/PaymentReport/GetAllPayments`)
      .pipe(catchError(this.errorHandler));
  }
  GetFilteredPayments(FromDate: string, ToDate: string): Observable<BPCPayment[] | string> {
    return this._httpClient.get<BPCPayment[]>
      (`${this.baseAddress}reportapi/PaymentReport/GetFilteredPayments?FromDate=${FromDate}&ToDate=${ToDate}`)
      .pipe(catchError(this.errorHandler));
  }
}
