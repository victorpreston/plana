import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { EventService } from '../../../services/events/event.service';
import { Event } from '../../../interfaces/event';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions, EventHoveringArg } from '@fullcalendar/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NavbarComponent, RouterLink, CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarElement!: ElementRef;

  events: Event[] = [];
  calendarEvents: any[] = [];
  isLoading: boolean = false;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
    eventMouseEnter: this.handleEventMouseEnter.bind(this),
    eventMouseLeave: this.handleEventMouseLeave.bind(this),
    height: 'auto',
    aspectRatio: 2,
    contentHeight: 400
  };

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.fetchAllEvents();
  }

  fetchAllEvents(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.eventService.getAllEvents().subscribe({
        next: (events) => {
          this.events = events;
          this.calendarEvents = this.events.map(event => ({
            title: event.title,
            start: event.date,
            extendedProps: {
              description: event.description,
              location: event.location,
              manager: event.manager.email,
              time: event.time ? new Date(event.time).toLocaleTimeString() : 'No time specified'
            }
          }));
          this.calendarOptions.events = this.calendarEvents;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching events', error);
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
      <i class="pi pi-info-circle text-indigo-800 font-bold"></i> ${mouseEnterInfo.event.extendedProps['description']}<br/>
      <i class="pi pi-map-marker text-indigo-800 font-bold"></i>${mouseEnterInfo.event.extendedProps['location']}<br/>
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