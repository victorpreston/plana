import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../../interfaces/booking';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  createBooking(booking: Booking): Observable<Booking> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Booking>(`${this.baseUrl}/bookings`, booking, { headers });
  }

  getRecentBookings(): Observable<Booking[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings`, { headers });
  }

  getBookingById(id: string): Observable<Booking> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Booking>(`${this.baseUrl}/bookings/${id}`, { headers });
  }

  getUserBookings(): Observable<Booking[]> { 
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings/user`, { headers });
  }

  updateBooking(id: string, booking: Booking): Observable<Booking> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Booking>(`${this.baseUrl}/bookings/${id}`, booking, { headers });
  }

  deleteBooking(id: string): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.baseUrl}/bookings/${id}`, { headers });
  }

  verifyTicketCode(ticketCode: string): Observable<Booking> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Booking>(`${this.baseUrl}/bookings/verify/${ticketCode}`, { headers });
  }

  getBookingsForEvent(eventId: string): Observable<Booking[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings/event/${eventId}`, { headers });
  }
}
