export class PO {
    PO: number;
    Version: string;
    PODate: Date;
    Currency: string;
    Status: string;
    Document: string;
    NextProcess: string;
}
export class ItemDetails {
    Item: string;
    MaterialText: string;
    DalivaryDate: Date;
    OrderQty: number;
    GRQty: number;
    PipelineQty: number;
    OpenQty: number;
    UOM: string;
}
export class ASNDetails {
    ASN: string;
    Date: Date;
    Truck: string;
    Status: string;
}
export class GRNDetails {
    Item: string;
    MaterialText: string;
    GRNDate: Date;
    Qty: number;
    Status: string;
}
export class QADetails {
    Item: string;
    MaterialText: string;
    Date: Date;
    LotQty: number;
    RejQty: number;
    RejReason: string;
}
export class OrderFulfilmentDetails {
    PONumber: string;
    PODate: Date;
    Currency: string;
    Version: string;
    Status: string;
    ACKDate:Date;
    ItemCount:number;
    ASNCount:number;
    GRNCount:number;
    QACount:number;
    DocumentCount:number;
    FlipCount:number;
    aSNDetails: ASNDetails[];
    itemDetails: ItemDetails[];
    gRNDetails: GRNDetails[];
    qADetails: QADetails[];
}
export class Acknowledgement {
    DalivaryDate: string;
    PONumber: string;
    Status: string;
}