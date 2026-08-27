import { TestBed } from '@angular/core/testing';

import { servicioCarrito } from './servicios-carrito';

describe('servicioCarrito', () => {
  let service: servicioCarrito;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(servicioCarrito);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
