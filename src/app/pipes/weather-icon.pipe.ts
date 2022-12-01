import { Pipe, PipeTransform } from '@angular/core';
import {ForecastPeriod} from "../models/forecast";

@Pipe({
  name: 'weatherIcon'
})
export class WeatherIconPipe implements PipeTransform {
  transform(value: ForecastPeriod, ...args: unknown[]): unknown {
    const date = !!args[0] ? (new Date(args[0] as string)).getTime() : undefined;
    const sunrise = !!args[1] ? (new Date(args[1] as string)).getTime() : undefined;
    const sunset = !!args[2] ? (new Date(args[2] as string)).getTime() : undefined;
    const isNight: boolean = !!date && !!sunset && !!sunrise && (date < sunrise || date > sunset);
    switch (value.weatherCode) {
      case 0:
        if (isNight) {
          return 'assets/weather-clear-night.png';
        }
        return 'assets/weather-clear.png';
      case 1:
      case 2:
        if (isNight) {
          return 'assets/weather-few-clouds-night.png';
        }
        return 'assets/weather-few-clouds.png';
      case 45:
      case 48:
        if (isNight) {
          return 'assets/weather-clouds-night.png';
        }
        return 'assets/weather-clouds.png';
      case 3:
      case 51:
      case 53:
      case 55:
        if (isNight) {
          return 'assets/weather-clouds-night.png';
        }
        return 'assets/weather-clouds.png';
      case 61:
      case 63:
      case 65:
      case 66:
      case 67:
        if (isNight) {
          return 'assets/weather-showers-scattered-night.png';
        }
        return 'assets/weather-showers-scattered-day.png';
      case 80:
      case 81:
      case 82:
        if (isNight) {
          return 'assets/weather-showers-night.png';
        }
        return 'assets/weather-showers-day.png';
      case 71:
      case 73:
      case 75:
      case 77:
      case 85:
      case 86:
        if (isNight) {
          return 'assets/weather-snow-scattered-night.png';
        }
        return 'assets/weather-snow-scattered-day.png';
      case 95:
      case 96:
      case 99:
        if (isNight) {
          return 'assets/weather-showers-scattered-night.png';
        }
        return 'assets/weather-showers-scattered.png';
    }
    return 'assets/weather-none-available.png';
  }

}
