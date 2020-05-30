import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportdeskComponent } from './supportdesk.component';

describe('SupportdeskComponent', () => {
  let component: SupportdeskComponent;
  let fixture: ComponentFixture<SupportdeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportdeskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportdeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
