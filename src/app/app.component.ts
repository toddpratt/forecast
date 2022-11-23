import {Component, OnDestroy, OnInit} from '@angular/core';
import {catchError, EMPTY, Observable, share, switchMap, take, tap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {GeoData, WeatherProxyService} from "./services/weather-proxy.service";
import {NationalWeatherService, NwsAlertResponse, NwsPeriod} from "./services/national-weather.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  geo$!: Observable<GeoData>;
  periods!: NwsPeriod[][];
  current: (NwsPeriod | null)[] = [null, null];
  alert$!: Observable<NwsAlertResponse>;

  constructor(private readonly nationalWeatherService: NationalWeatherService,
              private readonly weatherProxyService: WeatherProxyService,
              private readonly matSnackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.geo$ = this.weatherProxyService.getGeoData().pipe(take(1), share());
    this.geo$.pipe(
      switchMap(geoData => {
        this.alert$ = this.nationalWeatherService.getAlerts(geoData.geo.regionCode);
        return this.nationalWeatherService.getForecastByCoordinates(
          geoData.geo.latitude,
          geoData.geo.longitude
        );
      }),
      tap(nwsResponse => {
        const periods = nwsResponse.properties.periods;
        if (periods[0].isDaytime) {
          this.current = [periods[0], periods[1]]
          const days = periods.slice(2, 14).filter((p, i) => i % 2 == 0);
          const nights = periods.slice(2, 14).filter((p, i) => i % 2 == 1);
          this.periods = days.map((p, i) => [p, nights[i]]);
        } else {
          this.current = [periods[0]]
          const days = periods.slice(1, 11).filter((p, i) => i % 2 == 0);
          const nights = periods.slice(1, 11).filter((p, i) => i % 2 == 1);
          this.periods = days.map((p, i) => [p, nights[i]]);
        }
      }),
      catchError(err => {
        console.log(err);
        this.matSnackBar.open("Failed to find your forecast.", "Dismiss", {verticalPosition: "top"});
        return EMPTY;
      })
    ).subscribe();
  }

  ngOnDestroy() {
    // this.geo$.un
  }
}
