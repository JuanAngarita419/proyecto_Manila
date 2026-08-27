export interface Carrito {
    id: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
  tipo: 'comida' | 'bebida';
}
