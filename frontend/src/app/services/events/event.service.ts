import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../../interfaces/event';
import { Category } from '../../interfaces/category';
import { Tag } from '../../interfaces/tag';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class EventService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/events`);
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/events/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.baseUrl}/tags`);
  }

  getUniqueLocations(): Observable<string[]> {
    return this.getAllEvents().pipe(
      map(events => Array.from(new Set(events.map(event => event.location))))
    );
  }

  getTicketTypes(): Observable<string[]> {
    return this.getAllEvents().pipe(
      map(events => Array.from(new Set(events.flatMap(event => event.ticketTypes.map(ticket => ticket.type)))))
    );
  }
  
  getEventsByManager(managerId: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/events/manager/${managerId}`, { headers: this.getAuthHeaders() });
  }

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${this.baseUrl}/events`, event, { headers: this.getAuthHeaders() });
  }

  updateEvent(id: string, event: Event): Observable<Event> {
    console.log('Update Event Payload:', event); 
    return this.http.put<Event>(`${this.baseUrl}/events/${id}`, event, { headers: this.getAuthHeaders() });
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/events/${id}`, { headers: this.getAuthHeaders() });
  }
}