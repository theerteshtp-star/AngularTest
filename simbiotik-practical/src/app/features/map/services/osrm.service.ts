import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OsrmService {
  constructor(private http: HttpClient) {}
  route(startLng: number, startLat: number, endLng: number, endLat: number): Observable<any> {
    const url = `${environment.osrmBase}/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    return this.http.get(url);
  }
}
