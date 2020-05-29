import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { Guid } from 'guid-typescript';
import { catchError } from 'rxjs/operators';
import { BPCPIView, BPCPIHeader, BPCRetView, BPCRetHeader, BPCProd } from 'app/models/customer';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
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

    CreatePurchaseIndent(PurchaseIndent: BPCPIView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}customerapi/PurchaseIndent/CreatePurchaseIndent`,
            PurchaseIndent,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    UpdatePurchaseIndent(PurchaseIndent: BPCPIView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}customerapi/PurchaseIndent/UpdatePurchaseIndent`,
            PurchaseIndent,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    DeletePurchaseIndent(PurchaseIndent: BPCPIHeader): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}customerapi/PurchaseIndent/DeletePurchaseIndent`,
            PurchaseIndent,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    GetAllPurchaseIndents(): Observable<BPCPIHeader[] | string> {
        return this._httpClient.get<BPCPIHeader[]>(`${this.baseAddress}customerapi/PurchaseIndent/GetAllPurchaseIndents`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllPurchaseIndentsByPartnerID(PartnerID: string): Observable<BPCPIHeader[] | string> {
        return this._httpClient.get<BPCPIHeader[]>(`${this.baseAddress}customerapi/PurchaseIndent/GetAllPurchaseIndentsByPartnerID?PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }

    // Return

    CreateReturn(Return: BPCRetView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}customerapi/Return/CreateReturn`,
            Return,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    UpdateReturn(Return: BPCRetView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}customerapi/Return/UpdateReturn`,
            Return,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    DeleteReturn(Return: BPCRetHeader): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}customerapi/Return/DeleteReturn`,
            Return,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    GetAllReturns(): Observable<BPCRetHeader[] | string> {
        return this._httpClient.get<BPCRetHeader[]>(`${this.baseAddress}customerapi/Return/GetAllReturns`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllReturnsByPartnerID(PartnerID: string): Observable<BPCRetHeader[] | string> {
        return this._httpClient.get<BPCRetHeader[]>(`${this.baseAddress}customerapi/Return/GetAllReturnsByPartnerID?PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllProducts(): Observable<BPCProd[] | string> {
        return this._httpClient.get<BPCProd[]>(`${this.baseAddress}customerapi/Product/GetAllProducts`)
            .pipe(catchError(this.errorHandler));
    }
}
