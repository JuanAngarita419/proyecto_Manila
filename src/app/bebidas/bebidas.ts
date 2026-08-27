import { Component, OnInit, signal, HostListener } from '@angular/core';
import { servicioCarrito } from '../servicios/servicios-carrito';
import { servicioBebida } from '../servicios/servicios-bebida';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bebidas as BebidaEntidad } from '../entidades/entidad-bebidas';

@Component({
  selector: 'app-bebidas',
  imports: [CommonModule, FormsModule],
  templateUrl: './bebidas.html',
  styleUrls: ['./bebidas.css'],
})
export class Bebidas implements OnInit {
  bebidas = signal<BebidaEntidad[]>([]);
  cargando = signal(false);
  hayError = signal(false);
  bebidaSeleccionada = signal<BebidaEntidad | null>(null);
  carritoConfirmado = signal(false);
  mostrarBotonSubir = signal(false);

  // opciones del select: nombre, ingrediente, alcoholicas, sinalcohol
  filtro = 'nombre';
  texto = '';

  constructor(
    private servicioBebida: servicioBebida,
    public servicioCarrito: servicioCarrito
  ) {}

  ngOnInit(): void {
    this.buscarTodo();
  }

  // muestra el botón de "volver arriba" cuando el usuario baja suficiente
  @HostListener('window:scroll')
  onScroll() {
    this.mostrarBotonSubir.set(window.scrollY > 400);
  }

  subirArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // le pone un precio random a cada bebida, entre 10.000 y 45.000
  ponerPrecios(lista: BebidaEntidad[]): BebidaEntidad[] {
    lista.forEach((bebida) => {
      bebida.precio = Math.floor(Math.random() * (45000 - 10000 + 1)) + 10000;
    });
    return lista;
  }

  // trae todas las bebidas (letra por letra) al entrar a la página
  buscarTodo() {
    this.cargando.set(true);
    this.hayError.set(false);

    this.servicioBebida.traerTodasLasBebidas().subscribe({
      next: (dato: any) => {
        const lista: BebidaEntidad[] = dato.drinks ?? [];
        this.bebidas.set(this.ponerPrecios(lista));
        this.cargando.set(false);
      },
      error: () => {
        this.hayError.set(true);
        this.cargando.set(false);
      },
    });
  }

  // decide qué buscar según el filtro que el usuario eligió
  buscar() {
    const texto = this.texto.trim();

    // si eligió alcohólicas o sin alcohol, no hace falta escribir nada
    if (this.filtro === 'alcoholicas') {
      this.buscarPorTipo('Alcoholic');
      return;
    }

    if (this.filtro === 'sinalcohol') {
      this.buscarPorTipo('Non_Alcoholic');
      return;
    }

    // para nombre e ingrediente sí hace falta texto
    if (!texto) {
      this.buscarTodo();
      return;
    }

    this.cargando.set(true);
    this.hayError.set(false);

    const peticion =
      this.filtro === 'ingrediente'
        ? this.servicioBebida.buscarPorIngrediente(texto)
        : this.servicioBebida.buscarPorNombre(texto);

    peticion.subscribe({
      next: (dato: any) => {
        const lista: BebidaEntidad[] = dato.drinks ?? [];
        this.bebidas.set(this.ponerPrecios(lista));
        this.cargando.set(false);
      },
      error: () => {
        this.hayError.set(true);
        this.cargando.set(false);
      },
    });
  }

  buscarPorTipo(tipo: string) {
    this.cargando.set(true);
    this.hayError.set(false);

    this.servicioBebida.buscarPorTipo(tipo).subscribe({
      next: (dato: any) => {
        const lista: BebidaEntidad[] = dato.drinks ?? [];
        this.bebidas.set(this.ponerPrecios(lista));
        this.cargando.set(false);
      },
      error: () => {
        this.hayError.set(true);
        this.cargando.set(false);
      },
    });
  }

  // arma la lista de ingredientes con su medida, ej: "1 oz Vodka"
  sacarIngredientes(bebida: BebidaEntidad): string[] {
    const lista: string[] = [];

    for (let n = 1; n <= 15; n++) {
      const ingrediente = bebida['strIngredient' + n];
      const medida = bebida['strMeasure' + n];

      if (ingrediente && ingrediente.trim() !== '') {
        lista.push(`${medida ? medida.trim() : ''} ${ingrediente.trim()}`.trim());
      }
    }

    return lista;
  }

  // muestra el detalle sin salir de la página (no redirecciona)
  verDetalle(bebida: BebidaEntidad) {
    // si ya tiene instrucciones es porque ya viene completa, no hace falta pedir más
    if (bebida.strInstructions) {
      this.bebidaSeleccionada.set(bebida);
      return;
    }

    // si viene de un filtro (tipo o ingrediente) solo trae id, nombre e imagen,
    // entonces buscamos el detalle completo con el id
    this.servicioBebida.buscarDetallePorId(bebida.idDrink).subscribe({
      next: (dato: any) => {
        const completa: BebidaEntidad = dato.drinks ? dato.drinks[0] : bebida;
        completa.precio = bebida.precio; // mantenemos el mismo precio random
        this.bebidaSeleccionada.set(completa);
      },
      error: () => {
        this.bebidaSeleccionada.set(bebida);
      },
    });
  }

  cerrarDetalle() {
    this.bebidaSeleccionada.set(null);
  }

  // manda la bebida al carrito de compras
  agregarAlCarrito(bebida: BebidaEntidad) {
    this.servicioCarrito.agregarProducto({
      id: bebida.idDrink,
      nombre: bebida.strDrink,
      precio: bebida.precio,
      imagen: bebida.strDrinkThumb,
      cantidad: 1,
      tipo: 'bebida',
    });

    this.carritoConfirmado.set(true);
    setTimeout(() => this.carritoConfirmado.set(false), 1800);
  }
}