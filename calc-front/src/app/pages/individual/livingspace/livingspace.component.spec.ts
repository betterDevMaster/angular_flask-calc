import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivingspaceComponent } from './livingspace.component';

describe('NonEComponent', () => {
  let component: LivingspaceComponent;
  let fixture: ComponentFixture<LivingspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivingspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivingspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
