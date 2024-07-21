import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../../interfaces/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getProfile(userId: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseUrl}/profiles/${userId}`);
  }

  editProfile(userId: string, profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.baseUrl}/profiles/${userId}`, profile);
  }

  changePassword(userId: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/profiles/${userId}/password`, { newPassword });
  }

  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reset-password-request`, { email });
  }

  resetPassword(resetCode: string, email: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reset-password`, { resetCode, email, newPassword });
  }
}