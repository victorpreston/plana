import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNotificationsComponent } from './my-notifications.component';

describe('MyNotificationsComponent', () => {
  let component: MyNotificationsComponent;
  let fixture: ComponentFixture<MyNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
