import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
<<<<<<< HEAD
import { BPCFactContactPerson, BPCFactBank, BPCKRA, BPCAIACT, BPCFactView, BPCFact, BPCCertificate, BPCFactXLSX, BPCFactBankXLSX } from 'app/models/fact';
=======
import { BPCFactContactPerson, BPCFactBank, BPCKRA, BPCAIACT, BPCFactView, BPCFact, BPCFactBankXLSX, BPCFactXLSX } from 'app/models/fact';
>>>>>>> data-migration changes

@Injectable({
  providedIn: 'root'
})
export class FactService {

  baseAddress: string;

  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseAddress = _authService.baseAddress;
  }

  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error instanceof Object ? error.error.Message ? error.error.Message : error.error : error.error || error.message || 'Server Error');
  }

  // Facts
  GetAllFacts(): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}factapi/Fact/GetAllFacts`)
      .pipe(catchError(this.errorHandler));
  }

  GetFactByPartnerID(PartnerID: string): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}factapi/Fact/GetFactByPartnerID?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }
  GetFactByPartnerIDAndType(PartnerID: string, Type: string): Observable<any | string> {
    return this._httpClient.get<any>(`${this.baseAddress}factapi/Fact/GetFactByPartnerIDAndType?PartnerID=${PartnerID}&Type=${Type}`)
      .pipe(catchError(this.errorHandler));
  }
  GetFactByEmailID(EmailID: string): Observable<BPCFact | string> {
    return this._httpClient.get<BPCFact>(`${this.baseAddress}factapi/Fact/GetFactByEmailID?EmailID=${EmailID}`)
      .pipe(catchError(this.errorHandler));
  }

  CreateFact(Fact: BPCFactView): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}factapi/Fact/CreateFact`,
      Fact,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  UpdateFact(Fact: BPCFactView): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}factapi/Fact/UpdateFact`,
      Fact,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeleteFact(Fact: BPCFact): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}factapi/Fact/DeleteFact`,
      Fact,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetContactPersonsByPartnerID(PartnerID: string): Observable<BPCFactContactPerson[] | string> {
    return this._httpClient.get<BPCFactContactPerson[]>(`${this.baseAddress}factapi/Fact/GetContactPersonsByPartnerID?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }
  GetBanksByPartnerID(PartnerID: string): Observable<BPCFactBank[] | string> {
    return this._httpClient.get<BPCFactBank[]>(`${this.baseAddress}factapi/Fact/GetBanksByPartnerID?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetKRAsByPartnerID(PartnerID: string): Observable<BPCKRA[] | string> {
    return this._httpClient.get<BPCKRA[]>(`${this.baseAddress}factapi/Fact/GetKRAsByPartnerID?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAIACTsByPartnerID(PartnerID: string): Observable<BPCAIACT[] | string> {
    return this._httpClient.get<BPCAIACT[]>(`${this.baseAddress}factapi/Fact/GetAIACTsByPartnerID?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }
  GetCertificatesByPartnerID(PartnerID: string): Observable<BPCCertificate[] | string> {
    return this._httpClient.get<BPCCertificate[]>(`${this.baseAddress}factapi/Fact/GetCertificatesByPartnerID?PartnerID=${PartnerID}`)
      .pipe(catchError(this.errorHandler));
  }
  AcceptAIACT(AIACT: BPCAIACT): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}factapi/Fact/AcceptAIACT`,
      AIACT,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  RejectAIACT(AIACT: BPCAIACT): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}factapi/Fact/RejectAIACT`,
      AIACT,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }
  
  CreateFacts(Facts: BPCFactXLSX[]): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}factapi/Fact/CreateFacts`,
      Facts,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));
  }

  CreateFactBanks(Banks: BPCFactBankXLSX[]): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}factapi/Fact/CreateBanks`,
      Banks,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));
  }

}
