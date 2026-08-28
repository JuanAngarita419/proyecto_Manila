import { TestBed } from '@angular/core/testing';

import { ServicioCarrito } from './servicios-carrito';

describe('ServicioCarrito', () => {
  let service: ServicioCarrito;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioCarrito);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
