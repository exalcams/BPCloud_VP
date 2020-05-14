import { Guid } from 'guid-typescript';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { BPCASNHeader, BPCASNView, BPCASNItem, DocumentCenter } from 'app/models/ASN';

@Injectable({
    providedIn: 'root'
})
export class ASNService {
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

    GetAllASNs(): Observable<BPCASNHeader[] | string> {
        return this._httpClient.get<BPCASNHeader[]>(`${this.baseAddress}poapi/ASN/GetAllASNs`)
            .pipe(catchError(this.errorHandler));
    }

    GetASNByPartnerID(PartnerID: string): Observable<BPCASNHeader | string> {
        return this._httpClient.get<BPCASNHeader>(`${this.baseAddress}poapi/ASN/GetASNByPartnerID?PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetASNsByDoc(DocNumber: string): Observable<BPCASNHeader[] | string> {
        return this._httpClient.get<BPCASNHeader[]>(`${this.baseAddress}poapi/ASN/GetASNsByDoc?DocNumber=${DocNumber}`)
            .pipe(catchError(this.errorHandler));
    }

    GetASNByASN(ASNNumber: string): Observable<BPCASNHeader | string> {
        return this._httpClient.get<BPCASNHeader>(`${this.baseAddress}poapi/ASN/GetASNByASN?ASNNumber=${ASNNumber}`)
            .pipe(catchError(this.errorHandler));
    }

    CreateASN(ASN: BPCASNView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}poapi/ASN/CreateASN`,
            ASN,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    UpdateASN(ASN: BPCASNView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}poapi/ASN/UpdateASN`,
            ASN,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    DeleteASN(ASN: BPCASNHeader): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}poapi/ASN/DeleteASN`,
            ASN,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    GetASNItemsByASN(ASNNumber: string): Observable<BPCASNItem[] | string> {
        return this._httpClient.get<BPCASNItem[]>(`${this.baseAddress}poapi/ASN/GetASNItemsByASN?ASNNumber=${ASNNumber}`)
            .pipe(catchError(this.errorHandler));
    }
    GetDocumentCentersByASN(ASNNumber: string): Observable<DocumentCenter[] | string> {
        return this._httpClient.get<DocumentCenter[]>(`${this.baseAddress}poapi/ASN/GetDocumentCentersByASN?ASNNumber=${ASNNumber}`)
            .pipe(catchError(this.errorHandler));
    }

    AddUserAttachment(ASNNumber: string, CreatedBy: string, selectedFiles: File[]): Observable<any> {
        const formData: FormData = new FormData();
        if (selectedFiles && selectedFiles.length) {
            selectedFiles.forEach(x => {
                formData.append(x.name, x, x.name);
            });
        }
        formData.append('ASNNumber', ASNNumber);
        formData.append('CreatedBy', CreatedBy.toString());

        return this._httpClient.post<any>(`${this.baseAddress}poapi/Attachment/AddUserAttachment`,
            formData,
            // {
            //   headers: new HttpHeaders({
            //     'Content-Type': 'application/json'
            //   })
            // }
        ).pipe(catchError(this.errorHandler));

    }

}
