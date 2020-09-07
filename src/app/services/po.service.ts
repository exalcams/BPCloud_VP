import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BPCOFHeader, BPCOFItem, BPCOFHeaderXLSX, BPCOFItemXLSX, BPCOFScheduleLineXLSX, BPCOFGRGIXLSX, BPCOFQMXLSX, BPCOFGRGI, SOItemCount } from 'app/models/OrderFulFilment';
import { BPCCEOMessage, BPCSCOCMessage } from 'app/models/Message.model';

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
  GetAllPOList(): Observable<BPCOFHeader[] | string> {
    return this._httpClient.get<BPCOFHeader[]>(`${this.baseAddress}poapi/PO/GetAllPOList`)
      .pipe(catchError(this.errorHandler));
  }
  FilterPOList(VendorCode: string, PONumber: string, Status: string, FromDate: string, ToDate: string): Observable<BPCOFHeader[] | string> {
    return this._httpClient.get<BPCOFHeader[]>(`${this.baseAddress}poapi/PO/FilterPOList?VendorCode=${VendorCode}&PONumber=${PONumber}&Status=${Status}&FromDate=${FromDate}&ToDate=${ToDate}`)
      .pipe(catchError(this.errorHandler));
  }
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
  GetPOGRGIByDocAndPartnerID(DocNumber: string, PartnerID: string): Observable<BPCOFGRGI[] | string> {
    return this._httpClient.get<BPCOFGRGI[]>(`${this.baseAddress}poapi/PO/GetPOGRGIByDocAndPartnerID?DocNumber=${DocNumber}&PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetSOItemCountByDocAndPartnerID(DocNumber: string, PartnerID: string): Observable<SOItemCount | string> {
    return this._httpClient.get<SOItemCount>(`${this.baseAddress}poapi/PO/GetSOItemCountByDocAndPartnerID?DocNumber=${DocNumber}&PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  // Data Migration

  CreateOFHeaders(OFHeaders: BPCOFHeaderXLSX[]): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}poapi/PO/CreateOFHeaders`,
      OFHeaders,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));
  }

  CreateOFItems(OFItems: BPCOFItemXLSX[]): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}poapi/PO/CreateOFItems`,
      OFItems,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));
  }

  CreateOFScheduleLines(OFScheduleLines: BPCOFScheduleLineXLSX[]): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}poapi/PO/CreateOFScheduleLines`,
      OFScheduleLines,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));
  }

  CreateOFGRGIs(OFGRGIs: BPCOFGRGIXLSX[]): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}poapi/PO/CreateOFGRGIs`,
      OFGRGIs,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));
  }

  CreateOFQMs(OFQMs: BPCOFQMXLSX[]): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}poapi/PO/CreateOFQMs`,
      OFQMs,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));
  }

  // CEOMessage
  CreateCEOMessage(CEOMessage: BPCCEOMessage): Observable<any> {
    return this._httpClient
      .post<any>(
        `${this.baseAddress}poapi/Message/CreateCEOMessage`,
        CEOMessage,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
        }
      )
      .pipe(catchError(this.errorHandler));
  }

  GetCEOMessage(): Observable<BPCCEOMessage | string> {
    return this._httpClient
      .get<BPCCEOMessage>(
        `${this.baseAddress}poapi/Message/GetCEOMessage`
      )
      .pipe(catchError(this.errorHandler));
  }

  UpdateCEOMessage(CEOMessage: BPCCEOMessage): Observable<any> {
    return this._httpClient
      .post<any>(
        `${this.baseAddress}poapi/Message/UpdateCEOMessage`,
        CEOMessage,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
        }
      )
      .pipe(catchError(this.errorHandler));
  }

  DeleteCEOMessage(CEOMessage: BPCCEOMessage): Observable<any> {
    return this._httpClient
      .post<any>(
        `${this.baseAddress}poapi/Message/DeleteCEOMessage`,
        CEOMessage,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
        }
      )
      .pipe(catchError(this.errorHandler));
  }

  // SCOCMessage
  CreateSCOCMessage(SCOCMessage: BPCSCOCMessage): Observable<any> {
    return this._httpClient
      .post<any>(
        `${this.baseAddress}poapi/Message/CreateSCOCMessage`,
        SCOCMessage,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
        }
      )
      .pipe(catchError(this.errorHandler));
  }

  GetSCOCMessage(): Observable<BPCSCOCMessage | string> {
    return this._httpClient
      .get<BPCSCOCMessage>(
        `${this.baseAddress}poapi/Message/GetSCOCMessage`
      )
      .pipe(catchError(this.errorHandler));
  }

  UpdateSCOCMessage(SCOCMessage: BPCSCOCMessage): Observable<any> {
    return this._httpClient
      .post<any>(
        `${this.baseAddress}poapi/Message/UpdateSCOCMessage`,
        SCOCMessage,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
        }
      )
      .pipe(catchError(this.errorHandler));
  }

  DeleteSCOCMessage(SCOCMessage: BPCSCOCMessage): Observable<any> {
    return this._httpClient
      .post<any>(
        `${this.baseAddress}poapi/Message/DeleteSCOCMessage`,
        SCOCMessage,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
        }
      )
      .pipe(catchError(this.errorHandler));
  }

}
