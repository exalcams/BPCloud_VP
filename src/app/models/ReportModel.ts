export class CommonClass {
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn: Date | string | null;
    ModifiedBy: string;
}

export class BPCInvoice extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    FiscalYear: string;
    InvoiceNo: string;
    InvoiceDate: Date | string | null;
    InvoiceAmount: number;
    PoReference: string;
    PaidAmount: number;
    Currency: string;
    DateofPayment: Date | string | null;
    Status: string;
    AttID: string;
    PODDate: Date | string | null;
    PODConfirmedBy: string;
}
export class BPCInvoiceItem extends CommonClass
{
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    FiscalYear: string;
    InvoiceNo: string;
    Item: string;
    Material: string;
    MaterialText: string;
    InvoiceQty: number;
    PODQty: number;
    ReasonCode: string;
    Status: string;
}

export class BPCPayment extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    FiscalYear: string;
    PaymentDoc: string;
    Date: Date | string | null;
    Amount: number;
    Currency: string;
    Remark: string;
    Attachment: string;
}
