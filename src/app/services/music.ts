import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

/**
 * Define la estructura de datos para una canción en la aplicación.
 */
export interface Song {
  titulo: string;
  artista: string;
  url: string;
  albumArt: string;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  // --- Estado Interno del Servicio ---
  private audio: HTMLAudioElement;
  private playlist: Song[] = [];
  private originalPlaylist: Song[] = []; 
  private currentSongIndex = 0;
  private aleatorio = false;
  private repitiendo = false;

  // --- Observables  ---
  public currentSong$ = new BehaviorSubject<Song | null>(null);
  public ejecutando$ = new BehaviorSubject<boolean>(false);
  public playlist$ = new BehaviorSubject<Song[]>([]);
  public currentTime$ = new BehaviorSubject<number>(0);
  public duration$ = new BehaviorSubject<number>(0);
  public aleatorio$ = new BehaviorSubject<boolean>(this.aleatorio);
  public repitiendo$ = new BehaviorSubject<boolean>(this.repitiendo);

  // --- Configuración de la API ---
  private clientId = 'fb80efce'; // Tu client_id
  private apiUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${this.clientId}&format=jsonpretty&limit=20&fuzzytags=groove+rock&include=musicinfo`;
  private http= inject(HttpClient)
  constructor() {
    this.audio = new Audio();
    this.cargarcanciones();

    // --- Eventos Nativos del Elemento Audio ---
    this.audio.addEventListener('ended', () => {
      if (!this.audio.loop) {
        this.next();
      }
    });
    this.audio.addEventListener('timeupdate', () => this.currentTime$.next(this.audio.currentTime));
    this.audio.addEventListener('loadedmetadata', () => this.duration$.next(this.audio.duration));
  }
  
  /**
   * Carga la lista de canciones inicial desde la API de Jamendo.
   */
  private cargarcanciones() {
    this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        const tracks = response.results.filter((track: any) => track.audio && track.image);
        return tracks.map((track: any): Song => ({
          titulo: track.name,
          artista: track.artist_name,
          url: track.audio,
          albumArt: track.image,
          duration: track.duration
        }));
      }),
      tap((songs: Song[]) => {
        if (songs.length > 0) {
          this.playlist = [...songs];
          this.originalPlaylist = [...songs]; 
          this.playlist$.next(this.playlist);
          this.loadSong(this.playlist[this.currentSongIndex]);
        }
      }),
      catchError(error => {
        console.error('MusicService: ¡No se pudo llamar la api papi!', error);
        return throwError(() => new Error('Vaya a spotify nomas.'));
      })
    ).subscribe();
  }

  /**
   * 
   * @param song 
   */
  private loadSong(song: Song) {
    this.currentSong$.next(song);
    this.audio.src = song.url;
  }

  // --- Controles de Reproducción Principales ---

  play(song?: Song) {
    if (song) {
      this.currentSongIndex = this.playlist.findIndex(s => s.url === song.url);
      this.loadSong(song);
    }
    this.audio.play();
    this.ejecutando$.next(true);
  }

  pause() {
    this.audio.pause();
    this.ejecutando$.next(false);
  }

  next() {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
    const nextSong = this.playlist[this.currentSongIndex];
    this.play(nextSong);
  }

  previous() {
    this.currentSongIndex = (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
    const prevSong = this.playlist[this.currentSongIndex];
    this.play(prevSong);
  }

  seek(timeInSeconds: number) {
    this.audio.currentTime = timeInSeconds;
  }

  // --- Funciones de Loop y Shuffle ---

  banderabucle() {
    this.repitiendo = !this.repitiendo;
    this.audio.loop = this.repitiendo; 
    this.repitiendo$.next(this.repitiendo);
  }

  toggleShuffle() {
    this.aleatorio = !this.aleatorio;

    if (this.aleatorio) {
      this.randoms();
    } else {
      const currentSong = this.currentSong$.value;
      this.playlist = [...this.originalPlaylist];
      if (currentSong) {
        this.currentSongIndex = this.playlist.findIndex(s => s.url === currentSong.url);
      }
    }
    this.playlist$.next(this.playlist);
    this.aleatorio$.next(this.aleatorio);
  }

  /**
   * Mezcla la lista de reproducción usando el algoritmo Fisher-Yates.
   */
  private randoms() {
    let currentIndex = this.playlist.length;
    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [this.playlist[currentIndex], this.playlist[randomIndex]] = [this.playlist[randomIndex], this.playlist[currentIndex]];
    }
  }
}