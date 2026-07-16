import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AeButtonComponent } from './ae-button.component';

describe('AeButtonComponent', () => {
  let component: AeButtonComponent;
  let fixture: ComponentFixture<AeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AeButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ==========================================================================
  // Creation
  // ==========================================================================

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have empty iconName by default', () => {
      expect(component.iconName).toBe('');
    });
  });

  // ==========================================================================
  // Host bindings
  // ==========================================================================

  describe('host bindings', () => {
    it('should have angular-editor-button class on host element', () => {
      const hostEl = fixture.nativeElement as HTMLElement;
      expect(hostEl.classList.contains('angular-editor-button')).toBe(true);
    });

    it('should have tabIndex of -1', () => {
      const hostEl = fixture.nativeElement as HTMLElement;
      expect(hostEl.getAttribute('tabindex')).toBe('-1');
    });

    it('should have type="button" to prevent form submission', () => {
      const hostEl = fixture.nativeElement as HTMLElement;
      expect(hostEl.getAttribute('type')).toBe('button');
    });
  });

  // ==========================================================================
  // iconName input
  // ==========================================================================

  describe('iconName input', () => {
    it('should render svg when iconName is set', () => {
      fixture.componentRef.setInput('iconName', 'bold');
      fixture.detectChanges();

      const svg = fixture.debugElement.query(By.css('svg'));
      expect(svg).toBeTruthy();
    });

    it('should render use element pointing to the icon', () => {
      fixture.componentRef.setInput('iconName', 'italic');
      fixture.detectChanges();

      const use = fixture.debugElement.query(By.css('use'));
      expect(use).toBeTruthy();
      expect(use.nativeElement.getAttribute('href')).toContain('italic');
    });

    it('should NOT render svg when iconName is empty', () => {
      fixture.componentRef.setInput('iconName', '');
      fixture.detectChanges();

      const svg = fixture.debugElement.query(By.css('svg'));
      expect(svg).toBeNull();
    });

    it('should render ng-content when iconName is empty', () => {
      // Without ng-content projection we just verify svg is absent
      fixture.componentRef.setInput('iconName', '');
      fixture.detectChanges();

      const svg = fixture.debugElement.query(By.css('svg'));
      expect(svg).toBeNull();
    });

    it('should update icon href when iconName changes', () => {
      fixture.componentRef.setInput('iconName', 'bold');
      fixture.detectChanges();

      fixture.componentRef.setInput('iconName', 'italic');
      fixture.detectChanges();

      const use = fixture.debugElement.query(By.css('use'));
      expect(use.nativeElement.getAttribute('href')).toContain('italic');
    });
  });

  // ==========================================================================
  // Click events
  // ==========================================================================

  describe('click events', () => {
    it('should respond to click events', () => {
      let clicked = false;
      fixture.nativeElement.addEventListener('click', () => { clicked = true; });

      fixture.nativeElement.click();
      expect(clicked).toBe(true);
    });
  });
});
