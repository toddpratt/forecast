import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weatherDescription'
})
export class WeatherDescriptionPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 0:
        return 'Clear Sky';
      case 1:
        return 'Mainly Clear';
      case 2:
        return 'Partly Cloudy';
      case 3:
        return 'Overcast';
      case 45:
      case 48:
        return 'Foggy';
      case 51:
        return 'Light Drizzle';
      case 53:
        return 'Drizzle';
      case 55:
        return 'Dense Drizzle'
      case 61:
        return 'Light Rain';
      case 63:
        return 'Moderate Rain';
      case 65:
        return 'Heavy Rain';
      case 66:
        return 'Freezing Rain';
      case 67:
        return 'Freezing Rain';
      case 80:
        return 'Slight Rain';
      case 81:
        return 'Moderate Rain';
      case 82:
        return 'Violent Rain';
      case 71:
        return 'Slight Snow';
      case 73:
        return 'Moderate Snow';
      case 75:
        return 'Heavy Snow';
      case 77:
        return 'Snow';
      case 85:
        return 'Snow Showers';
      case 86:
        return 'Snow Showers';
      case 95:
      case 96:
      case 99:
        return 'Thunderstorm'
    }
    return 'unknown';
  }

}
