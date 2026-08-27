import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Navegacion } from './navegacion';

describe('Navegacion', () => {
  let component: Navegacion;
  let fixture: ComponentFixture<Navegacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navegacion],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Navegacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all navigation options', () => {
    const links = fixture.nativeElement.querySelectorAll('.nav-link');

    expect(links).toHaveLength(5);
    expect(Array.from(links, (link: Element) => link.textContent?.trim())).toEqual([
      'Inicio',
      'Comida',
      'Bebidas',
      'Carrito',
      'Juego',
    ]);
  });
});
