import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdDetailComponent } from './household-detail.component';

describe('NonDComponent', () => {
  let component: HouseholdDetailComponent;
  let fixture: ComponentFixture<HouseholdDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseholdDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
