import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, EMPTY, switchMap, tap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {IpApiService} from "./services/ip-api.service";
import {DailyForecast, ForecastDay, HourlyForecast} from "./models/forecast";
import {OpenMeteoService} from "./services/open-meteo.service";
import {MatDialog} from "@angular/material/dialog";
import {LocationDialogComponent} from "./location-dialog/location-dialog.component";
import {Coordinates} from "./services/open-street-map.service";
import {TimeApiService} from "./services/time-api.service";

const ERROR_TEXT = "Unable to retreive forecast data. Please try refreshing the page.";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ready$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  coordinates!: Coordinates;
  dailyForecast!: DailyForecast;
  hourlyForecast!: HourlyForecast;
  timezone!: string;
  units!: string;

  forecastDay!: ForecastDay;

  constructor(private readonly openMeteoService: OpenMeteoService,
              private readonly ipApiService: IpApiService,
              private readonly matSnackBar: MatSnackBar,
              private readonly timeApiService: TimeApiService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.ready$.next(false);
    this.ipApiService.getGeoData().pipe(
      switchMap(geoIP => {
        this.coordinates = {
          lat: geoIP.latitude.toString(),
          lon: geoIP.longitude.toString(),
          display_name: [geoIP.city, geoIP.regionName, geoIP.countryName].filter(n => !!n).join(', '),
        };
        this.timezone = geoIP.timeZone;
        this.units = geoIP.countryCode === 'US' ? 'fahrenheit' : 'celsius';
        return this.openMeteoService.getDailyForecast(geoIP.latitude, geoIP.longitude, this.timezone, this.units);
      }),
      switchMap(dailyForecast => {
        this.dailyForecast = dailyForecast;
        this.forecastDay = dailyForecast.days[0];
        return this.openMeteoService.getHourlyForecast(
          dailyForecast.days[0].date,
          this.coordinates.lat,
          this.coordinates.lon,
          this.timezone,
          this.units
        )
      }),
      catchError(error => {
        console.log(error);
        this.matSnackBar.open(ERROR_TEXT, undefined, {
          verticalPosition: "top"
        });
        return EMPTY;
      }),
    ).subscribe(hourlyForecast => {
      this.hourlyForecast = hourlyForecast;
      this.ready$.next(true);
    });
  }

  setSelectedDay(day: ForecastDay) {
    this.forecastDay = day;
    this.openMeteoService.getHourlyForecast(
      day.date, this.coordinates.lat, this.coordinates.lon, this.timezone, this.units).pipe(
      catchError(error => {
        console.log(error);
        this.matSnackBar.open(ERROR_TEXT, undefined, {
          verticalPosition: "top"
        });
        return EMPTY;
      }),
    ).subscribe(hourlyForecast => {
      this.hourlyForecast = hourlyForecast;
    });
  }

  chooseLocation() {
    this.dialog.open(LocationDialogComponent, {
      disableClose: true
    }).afterClosed().pipe(
      switchMap(coordinates => {
        this.coordinates = coordinates;
        return this.timeApiService.getTimeZone(coordinates.lat, coordinates.lon);
      }),
      switchMap(timezone => {
        this.timezone = timezone;
        return this.openMeteoService.getDailyForecast(
          this.coordinates.lat, this.coordinates.lon, timezone, this.units);
      }),
      switchMap(dailyForecast => {
        this.dailyForecast = dailyForecast;
        this.forecastDay = dailyForecast.days[0];
        return this.openMeteoService.getHourlyForecast(
          dailyForecast.days[0].date,
          this.coordinates.lat,
          this.coordinates.lon,
          this.timezone,
          this.units
        )
      }),
      catchError(error => {
        console.log(error);
        this.matSnackBar.open(ERROR_TEXT, undefined, {
          verticalPosition: "top"
        });
        return EMPTY;
      }),
    ).subscribe(hourlyForecast => {
      this.hourlyForecast = hourlyForecast;
    });
  }

  refresh() {
    this.openMeteoService.getDailyForecast(
      this.coordinates.lat, this.coordinates.lon, this.timezone, this.units).pipe(
      switchMap(dailForecast => {
        this.dailyForecast = dailForecast;
        this.forecastDay = this.dailyForecast.days[0];
        return this.openMeteoService.getHourlyForecast(
          this.dailyForecast.days[0].date,
          this.coordinates.lat,
          this.coordinates.lon,
          this.timezone,
          this.units
        )
      }),
      catchError(error => {
        console.log(error);
        this.matSnackBar.open(ERROR_TEXT, undefined, {
          verticalPosition: "top"
        });
        return EMPTY;
      }),
    ).subscribe(hourlyForecast => {
      this.hourlyForecast = hourlyForecast;
    });
  }
}
