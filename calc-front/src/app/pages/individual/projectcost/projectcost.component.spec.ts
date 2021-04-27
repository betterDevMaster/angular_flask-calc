import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectcostComponent } from './projectcost.component';

describe('ProjectcostComponent', () => {
  let component: ProjectcostComponent;
  let fixture: ComponentFixture<ProjectcostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectcostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectcostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
