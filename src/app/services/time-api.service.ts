import { Injectable } from '@angular/core';
import {Observable, of, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";

interface TimeApiResponse {
  data: {
    timeZone: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TimeApiService {
  constructor(private readonly httpClient: HttpClient) { }

  getTimeZone(lat: string | number, lon: string | number): Observable<string> {
    const url = `https://wproxy.vengarl.com/api/v1/timezone?lat=${lat}&lon=${lon}`;
    return this.httpClient.get<TimeApiResponse>(url, {headers: {"Accept": "application/json"}}).pipe(
      switchMap((timeApiResponse: TimeApiResponse) => {
        return of(timeApiResponse.data.timeZone);
      })
    );
  }
}
