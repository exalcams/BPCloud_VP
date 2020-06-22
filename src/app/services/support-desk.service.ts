import { Subject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { SupportHeader, SupportLog, SupportHeaderView } from 'app/models/support-desk';
import { UserWithRole } from 'app/models/master';

@Injectable({
    providedIn: 'root'
})
export class SupportDeskService {
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

    // Support Masters
    
    GetSupportMasters(PartnerID: any): Observable<any | string> {
        return this._httpClient.get<any>(`${this.baseAddress}supportapi/SupportDesk/GetSupportMasters?PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetSupportDetails(SupportID: any, PartnerID: any): Observable<any | string> {
        return this._httpClient.get<any>(`${this.baseAddress}supportapi/SupportDesk/GetSupportDetails?SupportID=${SupportID}&PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }

    // Support Tickets

    GetSupportTickets(PartnerID: any): Observable<any | string> {
        return this._httpClient.get<any>(`${this.baseAddress}supportapi/SupportDesk/GetSupportTickets?PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }

    CreateSupportTicket(supportHeader: SupportHeaderView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}supportapi/SupportDesk/CreateSupportTicket`,
            supportHeader,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    // Support Logs

    GetSupportLogs(SupportID: any, PartnerID: any): Observable<any | string> {
        return this._httpClient.get<any>(`${this.baseAddress}supportapi/SupportDesk/GetSupportLogs?SupportID=${SupportID}&PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }

    CreateSupportLog(supportLog: SupportLog): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}supportapi/SupportDesk/CreateSupportLog`,
            supportLog,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    UpdateSupportLog(supportLog: SupportLog): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}supportapi/SupportDesk/UpdateSupportLog`,
            supportLog,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    // Support Attachments

    AddSupportAttachment(SupportID: string, CreatedBy: string, selectedFiles: File[]): Observable<any> {
        const formData: FormData = new FormData();
        if (selectedFiles && selectedFiles.length) {
            selectedFiles.forEach(x => {
                formData.append(x.name, x, x.name);
            });
        }
        formData.append('SupportID', SupportID);
        formData.append('CreatedBy', CreatedBy.toString());

        return this._httpClient.post<any>(`${this.baseAddress}supportapi/SupportDesk/AddSupportAttachment`,
            formData,
            // {
            //   headers: new HttpHeaders({
            //     'Content-Type': 'application/json'
            //   })
            // }
        ).pipe(catchError(this.errorHandler));
    }

    AddSupportLogAttachment(SupportID: string, CreatedBy: string, selectedFiles: File[]): Observable<any> {
        const formData: FormData = new FormData();
        if (selectedFiles && selectedFiles.length) {
            selectedFiles.forEach(x => {
                formData.append(x.name, x, x.name);
            });
        }
        formData.append('SupportID', SupportID);
        formData.append('CreatedBy', CreatedBy.toString());

        return this._httpClient.post<any>(`${this.baseAddress}supportapi/SupportDesk/AddSupportAttachment`,
            formData,
            // {
            //   headers: new HttpHeaders({
            //     'Content-Type': 'application/json'
            //   })
            // }
        ).pipe(catchError(this.errorHandler));
    }

    DownloadSupportAttachment(AttachmentName: string, SupportID: string): Observable<Blob | string> {
        return this._httpClient.get(`${this.baseAddress}supportapi/SupportDesk/DownloadSupportAttachment?AttachmentName=${AttachmentName}&SupportID=${SupportID}`, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        })
            .pipe(catchError(this.errorHandler));
    }

}
