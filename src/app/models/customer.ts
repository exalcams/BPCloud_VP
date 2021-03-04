import { CommonClass } from './common';
export class BPCPIHeader extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    PIRNumber: string;
    PIRType: string;
    DocumentNumber: string;
    Text: string;
    Date: Date | string | null;
    ReferenceDoc: string;
    Currency: string;
    Status: string;
    GrossAmount: number | null;
    NetAmount: number | null;
    UOM: string;
    Material:string;
    Description:string;
    Qty:number;
    Reason:string;
    DeliveryNote:string;
}

export class BPCPIItem extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    PIRNumber: string;
    DocumentNumber: string;
    Item: string;
    ProdcutID: string;
    MaterialText: string;
    DeliveryDate: Date | string | null;
    OrderQty: number;
    UOM: string;
    HSN: string;
    RetQty: number;
    ReasonText: string;
    FileName: string;
    AttachmentReferenceNo: string;
}

export class BPCPIView extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    PIRNumber: string;
    PIRType: string;
    DocumentNumber: string;
    Text: string;
    Date: Date | string | null;
    ReferenceDoc: string;
    Currency: string;
    Status: string;
    GrossAmount: number | null;
    NetAmount: number | null;
    UOM: string;
    Items: BPCPIItem[];
}

// export class BPCRetHeader extends CommonClass {
//     ID: number;
//     Client: string;
//     Company: string;
//     Type: string;
//     PatnerID: string;
//     RetReqID: string;
//     Text: string;
//     Date: Date | string | null;
//     InvoiceDoc: string;
//     Status: string;
// }

// export class BPCRetItem extends CommonClass {
//     ID: number;
//     Client: string;
//     Company: string;
//     Type: string;
//     PatnerID: string;
//     RetReqID: string;
//     Item: string;
//     ProdcutID: string;
//     MaterialText: string;
//     OrderQty: number;
//     RetQty: number;
//     ReasonText: string;
//     FileName: string;
// }

// export class BPCRetView extends CommonClass {
//     ID: number;
//     Client: string;
//     Company: string;
//     Type: string;
//     PatnerID: string;
//     RetReqID: string;
//     Text: string;
//     Date: Date | string | null;
//     InvoiceDoc: string;
//     Status: string;
//     Items: BPCRetItem[];
// }

export class BPCProd extends CommonClass {
    // ID: number;
    Client: string;
    Company: string;
    Type: string;
    ProductID: string;
    Text: string;
    AttID: string;
    UOM: string;
    Stock: string;
    StockUpdatedOn: Date | string | null;
    MaterialGroup:string;
    Material:string;
    MaterialText:string;
    BasePrice:string;

}
export class BPCProdFav extends CommonClass {
    // ID: number;
    Client: string;
    Company: string;
    Type: string;
    ProductID: string;
    PatnerID:string;
    Material:string;
    Rating:number;

}
export class SODetails {
    ID: number;
    PatnerID: string;
    SO: string;
    PIRNumber: string;
    PIRType: string;
    SODate: Date | string | null;
    Status: string;
    Document: string;
    Version: string;
    Currency: string;
    DocCount: number;
}

export class BPCInvoicePayment extends CommonClass {
    // ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID:string;
    FiscalYear:string;
    InvoiceNo:string;
    Invoicedate:Date;
    InvoiceAmount:number;
    PoReference:string;
    PaidAmount:number;
    Currency:string;
    DateofPayment:Date;
    Status:string;
    AttID:string;
    PODDate:Date;
    PODConfirmedBy:string;
    
}