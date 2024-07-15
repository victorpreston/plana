import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements AfterViewInit {
  @ViewChild('calendar') calendarElement!: ElementRef;

  events = [
    {
      title: 'Event 1',
      start: '2024-07-20',
      extendedProps: {
        manager: 'Manager 1',
        attendees: 50
      }
    },
    {
      title: 'Event 2',
      start: '2024-07-21',
      extendedProps: {
        manager: 'Manager 2',
        attendees: 30
      }
    }
  ];

  constructor() {}

  ngAfterViewInit(): void {
    this.initializeCalendar();
  }

  initializeCalendar(): void {
    const calendarEl = this.calendarElement.nativeElement;
    const calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      events: this.events,
      height: '100%',
      eventMouseEnter: this.handleEventMouseEnter.bind(this),
      aspectRatio: 2,
      contentHeight: 400
    });
    calendar.render();
  }

  handleEventMouseEnter(info: any) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.background = '#fff';
    tooltip.style.border = '1px solid #ccc';
    tooltip.style.padding = '5px';
    tooltip.style.zIndex = '1000';
    tooltip.innerHTML = `<b>${info.event.title}</b><br>Manager: ${info.event.extendedProps.manager}<br>Attendees: ${info.event.extendedProps.attendees}`;
    document.body.appendChild(tooltip);

    info.el.addEventListener('mousemove', (e: MouseEvent) => {
      tooltip.style.left = e.pageX + 10 + 'px';
      tooltip.style.top = e.pageY + 10 + 'px';
    });

    info.el.addEventListener('mouseleave', () => {
      document.body.removeChild(tooltip);
    });
  }
}