import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicioComida {
  private urlBase = 'https://www.themealdb.com/api/json/v1/1/';

  constructor(private http: HttpClient) {}

  // busca por nombre (o texto que escriba el usuario)
  buscarPorNombre(nombre: string = ''): Observable<any> {
    return this.http.get(`${this.urlBase}search.php?s=${nombre}`);
  }

  recibirDatosC(nombre: string = ''): Observable<any> {
    return this.buscarPorNombre(nombre);
  }

  // filtra por ingrediente
  buscarPorIngrediente(ingrediente: string): Observable<any> {
    return this.http.get(`${this.urlBase}filter.php?i=${ingrediente}`);
  }

  // trae 1 comida al azar (para mostrar en el inicio como "Comida Popular")
  aleatoria(): Observable<any> {
    return this.http.get(`${this.urlBase}random.php`);
  }

  traerComidaAleatoria(): Observable<any> {
    return this.aleatoria();
  }

  // con la key gratis no se puede pedir "todo" de una sola vez,
  // entonces pedimos las comidas letra por letra (a, b, c...) y las juntamos
  listarTodas(): Observable<any> {
    const letras = 'abcdefghijklmnopqrstuvwxyz'.split('');

    const peticiones = letras.map((letra) =>
      this.http.get(`${this.urlBase}search.php?f=${letra}`)
    );

    return forkJoin(peticiones).pipe(
      map((respuestas: any[]) => {
        let todas: any[] = [];

        respuestas.forEach((resp) => {
          if (resp && resp.meals) {
            todas = todas.concat(resp.meals);
          }
        });

        return { meals: todas };
      })
    );
  }
}

export { ServicioComida as serviciosComida };