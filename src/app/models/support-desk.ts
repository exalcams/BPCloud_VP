import { UserWithRole } from './master';
import { CommonClass } from './common';

export class SupportHeader extends CommonClass {
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
export class SupportLog extends CommonClass {
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    SupportID: string;
    SupportLogID: string;
    Status: string;
    Remarks: string;
    IsResolved: boolean;
}
export class SupportDetails extends CommonClass {
    supportHeader: SupportHeader;
    supportLogs: SupportLog[];
    supportAttachments: BPCSupportAttachment[];
    supportLogAttachments: BPCSupportAttachment[];
}
export class SupportMaster extends CommonClass {
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
    SupportLogID: string;
    AttachmentFile: any;
}
export class SupportHeaderView extends CommonClass {
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
export class SupportLogView extends CommonClass {
    ID: number;
    SupportID: string;
    Client: string;
    Company: string;
    Type: string;
    PatnerID: string;
    Status: string;
    Remarks: string;
    IsResolved: boolean;
    PatnerEmail: string;
}
export class SupportMasterView extends CommonClass {
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

