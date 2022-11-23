import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, retry, share, switchMap, take} from "rxjs";

type param = string | number;

export interface NwsPoints {
  properties: {
    gridId: string;
    gridX: number;
    gridY: number;
    forecast: string;
  }
}

export interface NwsPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

export interface NwsForecast {
  properties: {
    periods: NwsPeriod[];
  }
}

export interface NwsAlertResponse {
  features: {
    properties: {
      certainty: string;
      headline: string;
    }
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class NationalWeatherService {
  constructor(private readonly httpClient: HttpClient) {
  }

  getPoints(lat: param, lon: param): Observable<NwsPoints> {
    const url = `https://api.weather.gov/points/${lat},${lon}`
    return this.httpClient.get<NwsPoints>(url).pipe(
      retry(3),
      take(1),
      share()
    );
  }

  getForecastByCoordinates(lat: param, lon: param): Observable<NwsForecast> {
    return this.getPoints(lat, lon).pipe(
      switchMap((nwsPoints: NwsPoints): Observable<NwsForecast> => {
        return this.httpClient.get<NwsForecast>(nwsPoints.properties.forecast).pipe(
          retry(3),
          take(1),
          share()
        );
      })
    )
  }

  getAlerts(state: string): Observable<NwsAlertResponse> {
    const url = `https://api.weather.gov/alerts/active?area=${state}`;
    return this.httpClient.get<NwsAlertResponse>(url);
  }
}
