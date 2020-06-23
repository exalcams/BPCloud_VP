import { UserWithRole } from './master';

export class SupportHeader {
    SupportID: string;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    ReasonCode: string;
    Date: string;
    AssignTo: string;
    Status: string;
    ReasonRemarks: string;
    DocumentRefNo: string;
    Reason: string;
    IsResolved: boolean;
}
export class SupportLog {
    ID: number;
    SupportID: string;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    Status: string;
    Remarks: string;
    CreatedBy: string;
    CreatedOn: Date;
    IsResolved: boolean;
}
export class SupportDetails {
    supportHeader: SupportHeader;
    supportLogs: SupportLog[];
    supportAttachments: BPCSupportAttachment[];
}
export class SupportMaster {
    ID: number;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    Plant: string;
    App: string;
    ReasonCode: string;
    ReasonText: string;
    Person1: string;
    Person2: string;
    Person3: string;

}
export class BPCSupportAttachment {
    AttachmentID: number;
    AttachmentName: string;
    ContentType: string;
    ContentLength: number;
    SupportID: string;
    AttachmentFile: any;
}
export class SupportHeaderView {
    SupportID: string;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    ReasonCode: string;
    Date: string;
    AssignTo: string;
    Status: string;
    ReasonRemarks: string;
    DocumentRefNo: string;
    Reason: string;
    IsResolved: boolean;
    Users: UserWithRole[];
}

