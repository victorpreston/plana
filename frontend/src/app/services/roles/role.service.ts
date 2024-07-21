import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoleChangeRequest, RequestStatus } from '../../interfaces/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  requestRoleChange(userId: string, newRole: string): Observable<RoleChangeRequest> {
    return this.http.post<RoleChangeRequest>(`${this.baseUrl}/roles/request`, { userId, newRole });
  }

  approveRoleChange(requestId: string): Observable<RoleChangeRequest> {
    return this.http.put<RoleChangeRequest>(`${this.baseUrl}/roles/approve/${requestId}`, {});
  }

  rejectRoleChange(requestId: string): Observable<RoleChangeRequest> {
    return this.http.put<RoleChangeRequest>(`${this.baseUrl}/roles/reject/${requestId}`, {});
  }

  getAllRoleChangeRequests(): Observable<RoleChangeRequest[]> {
    return this.http.get<RoleChangeRequest[]>(`${this.baseUrl}/roles/requests`);
  }
}