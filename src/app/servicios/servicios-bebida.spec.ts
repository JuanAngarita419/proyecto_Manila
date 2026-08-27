import { TestBed } from '@angular/core/testing';
import { servicioBebida } from './servicios-bebida';

describe('ServicioBebida', () => {
  let service!: servicioBebida;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(servicioBebida);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
