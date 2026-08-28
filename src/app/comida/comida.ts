import { Component, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ServicioComida } from '../servicios/servicios-comida';
import { ServicioCarrito } from '../servicios/servicios-carrito';
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

  // true = se muestra agrupado por categoría (vista inicial), false = se muestra la búsqueda
  mostrandoCategorias = signal(true);
  categorias = signal<{ nombre: string; platos: ComidaEntidad[] }[]>([]);

  // signal para el plato que se ve en el detalle (null = cerrado)
  platoSeleccionado = signal<ComidaEntidad | null>(null);
  carritoConfirmado = signal(false);
  mostrarBotonSubir = signal(false);

  filtro = 'nombre';
  texto = '';

  // la API trae las categorías en inglés, aquí las traducimos para mostrarlas
  categoriasTraducidas: { [nombre: string]: string } = {
    Beef: 'Res',
    Chicken: 'Pollo',
    Dessert: 'Postre',
    Lamb: 'Cordero',
    Miscellaneous: 'Variado',
    Pasta: 'Pasta',
    Pork: 'Cerdo',
    Seafood: 'Mariscos',
    Side: 'Acompañamiento',
    Starter: 'Entrada',
    Vegan: 'Vegano',
    Vegetarian: 'Vegetariano',
    Breakfast: 'Desayuno',
    Goat: 'Cabra',
  };

  // devuelve el nombre en español, o el original si no está en el diccionario
  traducirCategoria(nombre: string): string {
    return this.categoriasTraducidas[nombre] || nombre;
  }

  constructor(
    private comidaApi: ServicioComida,
    public carrito: ServicioCarrito
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
    // se manda a los 3 por si el scroll real no está pasando en "window"
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // pone un precio random a cada plato, entre 10.000 y 45.000
  ponerPrecios(lista: ComidaEntidad[]): ComidaEntidad[] {
    return lista.map((plato) => ({
      ...plato,
      precio: Math.floor(Math.random() * (45000 - 10000 + 1)) + 10000,
    }));
  }

  // junta los platos según su categoría (strCategory), para la vista inicial
  agruparPorCategoria(lista: ComidaEntidad[]) {
    const mapa = new Map<string, ComidaEntidad[]>();

    lista.forEach((plato) => {
      const nombreCategoria = plato.strCategory || 'Otros';

      if (!mapa.has(nombreCategoria)) {
        mapa.set(nombreCategoria, []);
      }

      mapa.get(nombreCategoria)!.push(plato);
    });

    const grupos = Array.from(mapa.entries()).map(([nombre, platos]) => ({
      nombre,
      platos,
    }));

    this.categorias.set(grupos);
  }

  // trae todas las comidas (letra por letra) o busca por nombre si le paso texto
  buscarTodo(texto: string = '') {
    this.mostrandoCategorias.set(!texto);

    const peticion = texto
      ? this.comidaApi.buscarPorNombre(texto)
      : this.comidaApi.listarTodas();

    this.cargarResultados(peticion);
  }

  buscar() {
    const texto = this.texto.trim();

    if (!texto) {
      this.buscarTodo();
      return;
    }

    this.mostrandoCategorias.set(false);

    const peticion =
      this.filtro === 'ingrediente'
        ? this.comidaApi.buscarPorIngrediente(texto)
        : this.comidaApi.buscarPorNombre(texto);

    this.cargarResultados(peticion);
  }

  private cargarResultados(peticion: Observable<any>): void {
    this.cargando.set(true);
    this.hayError.set(false);

    peticion.subscribe({
      next: (dato: any) => {
        const lista = this.ponerPrecios(dato.meals ?? []);
        this.comidas.set(lista);

        if (this.mostrandoCategorias()) {
          this.agruparPorCategoria(lista);
        }

        this.cargando.set(false);
      },
      error: (error) => {
        console.error('error API:', error);
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

    this.comidaApi.buscarPorNombre(plato.strMeal).subscribe({
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
    this.carrito.agregar({
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