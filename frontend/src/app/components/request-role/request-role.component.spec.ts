import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRoleComponent } from './request-role.component';

describe('RequestRoleComponent', () => {
  let component: RequestRoleComponent;
  let fixture: ComponentFixture<RequestRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
