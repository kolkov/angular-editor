import { HttpClientModule } from '@angular/common/http';
import {
    inject,
    TestBed,
} from '@angular/core/testing';

import { AngularEditorService } from './angular-editor.service';

describe('AngularEditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [AngularEditorService]
    });
  });

  it('should be created', inject([AngularEditorService], (service: AngularEditorService) => {
    expect(service).toBeTruthy();
  }));
});
