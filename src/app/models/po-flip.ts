export class CommonClass {
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class BPCFLIPHeader extends CommonClass {
    ID: number;
    FLIPID: string;
    InvoiceNumber: number;
    InvoiceDate: Date;
    InvoiceCurrency: string;
    InvoiceType: string;
    InvoiceDocID: string;
    InvoiceAmount: number;
    IsInvoiceOrCertified: string;
    IsInvoiceFlag: string;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    DocNumber: string;
    InvoiceAttachmentName: string;
    BPCAttachment: any;
    bPCFLIPCosts: BPCFLIPCost[];
}
export class BPCFLIPCost extends CommonClass {
    FLIPID: string;
    Amount: string;
    Remarks: string;
    ExpenceType: string;
}

export class BPCFLIPHeaderView extends CommonClass {
    ID: number;
    FLIPID: string;
    InvoiceNumber: number;
    InvoiceDate: Date;
    InvoiceCurrency: string;
    InvoiceType: string;
    InvoiceDocID: string;
    InvoiceAmount: number;
    IsInvoiceOrCertified: string;
    IsInvoiceFlag: string;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    DocNumber: string;
    InvoiceAttachmentName: string;
    BPCAttachment: any;
    bPCFLIPCosts: BPCFLIPCost[];
}
