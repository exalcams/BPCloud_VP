import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-ceomessage',
  templateUrl: './ceomessage.component.html',
  styleUrls: ['./ceomessage.component.scss']
})
export class CEOMessageComponent implements OnInit {
  notesForm: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
  ) {
    this.notesForm = this._formBuilder.group({
      Notes: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

}
