import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MusicService, Song } from '../../services/music';
import { FilterPipe } from '../../pipes/filter-pipe';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [AsyncPipe, FormsModule,FilterPipe],
  templateUrl: './playlist.html',
  styleUrls: ['./playlist.css']
})
export class PlaylistComponent {
  musicService = inject(MusicService);
  playlist$ = this.musicService.playlist$;
  currentSong$ = this.musicService.currentSong$;

  searchTerm: string = '';

  playSong(song: Song) {
    this.musicService.play(song);
  }

  removeSong(song: Song, event: MouseEvent) {
    event.stopPropagation();
    this.musicService.eliminarCancion(song);
  }
}