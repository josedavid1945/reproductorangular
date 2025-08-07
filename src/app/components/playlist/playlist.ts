import { Component,inject } from '@angular/core';
import { AsyncPipe } from '@angular/common'; // Necesario para el pipe `async`
import { MusicService, Song } from '../../services/music';

@Component({
  selector: 'app-playlist',
  standalone: true, 
  imports: [AsyncPipe], 
  templateUrl: './playlist.html',
  styleUrls: ['./playlist.css']
})
export class PlaylistComponent {
  musicService= inject(MusicService);
  playlist$ = this.musicService.playlist$;
  currentSong$ = this.musicService.currentSong$;
  

  playSong(song: Song) {
    this.musicService.play(song);
  }
}