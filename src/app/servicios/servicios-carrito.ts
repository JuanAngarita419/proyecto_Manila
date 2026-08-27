import { Injectable, signal, computed } from '@angular/core';
import { Carrito } from '../entidades/entidad-carrito';

@Injectable({
  providedIn: 'root',
})
export class servicioCarrito {
  // signal con todos los productos que el cliente ha agregado
  productos = signal<Carrito[]>([]);

  // signal calculado con el total a pagar (se recalcula solo cuando cambian los productos)
  total = computed(() =>
    this.productos().reduce((suma, p) => suma + p.precio * p.cantidad, 0)
  );

  // agrega un producto nuevo, o si ya estaba, le suma 1 a la cantidad
  agregarProducto(nuevo: Carrito) {
    const lista = this.productos();
    const yaExiste = lista.find((p) => p.id === nuevo.id);

    if (yaExiste) {
      this.cambiarCantidad(nuevo.id, yaExiste.cantidad + 1);
    } else {
      this.productos.set([...lista, nuevo]);
    }
  }

  cambiarCantidad(id: string, cantidad: number) {
    this.productos.set(
      this.productos().map((p) => (p.id === id ? { ...p, cantidad } : p))
    );
  }

  quitarProducto(id: string) {
    this.productos.set(this.productos().filter((p) => p.id !== id));
  }

  vaciarCarrito() {
    this.productos.set([]);
  }
}