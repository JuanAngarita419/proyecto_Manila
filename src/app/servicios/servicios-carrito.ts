import { Injectable, signal, computed } from '@angular/core';
import { Carrito } from '../entidades/entidad-carrito';

@Injectable({
  providedIn: 'root',
})
export class ServicioCarrito {
  // signal con todos los productos que el cliente ha agregado
  productos = signal<Carrito[]>([]);

  // signal calculado con el total a pagar (se recalcula solo cuando cambian los productos)
  total = computed(() =>
    this.productos().reduce((suma, p) => suma + p.precio * p.cantidad, 0)
  );

  // agrega un producto nuevo, o si ya estaba, le suma 1 a la cantidad
  agregar(nuevo: Carrito) {
    const lista = this.productos();
    const yaExiste = lista.find((p) => p.id === nuevo.id);

    if (yaExiste) {
      this.cambiar(nuevo.id, yaExiste.cantidad + 1);
    } else {
      this.productos.set([...lista, nuevo]);
    }
  }

  cambiar(id: string, cantidad: number) {
    this.productos.set(
      this.productos().map((p) => (p.id === id ? { ...p, cantidad } : p))
    );
  }

  eliminar(id: string) {
    this.productos.set(this.productos().filter((p) => p.id !== id));
  }

  vaciar() {
    this.productos.set([]);
  }
}