import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../interfaces/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'http://localhost:5000/api/categories';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  getCategoryById(id: string): Observable<Category> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Category>(url);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, category);
  }

  updateCategory(id: string, category: Category): Observable<Category> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<Category>(url, category);
  }

  deleteCategory(id: string): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
