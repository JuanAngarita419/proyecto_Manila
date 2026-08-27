import { Routes } from '@angular/router';
import { Comida } from './comida/comida';
import { Bebidas } from './bebidas/bebidas';
import { Juego } from './juego/juego';
import { Carrusel } from './carrusel/carrusel';
import { Logo } from './logo/logo';
import { Carrito } from './carrito/carrito';

export const routes: Routes = [
    { path: 'comida', component: Comida },
    { path: 'bebidas', component: Bebidas },
    { path: 'juego', component: Juego },
    {path: 'carrusel', component: Carrusel},
    {path: 'logo', component: Logo},
    {path: 'carrito', component: Carrito},
    { path: '**', redirectTo: '' }
];
