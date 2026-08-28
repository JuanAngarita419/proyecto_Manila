import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ServicioBebida } from '../servicios/servicios-bebida';
import { ServicioComida } from '../servicios/servicios-comida';

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
src: any;

  constructor(
    private detector: ChangeDetectorRef,
    private comidaApi: ServicioComida,
    private bebidaApi: ServicioBebida
  ) {}

  ngOnInit(): void {
    this.posicion = Math.floor(Math.random() * 16) + 1;
    this.posicion2 = Math.floor(Math.random() * 16) + 1;
    while (this.posicion2 === this.posicion) {
      this.posicion2 = Math.floor(Math.random() * 16) + 1;
    }

    this.comidaApi.aleatoria().subscribe((respuesta) => {
      this.imagenPlato = respuesta.meals?.[0]?.strMealThumb ?? "";
      this.actualizarImagenRevelada(this.posicion, this.imagenPlato);
    });
    this.bebidaApi.aleatoria().subscribe((respuesta) => {
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
      if (img) {
        img.style.display = "none";
        img.src = "";
      }
      document.getElementById("tablero" + i)?.classList.remove("tarjeta-blanca");
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
        img.src = imagenURL;
        img.style.display = "block";
        this.contadorAciertos++;
      }
    } else {
      document.getElementById("tablero" + p)?.classList.add("tarjeta-blanca");
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