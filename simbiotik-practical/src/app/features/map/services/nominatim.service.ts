import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NominatimService {
  constructor(private http: HttpClient) {}

  search(query: string): Observable<any> {
    const params = new HttpParams().set('format', 'json').set('q', query);
    return this.http.get(environment.nominatimBase, { params });
  }
}
