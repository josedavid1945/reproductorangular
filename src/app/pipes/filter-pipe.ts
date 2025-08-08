import { Pipe, PipeTransform } from '@angular/core';
import { Song } from '../services/music';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(songs: Song[] | null, searchTerm: string): Song[] {
    if (!songs) {
      return [];
    }
    if (!searchTerm) {
      return songs;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return songs.filter(song => 
      song.titulo.toLowerCase().includes(lowerCaseSearchTerm) ||
      song.artista.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }
}