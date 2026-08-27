import { Component, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { serviciosComida } from '../servicios/servicios-comida';
import { servicioCarrito } from '../servicios/servicios-carrito';
import { Comida as ComidaEntidad } from '../entidades/entidad-comida';

@Component({
  selector: 'app-comida',
  imports: [CommonModule, FormsModule],
  templateUrl: './comida.html',
  styleUrl: './comida.css',
})
export class Comida implements OnInit {
  // signal para guardar las comidas, tipado con la entidad ComidaEntidad
  comidas = signal<ComidaEntidad[]>([]);
  cargando = signal(false);
  hayError = signal(false);

  // signal para el plato que se ve en el detalle (null = cerrado)
  platoSeleccionado = signal<ComidaEntidad | null>(null);
  carritoConfirmado = signal(false);
  mostrarBotonSubir = signal(false);

  filtro = 'nombre';
  texto = '';

  constructor(
    private serviciosComida: serviciosComida,
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

  // pone un precio random a cada plato, entre 10.000 y 45.000
  ponerPrecios(lista: ComidaEntidad[]): ComidaEntidad[] {
    lista.forEach((plato) => {
      plato.precio = Math.floor(Math.random() * (45000 - 10000 + 1)) + 10000;
    });
    return lista;
  }

  // trae todas las comidas (letra por letra) o busca por nombre si le paso texto
  buscarTodo(texto: string = '') {
    this.cargando.set(true);
    this.hayError.set(false);

    const peticion = texto
      ? this.serviciosComida.recibirDatosC(texto)
      : this.serviciosComida.traerTodasLasComidas();

    peticion.subscribe({
      next: (dato: any) => {
        const lista: ComidaEntidad[] = dato.meals ?? [];
        this.comidas.set(this.ponerPrecios(lista));
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('error API:', err);
        this.hayError.set(true);
        this.cargando.set(false);
      },
    });
  }

  buscar() {
    const texto = this.texto.trim();

    if (!texto) {
      this.buscarTodo();
      return;
    }

    if (this.filtro === 'nombre') {
      this.buscarTodo(texto);
      return;
    }

    // buscar por ingrediente
    this.cargando.set(true);
    this.hayError.set(false);

    this.serviciosComida.buscarPorIngrediente(texto).subscribe({
      next: (dato: any) => {
        const lista: ComidaEntidad[] = dato.meals ?? [];
        this.comidas.set(this.ponerPrecios(lista));
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('error API:', err);
        this.hayError.set(true);
        this.cargando.set(false);
      },
    });
  }

  // arma la lista de ingredientes con su medida, ej: "200g Pollo"
  sacarIngredientes(plato: ComidaEntidad): string[] {
    const lista: string[] = [];

    for (let n = 1; n <= 20; n++) {
      const ingrediente = plato['strIngredient' + n];
      const medida = plato['strMeasure' + n];

      if (ingrediente && ingrediente.trim() !== '') {
        lista.push(`${medida ? medida.trim() : ''} ${ingrediente.trim()}`.trim());
      }
    }

    return lista;
  }

  // cuando el plato viene de "buscar por ingrediente" la API no trae todos los datos,
  // entonces si hace falta info, buscamos el detalle completo por nombre
  verDetalle(plato: ComidaEntidad) {
    if (plato.strInstructions) {
      // ya tiene toda la info, solo lo mostramos
      this.platoSeleccionado.set(plato);
      return;
    }

    this.serviciosComida.recibirDatosC(plato.strMeal).subscribe({
      next: (dato: any) => {
        const completo: ComidaEntidad = dato.meals ? dato.meals[0] : plato;
        completo.precio = plato.precio; // mantenemos el mismo precio random
        this.platoSeleccionado.set(completo);
      },
      error: () => {
        this.platoSeleccionado.set(plato);
      },
    });
  }

  cerrarDetalle() {
    this.platoSeleccionado.set(null);
  }

  // manda el plato al carrito de compras
  agregarAlCarrito(plato: ComidaEntidad) {
    this.servicioCarrito.agregarProducto({
      id: plato.idMeal,
      nombre: plato.strMeal,
      precio: plato.precio,
      imagen: plato.strMealThumb,
      cantidad: 1,
      tipo: 'comida',
    });

    this.carritoConfirmado.set(true);
    setTimeout(() => this.carritoConfirmado.set(false), 1800);
  }
}