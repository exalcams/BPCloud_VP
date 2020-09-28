import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DeclarationComponent implements OnInit {
  BGClassName: any;
  fuseConfig: any;
  constructor( private _fuseConfigService: FuseConfigService) { }

  ngOnInit() {
    this.SetUserPreference();
  }
  SetUserPreference(): void {
    this._fuseConfigService.config
        .subscribe((config) => {
            this.fuseConfig = config;
            this.BGClassName = config;
        });
    // this._fuseConfigService.config = this.fuseConfig;
}
}
