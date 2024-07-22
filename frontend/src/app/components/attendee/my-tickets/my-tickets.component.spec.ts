import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTicketsComponent } from './my-tickets.component';

describe('MyTicketsComponent', () => {
  let component: MyTicketsComponent;
  let fixture: ComponentFixture<MyTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
