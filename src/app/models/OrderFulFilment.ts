export class CommonClass {
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class BPCOFHeader extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    DocNumber: string;
    DocDate?: Date;
    DocVersion: string;
    Currency: string;
    Status: string;
    CrossAmount: number;
    NetAmount: number;
    RefDoc: string;
    AckStatus: string;
    AckRemark: string;
    AckDate?: Date;
    AckUser: string;
    PINNumber: string;
}

export class BPCOFItem extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    DocNumber: string;
    Item: string;
    Material: string;
    MaterialText: string;
    ManufactureDate?: Date;
    DeliveryDate?: Date;
    OrderedQty: number;
    CompletedQty: number;
    TransitQty: number;
    OpenQty: number;
    UOM: string;
    HSN: string;
    IsClosed: boolean;
    AckStatus: string;
    AckDelDate?: Date;
    Price: number;
    Tax: number;
    Amount: number;
}

export class BPCOFScheduleLine extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    DocNumber: string;
    Item: string;
    SlLine: string;
    DelDate?: Date;
    OrderedQty: number;
    AckStatus: string;
    AckDelDate?: Date;
}

export class BPCOFGRGI extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    DocNumber: string;
    GRGIDoc: string;
    Item: string;
    Material: string;
    MaterialText: string;
    DelDate?: Date;
    GRGIQty: number;
    ShippingPartner: string;
    ShippingDoc: string;
}
export class BPCOFQM extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    DocNumber: string;
    Item: string;
    Material: string;
    MaterialText: string;
    GRGIQty: number;
    LotQty: number;
    RejQty: number;
    RejReason: string;
}

export class PODetails {
    PO: string;
    Version: string;
    Currency: string;
    PODate?: Date;
    Status: string;
    Document: string;

}

export class ASNDetails {
    ASN: string;
    Date?: Date;
    Truck: string;
    Status: string;
}

export class ItemDetails {
    Item: string;
    MaterialText: string;
    DalivaryDate?: Date;
    OrderQty: number;
    GRQty: number;
    PipelineQty: number;
    OpenQty: number;
    UOM: string;
}

export class GRNDetails {
    Item: string;
    MaterialText: string;
    GRNDate?: Date;
    Qty: number;
    Status: string;
}

export class QADetails {
    Item: string;
    MaterialText: string;
    Date?: Date;
    LotQty: number;
    RejQty: number;
    RejReason: string;
}

export class OrderFulfilmentDetails {
    PONumber: string;
    PODate?: Date;
    Currency: string;
    Version: string;
    Status: string;
    aSNDetails: ASNDetails[];
    itemDetails: ItemDetails[];
    gRNDetails: GRNDetails[];
    qADetails: QADetails[];
}
