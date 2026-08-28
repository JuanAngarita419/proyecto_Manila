import { TestBed } from '@angular/core/testing';

import { ServicioComida } from './servicios-comida';

describe('ServicioComida', () => {
  let service: ServicioComida;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioComida);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
