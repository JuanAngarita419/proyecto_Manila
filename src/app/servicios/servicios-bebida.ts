import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class servicioBebida {
  private urlBase = 'https://www.thecocktaildb.com/api/json/v1/1/';

  constructor(private http: HttpClient) {}

  // busca por nombre
  buscarPorNombre(nombre: string = ''): Observable<any> {
    return this.http.get(`${this.urlBase}search.php?s=${nombre}`);
  }

  // busca por ingrediente (ej: vodka, gin, ron)
  buscarPorIngrediente(ingrediente: string): Observable<any> {
    return this.http.get(`${this.urlBase}filter.php?i=${ingrediente}`);
  }

  // trae bebidas con alcohol o sin alcohol
  // tipo tiene que ser "Alcoholic" o "Non_Alcoholic"
  buscarPorTipo(tipo: string): Observable<any> {
    return this.http.get(`${this.urlBase}filter.php?a=${tipo}`);
  }

  // trae 1 bebida al azar (para mostrar en el inicio como "Bebida Popular")
  traerBebidaAleatoria(): Observable<any> {
    return this.http.get(`${this.urlBase}random.php`);
  }

  // busca el detalle completo de una bebida por su id
  buscarDetallePorId(id: string): Observable<any> {
    return this.http.get(`${this.urlBase}lookup.php?i=${id}`);
  }

  // con la key gratis no se puede pedir "todas las bebidas" de una vez,
  // entonces pedimos letra por letra (a, b, c...) y las juntamos en una sola lista
  traerTodasLasBebidas(): Observable<any> {
    const letras = 'abcdefghijklmnopqrstuvwxyz'.split('');

    const peticiones = letras.map((letra) =>
      this.http.get(`${this.urlBase}search.php?f=${letra}`)
    );

    return forkJoin(peticiones).pipe(
      map((respuestas: any[]) => {
        let todas: any[] = [];

        respuestas.forEach((resp) => {
          if (resp && resp.drinks) {
            todas = todas.concat(resp.drinks);
          }
        });

        return { drinks: todas };
      })
    );
  }
}