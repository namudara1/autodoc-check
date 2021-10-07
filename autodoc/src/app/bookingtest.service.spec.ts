import { TestBed } from '@angular/core/testing';

import { BookingtestService } from './bookingtest.service';

describe('BookingtestService', () => {
  let service: BookingtestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingtestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
