import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AeToolbarSetComponent } from './ae-toolbar-set.component';

describe('AeToolbarSetComponent', () => {
  let component: AeToolbarSetComponent;
  let fixture: ComponentFixture<AeToolbarSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AeToolbarSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AeToolbarSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
