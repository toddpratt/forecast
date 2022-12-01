import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, share, take} from "rxjs";

export interface Coordinates {
  lat: string;
  lon: string;
  display_name: string;
}

export type Locations = Coordinates[];

@Injectable({
  providedIn: 'root'
})
export class OpenStreetMapService {
  constructor(private readonly httpClient: HttpClient) { }

  getLocation(city: string) : Observable<Locations> {
    const url = `https://nominatim.openstreetmap.org/search.php?city=${city}&format=jsonv2`
    return this.httpClient.get<Locations>(url).pipe(take(1), share());
  }
}
