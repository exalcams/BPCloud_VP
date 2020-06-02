import { Subject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { SupportHeader, SupportItem } from 'app/models/Support';

@Injectable({
    providedIn: 'root'
})
export class SupportdeskService {
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
    errorHandler(error: HttpErrorResponse): Observable<string> {
        return throwError(error.error || error.message || 'Server Error');
    }
    GetSupportMasters(PartnerID: any): Observable<any | string> {
        return this._httpClient.get<any>(`${this.baseAddress}supportapi/SupportDesk/GetSupportMasters?PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetSupportTickets(PartnerID: any): Observable<any | string> {
        return this._httpClient.get<any>(`${this.baseAddress}supportapi/SupportDesk/GetSupportTickets?PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetSupportItems(SupportID: any, PartnerID: any): Observable<any | string> {
        return this._httpClient.get<any>(`${this.baseAddress}supportapi/SupportDesk/GetSupportItems?SupportID=${SupportID}&PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetSupportChartDetails(SupportID: any, PartnerID: any): Observable<any | string> {
        return this._httpClient.get<any>(`${this.baseAddress}supportapi/SupportDesk/GetSupportChartDetails?SupportID=${SupportID}&PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }
    AddDocumentCenterAttachment(SupportID: string, CreatedBy: string, selectedFiles: File[]): Observable<any> {
        const formData: FormData = new FormData();
        if (selectedFiles && selectedFiles.length) {
            selectedFiles.forEach(x => {
                formData.append(x.name, x, x.name);
            });
        }
        formData.append('SupportID', SupportID);
        formData.append('CreatedBy', CreatedBy.toString());

        return this._httpClient.post<any>(`${this.baseAddress}supportapi/SupportDesk/AddDocumentCenterAttachment`,
            formData,
            // {
            //   headers: new HttpHeaders({
            //     'Content-Type': 'application/json'
            //   })
            // }
        ).pipe(catchError(this.errorHandler));
    }
    AddInvoiceAttachment(SupportID: string, CreatedBy: string, selectedFile: File): Observable<any> {
        const formData: FormData = new FormData();
        if (selectedFile) {
            formData.append(selectedFile.name, selectedFile, selectedFile.name);
        }
        formData.append('SupportID', SupportID);
        formData.append('CreatedBy', CreatedBy.toString());

        return this._httpClient.post<any>(`${this.baseAddress}supportapi/SupportDesk/AddInvoiceAttachment`,
            formData,
            // {
            //   headers: new HttpHeaders({
            //     'Content-Type': 'application/json'
            //   })
            // }
        ).pipe(catchError(this.errorHandler));

    }
    CreateSupportTicket(supportHeader: SupportHeader): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}supportapi/SupportDesk/CreateSupportTicket`,
        supportHeader,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    DowloandInvoiceAttachment(AttachmentName: string, SupportID: string): Observable<Blob | string> {
        return this._httpClient.get(`${this.baseAddress}supportapi/SupportDesk/DowloandInvoiceAttachment?AttachmentName=${AttachmentName}&ASNNumber=${SupportID}`, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        })
            .pipe(catchError(this.errorHandler));
    }
    DowloandDocumentCenterAttachment(AttachmentName: string, SupportID: string): Observable<Blob | string> {
        return this._httpClient.get(`${this.baseAddress}supportapi/SupportDesk/DowloandDocumentCenterAttachment?AttachmentName=${AttachmentName}&ASNNumber=${SupportID}`, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        })
            .pipe(catchError(this.errorHandler));
    }
    CreateSupportTicketResponse(supportTicketResponse: SupportItem): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}supportapi/SupportDesk/CreateSupportItem`,
          supportTicketResponse,
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            })
          })
          .pipe(catchError(this.errorHandler));
      }
}