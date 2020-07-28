import { Component, OnInit, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
// import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
@Component({
  selector: 'app-tour-screen-dialog',
  templateUrl: './tour-screen-dialog.component.html',
  styleUrls: ['./tour-screen-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TourScreenDialogComponent implements OnInit {

  images: any[];
  // @ViewChild('ngcarousel') Carousel: NgbCarousel;
  constructor(public matDialogRef: MatDialogRef<TourScreenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public tourScreenDialogDetails: any) {

  }

  ngOnInit(): void {
    this.images = ['https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/1.jpg',
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/5.jpg',
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/9.jpg',
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg',
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/2.jpg'

    ];
  }

  // goToNext(): void {
  //   this.Carousel.next();
  // }

  // goToPrev(): void {
  //   this.Carousel.prev();
  // }

  closeDialogClicked(): void {
    this.matDialogRef.close(null);
  }

}
