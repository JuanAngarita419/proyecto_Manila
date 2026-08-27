import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, Logo],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.css',
})
export class Navegacion {}
