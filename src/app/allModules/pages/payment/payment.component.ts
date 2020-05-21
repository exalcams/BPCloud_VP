import { PaymentReportService } from "./../../../services/paymentReport.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-payment",
    templateUrl: "./payment.component.html",
    styleUrls: ["./payment.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PaymentComponent implements OnInit {
    constructor(private paymentReportService: PaymentReportService) {}

    ngOnInit(): void {
        this.paymentReportService.GetBPCPayments();
        this.Payments = [
            {
                PaymentDoc: "Shipping Cost",
                Date: new Date(),
                Amount: "400",
                Attachment: "Doc1",
                Remark: "200KG Shipment",
            },
            {
                PaymentDoc: "Shipping Cost",
                Date: new Date(),
                Amount: "400",
                Attachment: "Doc1",
                Remark: "200KG Shipment",
            },
            {
                PaymentDoc: "Shipping Cost",
                Date: new Date(),
                Amount: "400",
                Attachment: "Doc1",
                Remark: "200KG Shipment",
            },
            {
                PaymentDoc: "Shipping Cost",
                Date: new Date(),
                Amount: "400",
                Attachment: "Doc1",
                Remark: "200KG Shipment",
            },
        ];

        this.poCostDataSource = new MatTableDataSource(this.Payments);
    }

    // tslint:disable-next-line: member-ordering
    poCostDisplayedColumns: string[] = [
        "PaymentDoc",
        "Date",
        "Amount",
        "Attachment",
        "Remark",
    ];

    // tslint:disable-next-line: member-ordering
    poCostDataSource: MatTableDataSource<PaymentModel>;
    // tslint:disable-next-line: member-ordering
    Payments: PaymentModel[] = [];
}

export class PaymentModel {
    PaymentDoc: string;
    Date: Date;
    Amount: string;
    Attachment: string;
    Remark: string;
}
