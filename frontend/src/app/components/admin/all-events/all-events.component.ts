import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Event {
  id: number;
  banner: string;
  title: string;
  location: string;
  date: string;
  visible: boolean;
  vipPrice: number;
  regularPrice: number;
  numberOfTickets: number;
  description: string;
  image: string;
}

@Component({
  selector: 'app-all-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})
export class AllEventsComponent {
  events: Event[] = [
    {
      id: 1,
      banner: 'assets/event1.jpg',
      title: 'Summer Festival',
      location: 'New York City',
      date: '2024-07-15',
      visible: true,
      vipPrice: 50,
      regularPrice: 30,
      numberOfTickets: 100,
      description: 'A great summer festival',
      image: 'assets/event1.jpg'
    },
    {
      id: 2,
      banner: 'assets/event1.jpg',
      title: 'Tech Conference',
      location: 'San Francisco',
      date: '2024-08-10',
      visible: false,
      vipPrice: 150,
      regularPrice: 100,
      numberOfTickets: 200,
      description: 'A great tech conference',
      image: 'assets/event2.jpg'
    }
  ];

  isViewing = false;
  selectedEvent: Event | null = null;

  toggleEventVisibility(event: Event): void {
    event.visible = !event.visible;
  }

  showViewEventModal(event: Event): void {
    this.selectedEvent = event;
    this.isViewing = true;
  }

  closeViewEventModal(): void {
    this.isViewing = false;
    this.selectedEvent = null;
  }
}