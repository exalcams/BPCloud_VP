import { CommonClass } from './common';
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
    AWBDate: Date | string | null;
    DepartureDate: Date | string | null;
    ArrivalDate: Date | string | null;
    ShippingAgency: string;
    GrossWeight: number;
    GrossWeightUOM: string;
    NetWeight: number;
    NetWeightUOM: string;
    VolumetricWeight: number;
    VolumetricWeightUOM: string;
    NumberOfPacks: number;
    InvoiceNumber: string;
    InvoiceDate: Date | string | null;
    InvoiceAmount: number;
    InvoiceAmountUOM: string;
    InvDocReferenceNo: string;
    IsSubmitted: boolean;
    ArrivalDateInterval: number;
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
    DeliveryDate: Date | string | null;
    OrderedQty: number;
    CompletedQty: number;
    TransitQty: number;
    OpenQty: number;
    ASNQty: number;
    UOM: string;
    Batch: string;
    ManufactureDate: Date | string | null;
    ExpiryDate: Date | string | null;
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
    InvoiceDate: Date | string | null;
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
    DeliveryDate: Date | string | null;
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
    AWBDate: Date | string | null;
    DepartureDate: Date | string | null;
    ArrivalDate: Date | string | null;
    ShippingAgency: string;
    GrossWeight: number;
    GrossWeightUOM: string;
    NetWeight: number;
    NetWeightUOM: string;
    VolumetricWeight: number;
    VolumetricWeightUOM: string;
    NumberOfPacks: number;
    InvoiceNumber: string;
    InvoiceDate: Date | string | null;
    InvoiceAmount: number;
    InvoiceAmountUOM: string;
    InvDocReferenceNo: string;
    IsSubmitted: boolean;
    ArrivalDateInterval: number;
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

export class BPCInvoiceAttachment {
    AttachmentID: number;
    AttachmentName: string;
    ContentType: string;
    ContentLength: number;
}

export class BPCCountryMaster extends CommonClass {
    ID: number;
    CountryCode: string;
    CountryName: string;
}
export class BPCCurrencyMaster extends CommonClass {
    ID: number;
    CurrencyCode: string;
    CurrencyName: string;
}
export class BPCDocumentCenterMaster extends CommonClass {
    AppID: number;
    DocumentType: string;
    Text: string;
    Mandatory: boolean;
    Extension: string;
    SizeInKB: number;
    ForwardMail: string;
}


