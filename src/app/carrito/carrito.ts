import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioCarrito } from '../servicios/servicios-carrito';
import { Carrito as ItemCarrito } from '../entidades/entidad-carrito';
import { DatosCliente } from '../entidades/entidad-datos-cliente';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  // datos del cliente, agrupados en la entidad DatosCliente
  datosCliente: DatosCliente = {
    nombre: '',
    celular: '',
    direccion: '',
  };

  mensajeError = signal('');

  constructor(public carrito: ServicioCarrito) {}

  aumentar(item: ItemCarrito) {
    this.carrito.cambiar(item.id, item.cantidad + 1);
  }

  disminuir(item: ItemCarrito) {
    if (item.cantidad > 1) {
      this.carrito.cambiar(item.id, item.cantidad - 1);
    }
  }

  eliminar(item: ItemCarrito) {
    this.carrito.eliminar(item.id);
  }

  realizarPedido() {
    this.mensajeError.set('');

    if (this.carrito.productos().length === 0) {
      this.mensajeError.set('Tu carrito está vacío.');
      return;
    }

    if (
      !this.datosCliente.nombre.trim() ||
      !this.datosCliente.celular.trim() ||
      !this.datosCliente.direccion.trim()
    ) {
      this.mensajeError.set('Completa tus datos antes de realizar el pedido.');
      return;
    }

    this.generarPdf();
  }

  // arma el pdf del pedido y lo descarga
  generarPdf() {
    const doc = new jsPDF();
    const productos = this.carrito.productos();
    const total = this.carrito.total();

    // --- logo dibujado a mano (insignia con tazón y palillos, igual al de la página) ---
    doc.setFillColor(230, 57, 70);
    doc.roundedRect(14, 9, 20, 20, 4, 4, 'F');

    doc.setFillColor(255, 255, 255);
    doc.ellipse(24, 23.5, 5.5, 3.2, 'F');

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.9);
    doc.line(18.5, 19.5, 29.5, 19.5);
    doc.line(20, 11, 27, 17.5);
    doc.line(28, 10.3, 21, 17.5);

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(18);
    doc.text('Restaurante Manila', 40, 24);

    // --- fecha actual ---
    const fecha = new Date().toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha del pedido: ${fecha}`, 14, 40);

    // --- datos del cliente ---
    doc.setFont('helvetica', 'bold');
    doc.text('Datos del cliente', 14, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${this.datosCliente.nombre}`, 14, 59);
    doc.text(`Celular: ${this.datosCliente.celular}`, 14, 66);
    doc.text(`Dirección: ${this.datosCliente.direccion}`, 14, 73);

    // --- encabezado de la tabla del pedido ---
    let y = 88;
    doc.setFont('helvetica', 'bold');
    doc.text('Producto', 14, y);
    doc.text('Cant.', 115, y);
    doc.text('Precio unit.', 138, y);
    doc.text('Subtotal', 172, y);
    doc.line(14, y + 2, 196, y + 2);

    doc.setFont('helvetica', 'normal');
    y += 9;

    // --- una fila por cada producto del carrito ---
    productos.forEach((p) => {
      const subtotal = p.precio * p.cantidad;

      doc.text(p.nombre.substring(0, 45), 14, y);
      doc.text(String(p.cantidad), 118, y);
      doc.text(`$${p.precio.toLocaleString('es-CO')}`, 138, y);
      doc.text(`$${subtotal.toLocaleString('es-CO')}`, 172, y);

      y += 8;

      // si la hoja se llena, seguimos en una página nueva
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.line(14, y + 2, 196, y + 2);
    y += 12;

    // --- total a pagar ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`Total a pagar: $${total.toLocaleString('es-CO')}`, 14, y);

    doc.save(`pedido-manila-${Date.now()}.pdf`);

    // una vez descargado el pedido, se limpia el carrito y el formulario
    this.carrito.vaciar();
    this.datosCliente = { nombre: '', celular: '', direccion: '' };
  }
}