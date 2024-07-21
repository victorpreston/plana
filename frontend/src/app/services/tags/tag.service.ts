
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../../interfaces/tag';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.baseUrl}/tags`);
  }

  getTagById(id: string): Observable<Tag> {
    return this.http.get<Tag>(`${this.baseUrl}/tags/${id}`);
  }

  createTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(`${this.baseUrl}/tags`, tag);
  }

  updateTag(id: string, tag: Tag): Observable<Tag> {
    return this.http.put<Tag>(`${this.baseUrl}/tags/${id}`, tag);
  }

  deleteTag(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tags/${id}`);
  }
}