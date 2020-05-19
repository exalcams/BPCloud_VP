export interface CommonClass {
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}

export interface BPCInvoice extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    FiscalYear: string;
    InvoiceNo: string;
    InvoiceDate?: Date;
    InvoiceAmount: number;
    PoReference: string;
    PaidAmount: number;
    Currency: string;
    DateofPayment?: Date;
    Status: string;
    AttID: string;
    PODDate?: Date;
    PODConfirmedBy: string;
}
