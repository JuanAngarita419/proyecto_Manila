import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { serviciosComida } from '../servicios/servicios-comida';

interface PlatoTipico {
  nombre: string;
  descripcion: string;
  imagenUrl: string;
}

@Component({
  selector: 'app-carrusel',
  imports: [CommonModule],
  templateUrl: './carrusel.html',
  styleUrl: './carrusel.css',
})
export class Carrusel implements OnInit, OnDestroy {

  @ViewChild('pista') pista!: ElementRef<HTMLDivElement>;

  // guarda el intervalo del auto-scroll para poder detenerlo después
  intervalo: any;

  platos: PlatoTipico[] = [
    {
      nombre: 'Arepa',
      descripcion: 'El pan de maíz que acompaña cada comida colombiana.',
      imagenUrl: 'https://images.unsplash.com/photo-1587603366933-aa6947174c65?w=700&q=80'
    },
    {
      nombre: 'Sancocho',
      descripcion: 'Sopa contundente de carne, plátano, papa y mazorca.',
      imagenUrl: 'https://images.unsplash.com/photo-1665594051407-7385d281ad76?w=700&q=80'
    },
    {
      nombre: 'Empanadas',
      descripcion: 'Masa de maíz rellena y frita, infaltable en la mesa colombiana.',
      imagenUrl: 'https://images.unsplash.com/photo-1548228586-171fb0887ac0?w=700&q=80'
    },
    {
      nombre: 'Asado',
      descripcion: 'Carne asada a la parrilla, protagonista de las reuniones familiares.',
      imagenUrl: 'https://images.unsplash.com/photo-1619683909099-03814b162136?w=700&q=80'
    }
  ];

  constructor(private serviciosComida: serviciosComida) {}

  ngOnInit(): void {
    this.traerImagenesReales();
    this.iniciarAutoScroll();
  }

  ngOnDestroy(): void {
    // apagamos el intervalo para que no siga corriendo cuando salimos de la página
    clearInterval(this.intervalo);
  }

  // busca en la API la imagen real de cada plato típico, por su nombre
  traerImagenesReales() {
    this.platos.forEach((plato) => {
      this.serviciosComida.recibirDatosC(plato.nombre).subscribe({
        next: (dato: any) => {
          if (dato.meals && dato.meals[0]) {
            plato.imagenUrl = dato.meals[0].strMealThumb;
          }
        },
        error: () => {
          // si falla, se queda con la imagen que ya tenía
        },
      });
    });
  }

  // hace que el carrusel avance solo cada 4 segundos
  iniciarAutoScroll() {
    this.intervalo = setInterval(() => {
      const contenedor = this.pista.nativeElement;
      const llegoAlFinal =
        contenedor.scrollLeft + contenedor.clientWidth >= contenedor.scrollWidth - 5;

      if (llegoAlFinal) {
        // si ya llegó al final, vuelve al inicio
        contenedor.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        this.irSiguiente();
      }
    }, 4000);
  }

  irAnterior(): void {
    this.desplazar(-1);
  }

  irSiguiente(): void {
    this.desplazar(1);
  }

  private desplazar(sentido: number): void {
    const contenedor = this.pista.nativeElement;
    const distancia = contenedor.clientWidth; // el ancho completo = 1 tarjeta
    contenedor.scrollBy({
      left: distancia * sentido,
      behavior: 'smooth'
    });
  }
}