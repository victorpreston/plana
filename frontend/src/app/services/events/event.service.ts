import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../../interfaces/event';
import { Category } from '../../interfaces/category';
import { Tag } from '../../interfaces/tag';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

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
}