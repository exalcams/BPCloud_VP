import { CommonClass } from './common';
export class BPCFact extends CommonClass {
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    LegalName: string;
    AddressLine1: string;
    AddressLine2: string;
    City: string;
    State: string;
    Country: string;
    PinCode: string;
    Phone1: string;
    Phone2: string;
    Email1: string;
    Email2: string;
    TaxID1: string;
    TaxID2: string;
    OutstandingAmount: number;
    CreditAmount: number;
    LastPayment: number;
    LastPaymentDate?: Date;
    Currency: string;
    CreditLimit: number;
    CreditBalance: number;
    CreditEvalDate?: Date;
}
export class BPCFactContactPerson extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    ContactPersonID: string;
    Name: string;
    ContactNumber: string;
    Email: string;
}
export class BPCFactBank extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    AccountNumber: string;
    AccountName: string;
    BankID: string;
    BankName: string;
}
export class BPCKRA extends CommonClass {
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    KRA: string;
    EvalDate?: Date;
    KRAText: string;
    KRAValue: string;
}
export class BPCAIACT extends CommonClass {
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    SeqNo: number;
    ActType: string;
    AppID: string;
    DocNumber: string;
    Action: string;
    ActionText: string;
    Status: string;
    Date: Date | string | null;
    Time: string;
    IsSeen: boolean;
}
export class BPCCertificate extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    CertificateType: string;
    CertificateName: string;
    Validity: Date | string | null;
    Mandatory: string;
    Attachment: string;
    AttachmentFile: File;
}

export class BPCCertificateAttachment extends CommonClass {

    client: string;
    company: string;
    type: string;
    patnerID: string;
    CertificateType: string;
    CertificateName: string;
    file: File;
}
export class BPCFactView extends CommonClass {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    LegalName: string;
    AddressLine1: string;
    AddressLine2: string;
    City: string;
    State: string;
    Country: string;
    PinCode: string;
    Phone1: string;
    Phone2: string;
    Email1: string;
    Email2: string;
    TaxID1: string;
    TaxID2: string;
    OutstandingAmount: number;
    CreditAmount: number;
    LastPayment: number;
    LastPaymentDate?: Date;
    Currency: string;
    CreditLimit: number;
    CreditBalance: number;
    CreditEvalDate?: Date;
    BPCFactContactPersons: BPCFactContactPerson[];
    BPCFactBanks: BPCFactBank[];
    BPCKRAs: BPCKRA[];
    BPCAIACTs: BPCAIACT[];
    BPCFactCerificate: BPCCertificate[];
}
export class FactViewSupport {
    BPCFact: BPCFact;
    BPCFactBanks: BPCFactBank[];
    BPCFactCerificate: BPCCertificate[];
}
export class CustomerBarChartData {
    BarChartLabels: string[];
    PlannedData: string[];
    ActualData: string[];
}
export class BPCFactXLSX {
    ID: number;
    Client: string;
    Company: string;
    Patnerid: string;
    Legalname: string;
    Type: string;
    Postal: string;
    Currency: string;
    City: string;
    District: string;
    Accountgroup: string;
    Phone1: string;
    Phone2: string;
    Tax1: string;
    Tax2: string;
    Outstandingamount: number;
    Lastpayment: number;
    Lastpaymentdate: string;
}
export class BPCFactBankXLSX {
    Partnerid: string;
    Accountnumber: string;
    Accountname: string
    Bankid: string;
    Bankname: string;
}
