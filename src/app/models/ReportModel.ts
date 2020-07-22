import { CommonClass } from './common';

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

export class BPCInvoiceItem extends CommonClass {
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

export class BPCInvoiceXLSX {
    Company: string;
    Patnerid: string;
    Fiscalyear: string;
    Invno: string;
    Paidamt: number;
    Currency: string;
    Dateofpayment: string;
    Poddate: string;
}
export class BPCPaymentXLSX {
    Company: string;
    Type: string;
    Patnerid: string;
    Fiscalyear: string;
    Paydoc: string;
    Date: string;
    Amount: number;
    Currency: string;
}
export class BPCReportPPMHeader extends CommonClass {
    Id: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    Period: Date | string | null;
    Material: string;
    MaterialText: string;
    ReceiptQty: number;
    RejectedQty: number;
    PPM: number;
}
export class BPCReportPPMItem extends CommonClass {
    Id: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    Period: Date | string | null;
    Material: string;
    MaterialText: string;
    ReceiptQty: number;
    RejectedQty: number;
    PPM: number;
}
export class BPCReportOV extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    Material: string;
    MaterialText: string;
    InputQty: number;
    AccpetQty: number;
    RejQty: number;
    RejPercentage: number;
    Status: string;
}
export class PPMReportOption extends CommonClass {
    PartnerID: string;
    Material: string;
    PO: string;
    Status: string;
    FromDate: Date | string | null;
    ToDate: Date | string | null;
}
export class OverviewReportOption extends CommonClass {
    PartnerID: string;
    Material: string;
    PO: string;
    Status: string;
    FromDate: Date | string | null;
    ToDate: Date | string | null;
}
export class BPCReportVR extends CommonClass {
    Material: string;
    MaterialText: string;
    OrderQty: number;
    ReceivedQty: number;
    RejectedPPM: number;
    ReworkQty: number;
}
export class BPCReportDOL extends CommonClass {
    Material: string;
    MaterialText: string;
    OrderQty: number;
    ReceivedQty: number;
    RejectedPPM: number;
    ReworkQty: number;
}
export class BPCReportFGCPS extends CommonClass {
    Plant: string ;
    Material: string ;
    MaterialText: string ;
    StickQty: any ;
    UOM: string ;
    Batch: string ;
    Price: any;
}
export class BPCReportIP extends CommonClass {
    Material: string;
    MaterialText: string;
    OrderQty: number;
    ReceivedQty: number;
    RejectedPPM: number;
    ReworkQty: number;
}
export class BPCReportGRR extends CommonClass {
    Material: string;
    MaterialText: string;
    OrderQty: number;
    ReceivedQty: number;
    RejectedPPM: number;
    ReworkQty: number;
}





