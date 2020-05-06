import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoFlipComponent } from './po-flip.component';

describe('PoFlipComponent', () => {
  let component: PoFlipComponent;
  let fixture: ComponentFixture<PoFlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoFlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoFlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
