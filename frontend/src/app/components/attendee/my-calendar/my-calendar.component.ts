import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { BookingService } from '../../../services/bookings/booking.service';
import { Booking } from '../../../interfaces/booking';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions, EventHoveringArg } from '@fullcalendar/core';

@Component({
  selector: 'app-my-calendar',
  standalone: true,
  imports: [NavbarComponent, RouterLink, CommonModule, FullCalendarModule],
  templateUrl: './my-calendar.component.html',
  styleUrls: ['./my-calendar.component.css']
})
export class MyCalendarComponent implements OnInit {
  @ViewChild('calendar') calendarElement!: ElementRef;

  bookings: Booking[] = [];
  events: any[] = [];
  isLoading: boolean = false;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
    eventMouseEnter: this.handleEventMouseEnter.bind(this),
    eventMouseLeave: this.handleEventMouseLeave.bind(this),
    height: 'auto',
    aspectRatio: 2,
    contentHeight:400
  };

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.fetchUserBookings();
  }

  fetchUserBookings(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.bookingService.getUserBookings().subscribe({
        next: (bookings) => {
          this.bookings = bookings.filter(booking => booking.status !== 'cancelled');
          this.events = this.bookings.map(booking => ({
            title: booking.event.title,
            start: booking.event.date,
            extendedProps: {
              description: booking.event.description,
              location: booking.event.location,
              manager: booking.event.manager.email,
              ticketType: booking.ticketType.type,
              status: booking.status,
              time: booking.event.time ? new Date(booking.event.time).toLocaleTimeString() : 'No time specified'
            }
          }));
          this.calendarOptions.events = this.events;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching bookings', error);
          this.isLoading = false;
        }
      });
    }, 1500);
  }

  handleEventMouseEnter(mouseEnterInfo: EventHoveringArg): void {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerHTML = `
      <strong>${mouseEnterInfo.event.title}</strong><br/>
      <i class="pi pi-calendar text-indigo-800 font-bold"></i> ${new Date(mouseEnterInfo.event.start ?? '').toLocaleDateString()}<br/>
      <i class="pi pi-clock text-indigo-800 font-bold"></i> ${mouseEnterInfo.event.extendedProps['time']}<br/>
      <i class="pi pi-user text-indigo-800 font-bold"></i> ${mouseEnterInfo.event.extendedProps['manager']}<br/>
      <i class="pi pi-wallet text-indigo-800 font-bold"></i> ${mouseEnterInfo.event.extendedProps['ticketType']}<br/>
      <i class="pi pi-info-circle text-indigo-800 font-bold"></i> ${mouseEnterInfo.event.extendedProps['status']}<br/>
      ${mouseEnterInfo.event.extendedProps['description']}<br/>
      <i class="pi pi-map-marker text-indigo-800 font-bold"></i>${mouseEnterInfo.event.extendedProps['location']}</br>
    `;
    tooltip.style.position = 'absolute';
    tooltip.style.background = '#fff';
    tooltip.style.border = '1px solid #ccc';
    tooltip.style.padding = '5px';
    tooltip.style.zIndex = '1000';
    tooltip.style.borderRadius = '5px';
    tooltip.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.2)';
    tooltip.style.fontSize = '0.9em';
    tooltip.style.color = '#333';
    document.body.appendChild(tooltip);

    mouseEnterInfo.el.addEventListener('mousemove', (e) => {
      tooltip.style.left = `${e.pageX + 10}px`;
      tooltip.style.top = `${e.pageY + 10}px`;
    });
  }

  handleEventMouseLeave(mouseLeaveInfo: EventHoveringArg): void {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }
}