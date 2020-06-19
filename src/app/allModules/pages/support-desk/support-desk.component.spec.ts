import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDeskComponent } from './support-desk.component';

describe('SupportDeskComponent', () => {
  let component: SupportDeskComponent;
  let fixture: ComponentFixture<SupportDeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportDeskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
