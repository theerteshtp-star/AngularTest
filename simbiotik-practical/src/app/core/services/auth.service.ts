import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const raw = localStorage.getItem('currentUser');
    if (raw) this.currentUserSubject.next(JSON.parse(raw));
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.simbiotikApiBase}/users/login`, { username, password })
      .pipe(tap(res => {
        if (res && res.accessToken) {
          const user: User = { id: res.id ?? 0, username, token: res.accessToken };
          console.log(user);
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return this.currentUserSubject.value?.token ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
