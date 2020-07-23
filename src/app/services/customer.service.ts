import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { Guid } from 'guid-typescript';
import { catchError } from 'rxjs/operators';
import { BPCPIView, BPCPIHeader, BPCProd, BPCPIItem } from 'app/models/customer';

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
        return throwError(error.error instanceof Object ? error.error.Message ? error.error.Message : error.error : error.error || error.message || 'Server Error');
    }

    CreatePurchaseIndent(PurchaseIndent: BPCPIView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}poapi/PurchaseIndent/CreatePurchaseIndent`,
            PurchaseIndent,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    UpdatePurchaseIndent(PurchaseIndent: BPCPIView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}poapi/PurchaseIndent/UpdatePurchaseIndent`,
            PurchaseIndent,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    DeletePurchaseIndent(PurchaseIndent: BPCPIHeader): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}poapi/PurchaseIndent/DeletePurchaseIndent`,
            PurchaseIndent,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    GetAllPurchaseIndents(): Observable<BPCPIHeader[] | string> {
        return this._httpClient.get<BPCPIHeader[]>(`${this.baseAddress}poapi/PurchaseIndent/GetAllPurchaseIndents`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllPurchaseIndentsByPartnerID(PartnerID: string): Observable<BPCPIHeader[] | string> {
        return this._httpClient.get<BPCPIHeader[]>(`${this.baseAddress}poapi/PurchaseIndent/GetAllPurchaseIndentsByPartnerID?PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetPurchaseIndentByPIAndPartnerID(PINumber: string, PartnerID: string): Observable<BPCPIHeader | string> {
        return this._httpClient.get<BPCPIHeader>(`${this.baseAddress}poapi/PurchaseIndent/GetPurchaseIndentByPIAndPartnerID?PINumber=${PINumber}&PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetPurchaseIndentItemsByPI(PINumber: string): Observable<BPCPIItem[] | string> {
        return this._httpClient.get<BPCPIItem[]>(`${this.baseAddress}poapi/PurchaseIndent/GetPurchaseIndentItemsByPI?PINumber=${PINumber}`)
            .pipe(catchError(this.errorHandler));
    }

    // Return

    CreateReturn(Return: BPCPIView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}poapi/Return/CreateReturn`,
            Return,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    UpdateReturn(Return: BPCPIView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}poapi/Return/UpdateReturn`,
            Return,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    DeleteReturn(Return: BPCPIHeader): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}poapi/Return/DeleteReturn`,
            Return,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    AddReturnItemAttachment(RetReqID: string, CreatedBy: string, selectedFiles: File[]): Observable<any> {
        const formData: FormData = new FormData();
        if (selectedFiles && selectedFiles.length) {
            selectedFiles.forEach(x => {
                formData.append(x.name, x, x.name);
            });
        }
        formData.append('RetReqID', RetReqID);
        formData.append('CreatedBy', CreatedBy.toString());

        return this._httpClient.post<any>(`${this.baseAddress}poapi/Return/AddReturnItemAttachment`,
            formData,
            // {
            //   headers: new HttpHeaders({
            //     'Content-Type': 'application/json'
            //   })
            // }
        ).pipe(catchError(this.errorHandler));
    }
    DowloandReturnItemAttachment(AttachmentName: string, RetReqID: string): Observable<Blob | string> {
        return this._httpClient.get(`${this.baseAddress}poapi/Return/DowloandReturnItemAttachment?AttachmentName=${AttachmentName}&RetReqID=${RetReqID}`, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        })
            .pipe(catchError(this.errorHandler));
    }
    GetAllReturns(): Observable<BPCPIHeader[] | string> {
        return this._httpClient.get<BPCPIHeader[]>(`${this.baseAddress}poapi/Return/GetAllReturns`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllReturnsByPartnerID(PartnerID: string): Observable<BPCPIHeader[] | string> {
        return this._httpClient.get<BPCPIHeader[]>(`${this.baseAddress}poapi/Return/GetAllReturnsByPartnerID?PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetReturnByRetAndPartnerID(RetReqID: string, PartnerID: string): Observable<BPCPIHeader | string> {
        return this._httpClient.get<BPCPIHeader>(`${this.baseAddress}poapi/Return/GetReturnByRetAndPartnerID?RetReqID=${RetReqID}&PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetReturnItemsByRet(RetReqID: string): Observable<BPCPIItem[] | string> {
        return this._httpClient.get<BPCPIItem[]>(`${this.baseAddress}poapi/Return/GetReturnItemsByRet?RetReqID=${RetReqID}`)
            .pipe(catchError(this.errorHandler));
    }
    // Products
    GetAllProducts(): Observable<BPCProd[] | string> {
        return this._httpClient.get<BPCProd[]>(`${this.baseAddress}poapi/Product/GetAllProducts`)
            .pipe(catchError(this.errorHandler));
    }

}
