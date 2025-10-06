import { Component } from '@angular/core';
import { catchError, debounceTime, of, Subject, switchMap } from 'rxjs';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent {

city = 'Bengaluru';
  query$ = new Subject<string>();
  loading = false;
  error = '';
  current: any;
  forecastAverages: any[] = [];

  constructor(private ws: WeatherService) {}

  ngOnInit() {
    this.query$.pipe(
      debounceTime(400),
      switchMap(q => {
        this.loading = true; this.error = '';
        return this.ws.current(q).pipe(
          catchError(err => { this.error = 'Failed to fetch'; return of(null); })
        );
      })
    ).subscribe((res: any) => {
      this.loading = false;
      if (!res) return;
      this.current = res;
      this.loadForecast(this.city);
    });

    // initial load
    this.search(this.city);
  }

  search(q: string) {
    this.city = q;
    this.query$.next(q);
  }

  loadForecast(c: string) {
    this.ws.forecast5(c).subscribe((resp: any) => {
      this.forecastAverages = this.ws.avgNextDays(resp, 7);
    }, () => { /* handle error gracefully */ });
  }
}
