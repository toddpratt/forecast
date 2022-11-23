import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

export interface GeoData {
  geo: {
    capital: string;
    city: string;
    countryName: string;
    ip: string;
    latitude: number;
    longitude: number;
    regionName: string;
    regionCode: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class WeatherProxyService {

  constructor(private readonly httpClient: HttpClient) {
  }

  getGeoData(): Observable<GeoData> {
    const url = 'https://wproxy.vengarl.com/api/v2/ip';
    return this.httpClient.get<GeoData>(url);
  }
}
