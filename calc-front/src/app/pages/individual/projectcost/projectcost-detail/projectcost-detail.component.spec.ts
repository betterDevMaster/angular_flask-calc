import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectcostDetailComponent } from './projectcost-detail.component';

describe('ProjectcostDetailComponent', () => {
  let component: ProjectcostDetailComponent;
  let fixture: ComponentFixture<ProjectcostDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectcostDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectcostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
