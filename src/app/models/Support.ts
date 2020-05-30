export class SupportMaster{
    ID:number;
    Client:string;
    Company:string;
    Type:string;
    PatnerID:string;
    Plant:string;
    App:string;
    ReasionCode:string;
    ReasionText:string;
    Persion1:string;
    Persion2:string;
    Persion3:string;

}
export class SupportHeader{
    SupportID:string;
    Client:string;
    Company:string;
    Type:string;
    PatnerID:string;
    ReasionCode:string;
    Date:string;
    Assignto:string;
    Status:string;
    ReasionRemarks:string;
}
export class SupportItem{
    ID:number;
    SupportID:string;
    Client:string;
    Company:string;
    Type:string;
    PatnerID:string;
    Status:string;
    Remarks:string;
}