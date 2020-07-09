import { Guid } from 'guid-typescript';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import {
  PO, OrderFulfilmentDetails, Acknowledgement, OfOption, DashboardGraphStatus,
  FulfilmentStatus, ItemDetails, ASNDetails, GRNDetails, QADetails, SLDetails
} from 'app/models/Dashboard';
import { SODetails } from 'app/models/customer';
import { BPCKRA, CustomerBarChartData } from 'app/models/fact';
import { BPCOFHeader } from 'app/models/OrderFulFilment';
import { BPCInvoiceAttachment } from 'app/models/ASN';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseAddress: string;
  NotificationEvent: Subject<any>;

  GetNotification(): Observable<any> {
    return this.NotificationEvent.asObservable();
  }

  TriggerNotification(eventName: string): void {
    this.NotificationEvent.next(eventName);
  }

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService
  ) {
    this.baseAddress = _authService.baseAddress;
    this.NotificationEvent = new Subject();
  }

  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || 'Server Error');
  }

  // Order Fulfilment(OF)

  GetOfsByPartnerID(PartnerID: any): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}poapi/Dashboard/GetOfsByPartnerID?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetOfsByOption(ofOption: OfOption): Observable<BPCOFHeader[] | string> {
    return this._httpClient.post<BPCOFHeader[]>(`${this.baseAddress}poapi/Dashboard/GetOfsByOption`,
      ofOption,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetOfStatusByPartnerID(PartnerID: any): Observable<FulfilmentStatus | string> {
    return this._httpClient.get<FulfilmentStatus>(`${this.baseAddress}poapi/Dashboard/GetOfStatusByPartnerID?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetOfGraphDetailsByPartnerID(PartnerID: string): Observable<DashboardGraphStatus | string> {
    return this._httpClient
      .get<DashboardGraphStatus>(`${this.baseAddress}factapi/Fact/GetDashboardGraphStatus?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetOfAttachmentsByPartnerID(PartnerID: string): Observable<BPCInvoiceAttachment[] | string> {
    return this._httpClient
      .get<BPCInvoiceAttachment[]>(`${this.baseAddress}factapi/Fact/GetOfAttachmentsByPartnerID?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetOfItemsByPartnerIDAndDocNumber(PartnerID: any, DocNumber: any): Observable<ItemDetails[] | string> {
    return this._httpClient
      .get<ItemDetails[]>(`${this.baseAddress}poapi/Dashboard/GetOfItemsByPartnerIDAndDocNumber?PartnerID=${PartnerID}&DocNumber=${DocNumber}`)
      .pipe(catchError(this.errorHandler));
  }

  GetOfASNsByPartnerIDAndDocNumber(PartnerID: any, DocNumber: any): Observable<ASNDetails[] | string> {
    return this._httpClient
      .get<ASNDetails[]>(`${this.baseAddress}poapi/Dashboard/GetOfASNsByPartnerIDAndDocNumber?PartnerID=${PartnerID}&DocNumber=${DocNumber}`)
      .pipe(catchError(this.errorHandler));
  }

  GetOfGRGIsByPartnerIDAndDocNumber(PartnerID: any, DocNumber: any): Observable<GRNDetails[] | string> {
    return this._httpClient
      .get<GRNDetails[]>(`${this.baseAddress}poapi/Dashboard/GetOfGRGIsByPartnerIDAndDocNumber?PartnerID=${PartnerID}&DocNumber=${DocNumber}`)
      .pipe(catchError(this.errorHandler));
  }

  GetOfQMsByPartnerIDAndDocNumber(PartnerID: any, DocNumber: any): Observable<QADetails[] | string> {
    return this._httpClient
      .get<QADetails[]>(`${this.baseAddress}poapi/Dashboard/GetOfQMsByPartnerIDAndDocNumber?PartnerID=${PartnerID}&DocNumber=${DocNumber}`)
      .pipe(catchError(this.errorHandler));
  }

  GetOfSLsByPartnerIDAndDocNumber(PartnerID: any, DocNumber: any): Observable<SLDetails[] | string> {
    return this._httpClient
      .get<SLDetails[]>(`${this.baseAddress}poapi/Dashboard/GetOfSLsByPartnerIDAndDocNumber?PartnerID=${PartnerID}&DocNumber=${DocNumber}`)
      .pipe(catchError(this.errorHandler));
  }

  DownloadOfAttachment(AttachmentName: string, DocNumber: string): Observable<Blob | string> {
    return this._httpClient.get(`${this.baseAddress}poapi/Dashboard/DownloadOfAttachment?AttachmentName=${AttachmentName}&DocNumber=${DocNumber}`, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    })
      .pipe(catchError(this.errorHandler));
  }

  // Ramanji Methods(Vendor)

  GetPODetails(PatnerID: any): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}poapi/Dashboard/GetPODetails?PatnerID=${PatnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetOrderFulfilmentDetails(po: any, PatnerID: any): Observable<OrderFulfilmentDetails | string> {
    return this._httpClient
      .get<OrderFulfilmentDetails>(`${this.baseAddress}poapi/Dashboard/GetOrderFulfilmentDetails?PO=${po}&PatnerID=${PatnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  CreateAcknowledgement(ACK: Acknowledgement): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}poapi/Dashboard/CreateAcknowledgement`,
      ACK,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllPOBasedOnDate(poSearch: OfOption): Observable<PO[] | string> {
    return this._httpClient.post<PO[]>(`${this.baseAddress}poapi/Dashboard/GetAllPOBasedOnDate`,
      poSearch,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetDashboardGraphStatus(PartnerID: string): Observable<DashboardGraphStatus | string> {
    return this._httpClient
      .get<DashboardGraphStatus>(`${this.baseAddress}factapi/Fact/GetDashboardGraphStatus?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  // Customer

  GetSODetails(Type: string, PatnerID: string): Observable<SODetails[] | string> {
    return this._httpClient.get<SODetails[]>(`${this.baseAddress}poapi/Dashboard/GetSODetails?Type=${Type}&PartnerID=${PatnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllSOBasedOnDate(poSearch: OfOption): Observable<SODetails[] | string> {
    return this._httpClient.post<SODetails[]>(`${this.baseAddress}poapi/Dashboard/GetAllSOBasedOnDate`,
      poSearch,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetCustomerDoughnutChartData(PartnerID: string): Observable<BPCKRA[] | string> {
    return this._httpClient.get<BPCKRA[]>(`${this.baseAddress}factapi/Fact/GetCustomerDoughnutChartData?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetCustomerOpenProcessCircle(PartnerID: string): Observable<BPCKRA | string> {
    return this._httpClient.get<BPCKRA>(`${this.baseAddress}factapi/Fact/GetCustomerOpenProcessCircle?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetCustomerCreditLimitProcessCircle(PartnerID: string): Observable<BPCKRA | string> {
    return this._httpClient.get<BPCKRA>(`${this.baseAddress}factapi/Fact/GetCustomerCreditLimitProcessCircle?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetCustomerBarChartData(PartnerID: string): Observable<CustomerBarChartData | string> {
    return this._httpClient.get<CustomerBarChartData>(`${this.baseAddress}factapi/Fact/GetCustomerBarChartData?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }

}
