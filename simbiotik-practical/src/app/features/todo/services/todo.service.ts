import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface Todo {
  id?: number;
  title: string;
  description?: string;
  completed?: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  base = `${environment.simbiotikApiBase}/todos`; 
  constructor(private http: HttpClient) {}

  list(): Observable<Todo[]> { return this.http.get<Todo[]>(this.base); }
  get(id: number): Observable<Todo> { return this.http.get<Todo>(`${this.base}/${id}`); }
  create(todo: Todo) { return this.http.post<Todo>(this.base, todo); }
  update(id: number, todo: Partial<Todo>) { return this.http.put<Todo>(`${this.base}/${id}`, todo); }
  delete(id: number) { return this.http.delete(`${this.base}/${id}`); }
}
