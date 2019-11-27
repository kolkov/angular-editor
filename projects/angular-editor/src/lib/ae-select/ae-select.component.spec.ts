import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AeSelectComponent, SelectOption } from './ae-select.component';
import { By } from '@angular/platform-browser';

describe('AeSelectComponent', () => {
  let component: AeSelectComponent;
  let fixture: ComponentFixture<AeSelectComponent>;

  const testOptions: SelectOption[] = [
    {
      label: 'test label1',
      value: 'test value1'
    },
    {
      label: 'test label2',
      value: 'test value2'
    }
  ];

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

  it('should be visible after initialized', () => {
    const hide = spyOn(component, 'hide');
    component.ngOnInit();
    expect(component.hidden).toBe('inline-block');
    expect(hide).not.toHaveBeenCalled();
  });

  it('should select first option after initialized', () => {
    component.options = testOptions;
    component.ngOnInit();
    expect(component.selectedOption).toBe(testOptions[0]);
  });

  it('should call hide method after initialized when passed isHidden: true', () => {
    const hide = spyOn(component, 'hide');
    component.isHidden = true;
    component.ngOnInit();
    expect(hide).toHaveBeenCalled();
  });

  it('should be hidden after called hide method', () => {
    component.hide();
    expect(component.hidden).toBe('none');
  });

  it('should render options', () => {
    component.options = testOptions;
    component.selectedOption = testOptions[0];
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(By.css('.ae-picker-item'));
    expect(options.length).toBe(2);
  });

  it('should select option by click', () => {
    component.options = testOptions;
    component.selectedOption = testOptions[0];
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(By.css('.ae-picker-item'));
    const optionSelect = spyOn(component, 'optionSelect');
    options[1].triggerEventHandler('click', {});
    expect(optionSelect).toHaveBeenCalledWith(testOptions[1], {} as MouseEvent);
  });

  it('should select option and close after', () => {
    const event = new MouseEvent('click');
    const stopPropagation = spyOn(event, 'stopPropagation');
    const setValue = spyOn(component, 'setValue').and.callFake(() => {});
    const onChange = spyOn(component, 'onChange').and.callFake(() => {});
    const onTouched = spyOn(component, 'onTouched');
    const changeEvent = spyOn(component.changeEvent, 'emit').and.callFake(() => {});

    component.opened = true;

    component.selectedOption = testOptions[1];

    component.optionSelect(testOptions[1], event);

    expect(stopPropagation).toHaveBeenCalled();
    expect(setValue).toHaveBeenCalledWith(testOptions[1].value);
    expect(onChange).toHaveBeenCalledWith(testOptions[1].value);
    expect(onTouched).toHaveBeenCalled();
    expect(changeEvent).toHaveBeenCalledWith(testOptions[1].value);
    expect(component.opened).toBe(false);
  });

});
