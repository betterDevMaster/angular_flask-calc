import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasisDetailComponent } from './basis-detail.component';

describe('BasisComponent', () => {
  let component: BasisDetailComponent;
  let fixture: ComponentFixture<BasisDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasisDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasisDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
