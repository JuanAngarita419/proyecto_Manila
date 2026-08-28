import { TestBed } from '@angular/core/testing';
import { ServicioBebida } from './servicios-bebida';

describe('ServicioBebida', () => {
  let service!: ServicioBebida;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioBebida);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
