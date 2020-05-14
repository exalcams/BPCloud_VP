export class CommonClass {
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class BPCFLIPHeader extends CommonClass {
    FLIPID: string;
    Client: string;
    Company: string;
    InvoiceNumber: number;
    InvoiceDate: Date;
    InvoiceCurrency: string;
    InvoiceType: string;
    InvoiceDocID: string;
    InvoiceAmount: number;
    IsInvoiceOrCertified: string;
    Status: string;
    DocID: string;
    InvoiceAttachmentName: string;
    BPAttachment: any;
}
export class BPCFLIPCost extends CommonClass {
    FLIPID: string;
    Amount: string;
    Remarks: string;
    ExpenceType: string;
}

export class BPCFLIPHeaderView extends CommonClass {
    FLIPID: string;
    Client: string;
    Company: string;
    InvoiceNumber: number;
    InvoiceDate: Date;
    InvoiceCurrency: string;
    InvoiceType: string;
    InvoiceDocID: string;
    InvoiceAmount: number;
    IsInvoiceOrCertified: string;
    Status: string;
    DocID: string;
    InvoiceAttachmentName: string;
    BPAttachment: any;
    bPCFLIPCosts: BPCFLIPCost[];
}
