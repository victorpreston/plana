import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../../interfaces/tag';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.baseUrl}/tags`);
  }

  getTagById(id: string): Observable<Tag> {
    return this.http.get<Tag>(`${this.baseUrl}/tags/${id}`);
  }

  createTag(tag: Tag): Observable<Tag> {
    const headers = this.getAuthHeaders();
    return this.http.post<Tag>(`${this.baseUrl}/tags`, tag, { headers });
  }

  updateTag(id: string, tag: Tag): Observable<Tag> {
    const headers = this.getAuthHeaders();
    return this.http.put<Tag>(`${this.baseUrl}/tags/${id}`, tag, { headers });
  }

  deleteTag(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.baseUrl}/tags/${id}`, { headers });
  }
}