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
    DepartureDate?: Date;
    ArrivalDate?: Date;
    ShippingAgency: string;
    GrossWeight: number;
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
    DeliveryDate?: Date;
    OrderedQty: number;
    CompletedQty: number;
    TransitQty: number;
    OpenQty: number;
    ASNQty: number;
    UOM: string;
    Batch: string;
    ManufactureDate?: Date;
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
    DeliveryDate?: Date;
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
    DepartureDate?: Date;
    ArrivalDate?: Date;
    ShippingAgency: string;
    GrossWeight: number;
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
    DocumentCenters: DocumentCenter[];
    constructor() {
        super();
        this.ASNItems = [];
        this.DocumentCenters = [];
    }
}
export class DocumentCenter extends CommonClass {
    ASNNumber: string;
    DocumentType: string;
    DocumentTitle: string;
    Filename: string;
    AttachmentReferenceNo: string;
}


