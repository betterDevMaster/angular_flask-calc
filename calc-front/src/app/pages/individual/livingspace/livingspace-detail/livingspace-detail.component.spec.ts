import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivingspaceDetailComponent } from './livingspace-detail.component';

describe('NonEComponent', () => {
  let component: LivingspaceDetailComponent;
  let fixture: ComponentFixture<LivingspaceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivingspaceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivingspaceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
