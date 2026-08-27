import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Navegacion } from './navegacion/navegacion';
import { Footer } from './footer/footer';
import { Informacion } from './informacion/informacion';
import { Carrusel } from './carrusel/carrusel';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navegacion, Footer, Informacion, Carrusel],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  esRutaInicio = true;

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.esRutaInicio = event.urlAfterRedirects === '/';
      });
  }
}
