export interface ForecastPeriod {
  weatherCode: number;
}

export interface ForecastDay extends ForecastPeriod {
  date: string;
  tempMin: number;
  tempMax: number;
  sunset: string;
  sunrise: string;
}

export interface DailyForecast {
  latitude: number;
  longitude: number;
  utcOffsetSeconds: number;
  timeZone: string;
  timeZoneAbbreviation: string;
  elevation: number;
  days: ForecastDay[];
}

export interface ForecastHour extends ForecastPeriod{
  hour: string;
  temp: number;
}

export interface HourlyForecast {
  latitude: number;
  longitude: number;
  utcOffsetSeconds: number;
  timeZone: string;
  timeZoneAbbreviation: string;
  elevation: number;
  hours: ForecastHour[];
}
