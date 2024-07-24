import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoleChangeRequest, RequestStatus } from '../../interfaces/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  requestRoleChange(userId: string, newRole: string): Observable<RoleChangeRequest> {
    const headers = this.getAuthHeaders();
    return this.http.post<RoleChangeRequest>(`${this.baseUrl}/roles/request`, { userId, newRole }, { headers });
  }

  approveRoleChange(requestId: string): Observable<RoleChangeRequest> {
    const headers = this.getAuthHeaders();
    return this.http.put<RoleChangeRequest>(`${this.baseUrl}/roles/approve/${requestId}`, {}, { headers });
  }

  rejectRoleChange(requestId: string): Observable<RoleChangeRequest> {
    const headers = this.getAuthHeaders();
    return this.http.put<RoleChangeRequest>(`${this.baseUrl}/roles/reject/${requestId}`, {}, { headers });
  }

  getAllRoleChangeRequests(): Observable<RoleChangeRequest[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<RoleChangeRequest[]>(`${this.baseUrl}/roles/requests`, { headers });
  }
}