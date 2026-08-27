import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { servicioBebida } from '../servicios/servicios-bebida';
import { serviciosComida } from '../servicios/servicios-comida';

@Component({
  selector: 'app-juego',
  standalone: true,
  templateUrl: './juego.html',
  styleUrl: './juego.css',
})
export class Juego implements OnInit {
  casillas: number[] = Array.from({ length: 16 }, (_, i) => i + 1);
  posicion: number = 0;
  posicion2: number = 0;
  letrero: string = "";
  contadorAciertos: number = 0;
  imagenPlato: string = "";
  imagenBebida: string = "";

  constructor(
    private detector: ChangeDetectorRef,
    private serviciosComida: serviciosComida,
    private servicioBebida: servicioBebida
  ) {}

  ngOnInit(): void {
    this.posicion = Math.floor(Math.random() * 16) + 1;
    this.posicion2 = Math.floor(Math.random() * 16) + 1;
    while (this.posicion2 === this.posicion) {
      this.posicion2 = Math.floor(Math.random() * 16) + 1;
    }

    this.serviciosComida.traerComidaAleatoria().subscribe((respuesta) => {
      this.imagenPlato = respuesta.meals?.[0]?.strMealThumb ?? "";
      this.actualizarImagenRevelada(this.posicion, this.imagenPlato);
    });
    this.servicioBebida.traerBebidaAleatoria().subscribe((respuesta) => {
      this.imagenBebida = respuesta.drinks?.[0]?.strDrinkThumb ?? "";
      this.actualizarImagenRevelada(this.posicion2, this.imagenBebida);
    });
  }

  private actualizarImagenRevelada(posicion: number, imagen: string) {
    const img = document.getElementById("img" + posicion) as HTMLImageElement;
    if (img?.style.display === "block" && imagen) {
      img.src = imagen;
    }
  }

  reiniciar() {
    this.casillas.forEach(i => {
      const img = document.getElementById("img" + i) as HTMLImageElement;
      const boton = document.getElementById("tablero" + i) as HTMLButtonElement;
      
      if (img) {
        // Limpiar completamente la imagen
        img.style.display = "none";
        img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect fill='%23ffffff' width='1' height='1'/%3E%3C/svg%3E";
        img.style.backgroundColor = "transparent";
        img.alt = "";
        
        // Limpiar event listeners
        img.onerror = null;
        img.onload = null;
      }
      
      if (boton) {
        // Restaurar el botón a su estado inicial
        const signo = boton.querySelector('.signo-pregunta') as HTMLElement;
        if (signo) {
          signo.style.display = "inline";
        }
      }
    });
    
    this.contadorAciertos = 0;
    this.letrero = "";
    this.imagenPlato = "";
    this.imagenBebida = "";
    this.ngOnInit();
    this.detector.detectChanges();
  }

  descubrirO(p: number) {
    const img = document.getElementById("img" + p) as HTMLImageElement;
    
    if (!img || img.style.display === "block" || this.contadorAciertos === 2) return;

    if (p === this.posicion || p === this.posicion2) {
      const imagenURL = p === this.posicion ? this.imagenPlato : this.imagenBebida;
      if (imagenURL) {
        img.style.display = "block";
        img.style.backgroundColor = "#ffffff";
        img.src = imagenURL;
        
        // Manejo de error: si la imagen no carga, mostrar solo fondo blanco
        const timeoutId = setTimeout(() => {
          if (img.style.display === "block") {
            img.style.backgroundColor = "#ffffff";
            img.alt = "";
          }
        }, 2000);
        
        img.onerror = () => {
          clearTimeout(timeoutId);
          img.style.backgroundColor = "#ffffff";
          img.style.display = "block";
          img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect fill='%23ffffff' width='1' height='1'/%3E%3C/svg%3E";
          img.alt = "";
        };
        
        img.onload = () => {
          clearTimeout(timeoutId);
          img.style.backgroundColor = "transparent";
        };
        
        this.contadorAciertos++;
      }
    } else {
      img.style.display = "block";
      img.style.backgroundColor = "#ffffff";
      img.src = "/img/blanco.jpg";
      
      const timeoutId = setTimeout(() => {
        img.style.backgroundColor = "#ffffff";
      }, 2000);
      
      img.onerror = () => {
        clearTimeout(timeoutId);
        img.style.backgroundColor = "#ffffff";
        img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect fill='%23ffffff' width='1' height='1'/%3E%3C/svg%3E";
        img.alt = "";
      };
      
      img.onload = () => {
        clearTimeout(timeoutId);
      };
    }

    if (this.contadorAciertos === 2) {
      const mensajes = [
        "¡LO HICISTE! 🤯",
        "¡ERES UN CRACK! 🌟",
        "¡COMBINAZO PERFECTO! 🔥",
        "¡QUÉ MATCH! 💯",
        "¡INCREÍBLE! 🚀",
        "¡PAREJA GANADORA! 💑",
        "¡TIENES BUEN PALADAR! 😋",
        "¡NAILED IT! 🎯",
        "¡CAMPEÓN/A! 👑",
        "¡BRAVO! 🎊",
        "¡DAME UN ABRAZO! 🤗",
        "¡FUERA DE SERIE! ⭐"
      ];
      const indiceAleatorio = Math.floor(Math.random() * mensajes.length);
      this.letrero = mensajes[indiceAleatorio];
    }
  }
}