import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inspection-plan',
  templateUrl: './inspection-plan.component.html',
  styleUrls: ['./inspection-plan.component.scss']
})
export class InspectionPlanComponent implements OnInit {
  isProgressBarVisibile: boolean;
  constructor() { }

  ngOnInit(): void {

  }

}
