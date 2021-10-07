import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeroeModel } from '../models/heroe.model';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private url = 'https://loginapp-5a62f.firebaseio.com';

  constructor( private http: HttpClient) { }

  borrarHeroe( id: string) {
    return this.http.delete(`${this.url}/heroes/${id}.json`);
  }

  getHeroe( id: string) {
    return this.http.get(`${this.url}/heroes/${id}.json`);
  }

  crearHeroe( heroe: HeroeModel ) {
    return this.http.post(`${this.url}/heroes.json`, heroe) //posteo a firebase 
    .pipe(
      map ( (resp: any) => {
        heroe.id = resp.name;
        return heroe;
      })
    );
  }
  actualizarHeroe(heroe: HeroeModel) {
    const heroeTemp = {
      ...heroe
    };

    delete heroeTemp.id;

    return this.http.put(`${this.url}/heroes/${ heroe.id}.json`, heroeTemp);
  }

  getHeroes() {
    /* return this.http.get(`${this.url}/heroes.json`).pipe( map( resp => this.crearArreglo(resp)) //forma 1
    ); */
    return this.http.get(`${this.url}/heroes.json`).pipe( map( this.crearArreglo), delay(500) //forma 2
    );
  }
  private crearArreglo( heroesObj: object) {

    const heroes: HeroeModel[] = [];

    Object.keys( heroesObj ).forEach( key => {
      const heroe: HeroeModel = heroesObj[key];
      heroe.id = key;

      heroes.push(heroe);
    });
    return heroes;
  }
}
