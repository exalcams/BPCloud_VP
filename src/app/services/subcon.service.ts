import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { POScheduleLineView } from 'app/models/OrderFulFilment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubconService {

  baseAddress: string;

  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseAddress = _authService.baseAddress;
  }

  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error instanceof Object ? error.error.Message ? error.error.Message : error.error : error.error || error.message || 'Server Error');
  }

  GetPOSLByDocAndPartnerID(DocNumber: string, PartnerID: string): Observable<POScheduleLineView[] | string> {
    return this._httpClient.get<POScheduleLineView[]>
      (`${this.baseAddress}poapi/PO/GetPOSLByDocAndPartnerID?DocNumber=${DocNumber}&PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }
}
