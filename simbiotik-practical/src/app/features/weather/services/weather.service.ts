import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class WeatherService {
  constructor(private http: HttpClient) {}

  current(city: string): Observable<any> {
    const url = `${environment.openWeatherBase}/weather`;
    const params = new HttpParams()
      .set('q', city)
      .set('units', 'metric')
    return this.http.get(url, { params });
  }

  forecast5(city: string): Observable<any> {
    const url = `${environment.openWeatherBase}/forecast`;
    const params = new HttpParams()
      .set('q', city)
      .set('units', 'metric')
    return this.http.get(url, { params });
  }

  avgNextDays(forecastResponse: any, days = 4) {
    const mapByDate = new Map<string, number[]>();
    forecastResponse.list.forEach((entry: any) => {
      const date = entry.dt_txt.split(' ')[0];
      if (!mapByDate.has(date)) mapByDate.set(date, []);
      mapByDate.get(date)!.push(entry.main.temp);
    });
    const averages: { date: string, avgTemp: number }[] = [];
    Array.from(mapByDate.entries()).slice(0, days).forEach(([date, temps]) => {
      const sum = temps.reduce((a,b)=>a+b,0);
      averages.push({ date, avgTemp: Math.round((sum/temps.length)*10)/10 });
    });
    return averages;
  }
}
