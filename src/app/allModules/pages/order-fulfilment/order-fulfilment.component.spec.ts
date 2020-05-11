import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFulfilmentComponent } from './order-fulfilment.component';

describe('OrderFulfilmentComponent', () => {
  let component: OrderFulfilmentComponent;
  let fixture: ComponentFixture<OrderFulfilmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderFulfilmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFulfilmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
