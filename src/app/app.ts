import { Component } from '@angular/core';
import { PlayerComponent } from './components/player/player';
import { PlaylistComponent } from './components/playlist/playlist';

@Component({
  selector: 'app-root',
  standalone: true, // Se declara como Standalone
  imports: [PlayerComponent, PlaylistComponent], // Importa otros componentes que usa
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}