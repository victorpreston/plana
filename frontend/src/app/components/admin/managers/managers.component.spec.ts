import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagersComponent } from './managers.component';

describe('ManagersComponent', () => {
  let component: ManagersComponent;
  let fixture: ComponentFixture<ManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
