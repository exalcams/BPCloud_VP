import { CommonClass } from './common';

export class BalanceConfirmationHeader extends CommonClass {
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    Period: Date | string | null;
    BalAmount: number | null;
    BalCurrency: string;
    BalDate: Date | string | null;
    Status: string;
    AcceptedOn: Date | string | null;
    AcceptedBy: string;
}

export class BalanceConfirmationItem extends CommonClass {
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    Period: Date | string | null;
    DocNumber: string;
    DocDate: Date | string | null;
    InvoiceNumber: string;
    InvoiceAmount: number | null;
    PaidAmount: number | null;
    BalanceAmount: number | null;
}
export class ConfirmationDetails {
    ConfirmedBy: string;
}
