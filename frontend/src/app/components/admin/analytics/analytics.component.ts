import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { EventService } from '../../../services/events/event.service';
import { BookingService } from '../../../services/bookings/booking.service';
import { AuthService } from '../../../services/auth/auth.service';
import { User } from '../../../interfaces/user';
import { Event } from '../../../interfaces/event';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  totalEvents: number = 0;
  totalBookings: number = 0;
  totalTickets: number = 0;
  totalUsers: number = 0;
  totalAttendees: number = 0;
  totalManagers: number = 0;
  totalUniqueLocations: number = 0;
  mostBookedEvents: { title: string, bookingsCount: number, date: string, location: string }[] = [];

  @ViewChild('firstGraph') firstGraph!: ElementRef<HTMLCanvasElement>;
  @ViewChild('secondGraph') secondGraph!: ElementRef<HTMLCanvasElement>;

  constructor(
    private eventService: EventService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchData();
    this.fetchMostBookedEvents();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initFirstGraph();
      this.initSecondGraph();
    }, 0);
  }

  fetchData(): void {
    this.eventService.getAllEvents().subscribe(events => {
      this.totalEvents = events.length;
      this.totalUniqueLocations = new Set(events.map(event => event.location)).size;
    });

    this.bookingService.getRecentBookings().subscribe(bookings => {
      this.totalBookings = bookings.length;
      this.totalTickets = bookings.reduce((total, booking) => total + booking.tickets, 0);
    });

    this.authService.getAllUsers().subscribe(users => {
      this.totalUsers = users.length;
      this.totalAttendees = users.filter(user => user.role === 'ATTENDEE').length;
      this.totalManagers = users.filter(user => user.role === 'MANAGER').length;
    });
  }

  fetchMostBookedEvents(): void {
    this.bookingService.getRecentBookings().subscribe(bookings => {
      const bookingCounts: { [eventId: string]: number } = {};
      bookings.forEach(booking => {
        bookingCounts[booking.eventId] = (bookingCounts[booking.eventId] || 0) + 1;
      });

      const eventIds = Object.keys(bookingCounts);
      const eventsWithMostBookings: { title: string, bookingsCount: number, date: string, location: string }[] = [];

      this.eventService.getAllEvents().subscribe(events => {
        eventIds.forEach(eventId => {
          const event = events.find(e => e.id === eventId);
          if (event) {
            eventsWithMostBookings.push({
              title: event.title,
              bookingsCount: bookingCounts[eventId],
              date: event.date.toISOString(),
              location: event.location
            });
          }
        });

        this.mostBookedEvents = eventsWithMostBookings.sort((a, b) => b.bookingsCount - a.bookingsCount).slice(0, 5);
      });
    });
  }

  initFirstGraph(): void {
    new Chart(this.firstGraph.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Event Attendance',
          data: [12, 19, 3, 5, 2, 3, 7],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  initSecondGraph(): void {
    new Chart(this.secondGraph.nativeElement, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Ticket Sales',
          data: [120, 190, 30, 50],
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}