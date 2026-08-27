import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Navegacion } from './navegacion/navegacion';
import { Footer } from './footer/footer';
import { Informacion } from './informacion/informacion';
import { Carrusel } from './carrusel/carrusel';
import { Logo } from "./logo/logo";
import { Carrito } from './carrito/carrito';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navegacion, Footer, Informacion, Carrusel, Logo, Carrito],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('actividad2');
  private router = inject(Router);
  esRutaInicio = true;

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.esRutaInicio = event.urlAfterRedirects === '/';
      });
  }
}
