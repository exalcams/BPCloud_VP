export class CommonClass {
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}

export class BPCASNHeader extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    ASNNumber: string;
    DocNumber: string;
    TransportMode: string;
    VessleNumber: string;
    CountryOfOrigin: string;
    AWBNumber: string;
    AWBDate?: Date;
    DepatDate?: Date;
    ArriveDate?: Date;
    ShippingAgency: string;
    CrossWeight: number;
    NetWeight: number;
    UOM: string;
    VolumetricWeight: number;
    VolumetricWeightUOM: string;
    NumberOfPacks: number;
    InvoiceNumber: string;
    InvoiceDate?: Date;
    InvoiceAmount: number;
    InvDocReferenceNo: string;
}

export class BPCASNItem extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    ASNNumber: string;
    Item: string;
    Material: string;
    MaterialText: string;
    DelDate?: Date;
    OrderedQty: number;
    CompletedQty: number;
    TransitQty: number;
    ASNQty: number;
    UOM: string;
    Batch: string;
    ManfDate?: Date;
    ManfCountry: string;
}

export class BPCFLIPHeader extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    FLIPID: string;
    InvoiceNumber: string;
    InvoiceDate?: Date;
    InvoiceAmount: number;
}

export class BPCFLIPItem extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    FLIPID: string;
    Item: string;
    Material: string;
    MaterialText: string;
    DelDate?: Date;
    OrderedQty: number;
    OpenQty: number;
    InvoiceQty: number;
    UOM: string;
    HSN: string;
}

export class BPCFLIPCost extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    FLIPID: string;
    ExpenceType: string;
    Amount: number;
    Remarks: string;
}

export class BPCASNView extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    ASNNumber: string;
    DocNumber: string;
    TransportMode: string;
    VessleNumber: string;
    CountryOfOrigin: string;
    AWBNumber: string;
    AWBDate?: Date;
    DepatDate?: Date;
    ArriveDate?: Date;
    ShippingAgency: string;
    CrossWeight: number;
    NetWeight: number;
    UOM: string;
    VolumetricWeight: number;
    VolumetricWeightUOM: string;
    NumberOfPacks: number;
    InvoiceNumber: string;
    InvoiceDate?: Date;
    InvoiceAmount: number;
    InvDocReferenceNo: string;
    ASNItems: BPCASNItem[];
}
