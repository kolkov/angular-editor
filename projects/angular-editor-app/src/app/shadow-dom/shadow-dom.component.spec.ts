import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShadowDomComponent } from './shadow-dom.component';

describe('ShadowDomComponent', () => {
  let component: ShadowDomComponent;
  let fixture: ComponentFixture<ShadowDomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShadowDomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShadowDomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
