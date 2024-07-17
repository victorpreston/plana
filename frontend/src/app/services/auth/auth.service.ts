import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  register(email: string, password: string, firstName: string, lastName: string, phone: string): Observable<User> {
    const url = `${this.baseUrl}/register`;
    const body = { email, password, firstName, lastName, phone };
    return this.http.post<User>(url, body);
  }

  login(email: string, password: string): Observable<{ user: User; token: string }> {
    const url = `${this.baseUrl}/login`;
    const body = { email, password };
    return this.http.post<{ user: User; token: string }>(url, body);
  }
}