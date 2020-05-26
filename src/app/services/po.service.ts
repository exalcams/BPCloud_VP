import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BPCOFHeader, BPCOFItem } from 'app/models/OrderFulFilment';

@Injectable({
  providedIn: 'root'
})
export class POService {

  baseAddress: string;

  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseAddress = _authService.baseAddress;
  }

  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || 'Server Error');
  }

  // POs

  GetPOByDoc(DocNumber: string): Observable<BPCOFHeader | string> {
    return this._httpClient.get<any>(`${this.baseAddress}poapi/PO/GetPOByDoc?DocNumber=${DocNumber}`)
      .pipe(catchError(this.errorHandler));
  }
  GetPOByDocAndPartnerID(DocNumber: string, PartnerID: string): Observable<BPCOFHeader | string> {
    return this._httpClient.get<any>(`${this.baseAddress}poapi/PO/GetPOByDocAndPartnerID?DocNumber=${DocNumber}&PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetPOItemsByDoc(DocNumber: string): Observable<BPCOFItem[] | string> {
    return this._httpClient.get<BPCOFItem[]>(`${this.baseAddress}poapi/PO/GetPOItemsByDoc?DocNumber=${DocNumber}`)
      .pipe(catchError(this.errorHandler));
  }
  GetPOItemsByDocAndPartnerID(DocNumber: string, PartnerID: string): Observable<BPCOFItem[] | string> {
    return this._httpClient.get<BPCOFItem[]>(`${this.baseAddress}poapi/PO/GetPOItemsByDocAndPartnerID?DocNumber=${DocNumber}&PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }
}
