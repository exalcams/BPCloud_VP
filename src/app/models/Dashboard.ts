import { CommonClass } from './common';

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
    Proposeddeliverydate: string;
    OrderQty: number;
    GRQty: number;
    PipelineQty: number;
    OpenQty: number;
    UOM: string;
    PlantCode: string;
    UnitPrice: number | null;
    Value: number | null;
    TaxAmount: number | null;
    TaxCode: string;
    MaxAllowedQty: number;
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

export class SLDetails {
    Item: string;
    DocNumber: string;
    SlLine: string;
    DeliveryDate: Date;
    OrderedQty: number;
    AckStatus: string;
    AckDeliveryDate: Date;
}

export class DocumentDetails extends CommonClass {
    AttachmentID: number;
    AttachmentName: string;
    ReferenceNo: string;
    ContentType: string;
    ContentLength: number;
}

export class FlipDetails {
    DocNumber: string;
    FLIPID: string;
    InvoiceDate: Date;
    InvoiceAmount: number;
    InvoiceNumber: string;
    InvoiceType: string;
}

export class OrderFulfilmentDetails {
    PONumber: string;
    PODate: Date;
    Currency: string;
    Version: string;
    Status: string;
    ACKDate: Date;
    ItemCount: number;
    ASNCount: number;
    GRNCount: number;
    QACount: number;
    SLCount: number;
    DocumentCount: number;
    FlipCount: number;
    aSNDetails: ASNDetails[];
    itemDetails: ItemDetails[];
    gRNDetails: GRNDetails[];
    qADetails: QADetails[];
    slDetails: SLDetails[];
    documentDetails: DocumentDetails[];
    flipDetails: FlipDetails[];
    constructor() {
        // super();
        this.itemDetails = [];
    }
}
export class Acknowledgement {
    // DalivaryDate: string;
    ItemDetails: ItemDetails[];
    PONumber: string;
    // Status: string;
}
export class OfOption {
    Status: string;
    FromDate: string;
    ToDate: string;
    PartnerID: string;
    DocType: string;
}

export class POSearch {
    Status: string;
    FromDate: string;
    ToDate: string;
    PartnerID: string;
    DocType: string;
}
export class Status {
    Value: string;
    Name: string;
}
export class OfStatus {
    Value: string;
    Name: string;
}

export class OfType {
    Value: string;
    Name: string;
}

export class DashboardGraphStatus {
    oTIFStatus: OTIFStatus;
    qualityStatus: QualityStatus;
    fulfilmentStatus: FulfilmentStatus;
    deliverystatus: Deliverystatus;
}
export class OTIFStatus {
    OTIF: number;
}
export class QualityStatus {
    Quality: number;
}
export class FulfilmentStatus {
    OpenDetails: FulfilmentDetails;
    ScheduledDetails: FulfilmentDetails;
    InProgressDetails: FulfilmentDetails;
    PendingDetails: FulfilmentDetails;
}
export class FulfilmentDetails {
    Name: string;
    Value: string;
    label: string;
}
export class Deliverystatus {
    Planned1: DeliverystatusDetails;
    Planned2: DeliverystatusDetails;
    Planned3: DeliverystatusDetails;
    Planned4: DeliverystatusDetails;
    Planned5: DeliverystatusDetails;
}
export class DeliverystatusDetails {
    Planned: string;
    Actual: string;
    Date: Date;
}
// export class Deliverystatus {
//     Planned1:DeliverystatusDetails;
//     Planned2:DeliverystatusDetails;
//     Planned3:DeliverystatusDetails;
//     Planned4:DeliverystatusDetails;
//     Planned5:DeliverystatusDetails;
// }
// export class DeliverystatusDetails{
//     Planned:string;
//     Actual:string;
//     Date:Date;
// }

