import {Injectable} from '@angular/core';
import {Observable, of, share, switchMap, take} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {GeoIP} from "../models/geo-ip";

export interface GeoResponse {
  city: string;
  country_code: string;
  country_name: string;
  ip: string;
  latitude: number;
  longitude: number;
  region_code: string;
  region: string;
  timezone: string;
  zip_code: string;
}

@Injectable({
  providedIn: 'root'
})
export class IpApiService {

  constructor(private readonly httpClient: HttpClient) {
  }

  getGeoData(): Observable<GeoIP> {
    const url = 'https://ipapi.co/json/';
    return this.httpClient.get<GeoResponse>(url).pipe(
      take(1),
      switchMap(geoResponse => {
        const geoIp: GeoIP = {
          city: geoResponse.city,
          countryCode: geoResponse.country_code,
          countryName: geoResponse.country_name,
          ipAddress: geoResponse.ip,
          latitude: geoResponse.latitude,
          longitude: geoResponse.longitude,
          regionCode: geoResponse.region_code,
          regionName: geoResponse.region,
          timeZone: geoResponse.timezone,
          zipCode: geoResponse.zip_code,
        }
        return of(geoIp);
      }),
      share(),
    );
  }
}
