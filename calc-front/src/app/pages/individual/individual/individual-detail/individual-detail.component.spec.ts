import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDetailComponent } from './individual-detail.component';


describe('IndividualDetailComponent', () => {
  let component: IndividualDetailComponent;
  let fixture: ComponentFixture<IndividualDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
