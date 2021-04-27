import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsDetailComponent } from './documents-detail.component';

describe('DocumentsDetailComponent', () => {
  let component: DocumentsDetailComponent;
  let fixture: ComponentFixture<DocumentsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
