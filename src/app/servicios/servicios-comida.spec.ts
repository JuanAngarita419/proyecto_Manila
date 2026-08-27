import { TestBed } from '@angular/core/testing';

import { serviciosComida } from './servicios-comida';

describe('ServiciosComida', () => {
  let service: serviciosComida;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(serviciosComida);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
