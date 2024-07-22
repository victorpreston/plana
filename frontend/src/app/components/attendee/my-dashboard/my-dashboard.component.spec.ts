import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDashboardComponent } from './my-dashboard.component';

describe('MyDashboardComponent', () => {
  let component: MyDashboardComponent;
  let fixture: ComponentFixture<MyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
