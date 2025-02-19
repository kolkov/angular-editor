import {inject, TestBed} from '@angular/core/testing';

import {AngularEditorService} from './angular-editor.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AngularEditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [AngularEditorService, provideHttpClient(withInterceptorsFromDi())]
});
  });

  it('should be created', inject([AngularEditorService], (service: AngularEditorService) => {
    expect(service).toBeTruthy();
  }));
});
