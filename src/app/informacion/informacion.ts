import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { serviciosComida } from '../servicios/servicios-comida';
import { servicioBebida } from '../servicios/servicios-bebida';

@Component({
  selector: 'app-informacion',
  imports: [CommonModule],
  templateUrl: './informacion.html',
  styleUrl: './informacion.css',
})
export class Informacion implements OnInit {
  comidaPopular = signal<any>(null);
  bebidaPopular = signal<any>(null);

  constructor(
    private serviciosComida: serviciosComida,
    private servicioBebida: servicioBebida
  ) {}

  ngOnInit(): void {
    this.traerComidaPopular();
    this.traerBebidaPopular();
  }

  traerComidaPopular() {
    this.serviciosComida.traerComidaAleatoria().subscribe({
      next: (dato: any) => {
        const plato = dato.meals ? dato.meals[0] : null;
        this.comidaPopular.set(plato);
      },
      error: () => {
        this.comidaPopular.set(null);
      },
    });
  }

  traerBebidaPopular() {
    this.servicioBebida.traerBebidaAleatoria().subscribe({
      next: (dato: any) => {
        const bebida = dato.drinks ? dato.drinks[0] : null;
        this.bebidaPopular.set(bebida);
      },
      error: () => {
        this.bebidaPopular.set(null);
      },
    });
  }
}