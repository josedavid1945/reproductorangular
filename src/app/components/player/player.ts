import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common'; 
import { MusicService } from '../../services/music';

@Component({
  selector: 'app-player',
  standalone: true, 
  imports: [AsyncPipe], 
  templateUrl: './player.html',
  styleUrls: ['./player.css']
})
export class PlayerComponent {
  // La lógica interna no cambia
   musicService= inject(MusicService);
  currentSong$ = this.musicService.currentSong$;
  ejecutando$ = this.musicService.ejecutando$;
  currentTime$ = this.musicService.currentTime$;
  duration$ = this.musicService.duration$;
  repitiendo$ = this.musicService.repitiendo$;
  aleatorio$ = this.musicService.aleatorio$;
 

  togglePlayPause() {
    if (this.musicService.ejecutando$.value) {
      this.musicService.pause();
    } else {
      this.musicService.play();
    }
  }

  nextSong() { this.musicService.next(); }
  prevSong() { this.musicService.previous(); }

  onSeek(event: Event) {
    const input = event.target as HTMLInputElement;
    this.musicService.seek(Number(input.value));
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  banderabucle() {
    this.musicService.banderabucle();
  }

  toggleShuffle() {
    this.musicService.toggleShuffle();
  }
}