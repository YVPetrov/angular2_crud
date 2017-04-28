import { TestBed, inject } from '@angular/core/testing';

import { IoptionService } from './ioption.service';

describe('IoptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IoptionService]
    });
  });

  it('should ...', inject([IoptionService], (service: IoptionService) => {
    expect(service).toBeTruthy();
  }));
});
