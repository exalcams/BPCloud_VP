export class CommonClass {
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}

export class BPCFact extends CommonClass {
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
    ID: number;
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
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    SeqNo: string;
    AppID: string;
    DocNumber: string;
    ActionText: string;
    Status: string;
    Date: Date | string | null;
    Time: string;
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
}
