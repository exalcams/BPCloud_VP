import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-asnrelease-dialog',
  templateUrl: './asnrelease-dialog.component.html',
  styleUrls: ['./asnrelease-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ASNReleaseDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public message: string,
    public dialogRef: MatDialogRef<ASNReleaseDialogComponent>,
  ) { }

  ngOnInit(): void {

  }
  YesClicked(): void {
    this.dialogRef.close(true);
  }
  CloseClicked(): void {
    this.dialogRef.close(false);
  }

}
