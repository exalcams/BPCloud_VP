import { CommonClass } from './common';

export class BPCPayAccountStatement extends CommonClass {
    Client: string;
    Company: string;
    Type: string;
    PartnerID: string;
    FiscalYear: string;
    DocumentNumber: string;
    DocumentDate: Date | string | null;
    InvoiceNumber: string;
    InvoiceDate: Date | string | null;
    InvoiceAmount: number;
    PaidAmount: number;
    Reference: string;
    Status: string;
    AcceptedOn: Date | string | null;
    AcceptedBy: string;
}

export class BPCPayTDS extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    FYear: string;
    CompanyCode: string;
    DocumentID: string;
    PostingDate: Date | string | null;
    BaseAmount: number;
    TDSCategory: string;
    TDSAmount: number;
    Currency: string;
}

export class BPCPayPayable extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PartnerID: string;
    FYear: string;
    Invoice: string;
    // InvoiceBooking: string;
    InvoiceDate: Date | string | null;
    PostedOn: Date | string | null;
    DueDate: Date | string | null;
    AdvAmount: number;
    Amount: number;
    Currency: string;
    Balance: number;
}

export class BPCPayPayment extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    FYear: string;
    DocumentNumber: string;
    PaymentDate: Date | string | null;
    PaymentType: string;
    PaidAmount: number;
    BankName: string;
    BankAccount: string;
}
