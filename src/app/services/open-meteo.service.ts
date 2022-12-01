import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of, share, switchMap, take} from "rxjs";
import {DailyForecast, HourlyForecast} from "../models/forecast";

export interface OpenMeteoDailyResponse {
  latitude: number;
  longitude: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    weathercode: number[];
    sunset: string[];
    sunrise: string[];
  }
}

export interface OpenMeteoHourlyResponse {
  latitude: number;
  longitude: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class OpenMeteoService {

  constructor(private readonly httpClient: HttpClient) {
  }

  getDailyForecast(latitude: number | string,
                   longitude: number | string,
                   timeZone: string,
                   units: string): Observable<DailyForecast> {
    const urlComponents = [
      'latitude=' + encodeURIComponent(latitude),
      'longitude=' + encodeURIComponent(longitude),
      'timezone=' + encodeURIComponent(timeZone),
      'temperature_unit=' + encodeURIComponent(units),
      'daily=temperature_2m_min,temperature_2m_max,weathercode,sunrise,sunset',
    ];
    const url = "https://api.open-meteo.com/v1/forecast?" + urlComponents.join('&');
    return this.httpClient.get<OpenMeteoDailyResponse>(url).pipe(
      switchMap(openMeteoResponse => {
        const response: DailyForecast = {
          latitude: openMeteoResponse.latitude,
          longitude: openMeteoResponse.longitude,
          utcOffsetSeconds: openMeteoResponse.utc_offset_seconds,
          timeZone: openMeteoResponse.timezone,
          timeZoneAbbreviation: openMeteoResponse.timezone_abbreviation,
          elevation: openMeteoResponse.elevation,
          days: openMeteoResponse.daily.time.map((date, i) => {
            return {
              date,
              tempMin: openMeteoResponse.daily.temperature_2m_min[i],
              tempMax: openMeteoResponse.daily.temperature_2m_max[i],
              weatherCode: openMeteoResponse.daily.weathercode[i],
              sunset: openMeteoResponse.daily.sunset[i],
              sunrise: openMeteoResponse.daily.sunrise[i],
            }
          })
        };
        return of(response);
      }),
    );
  }

  getHourlyForecast(date: string,
                    latitude: number | string,
                    longitude: number | string,
                    timeZone: string,
                    units: string): Observable<HourlyForecast> {
    const urlComponents = [
      'latitude=' + encodeURIComponent(latitude),
      'longitude=' + encodeURIComponent(longitude),
      'timezone=' + encodeURIComponent(timeZone),
      'temperature_unit=' + encodeURIComponent(units),
      'start_date=' + encodeURIComponent(date),
      'end_date=' + encodeURIComponent(date),
      'hourly=temperature_2m,weathercode',
    ];
    const url = "https://api.open-meteo.com/v1/forecast?" + urlComponents.join('&');
    return this.httpClient.get<OpenMeteoHourlyResponse>(url).pipe(
      switchMap(openMeteoHourlyResponse => {
        const response: HourlyForecast = {
          latitude: openMeteoHourlyResponse.latitude,
          longitude: openMeteoHourlyResponse.longitude,
          elevation: openMeteoHourlyResponse.elevation,
          timeZone: openMeteoHourlyResponse.timezone,
          timeZoneAbbreviation: openMeteoHourlyResponse.timezone_abbreviation,
          utcOffsetSeconds: openMeteoHourlyResponse.utc_offset_seconds,
          hours: openMeteoHourlyResponse.hourly.time.map((temp, i) => {
            return {
              temp: openMeteoHourlyResponse.hourly.temperature_2m[i],
              hour: openMeteoHourlyResponse.hourly.time[i],
              weatherCode: openMeteoHourlyResponse.hourly.weathercode[i],
            }
          }).filter((obj, i) => i % 3 === 0).slice(1, 9)
        };
        return of(response);
      }),
    );
  }
}
