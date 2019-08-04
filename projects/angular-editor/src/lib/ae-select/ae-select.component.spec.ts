import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AeSelectComponent } from './ae-select.component';

describe('AeSelectComponent', () => {
  let component: AeSelectComponent;
  let fixture: ComponentFixture<AeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
