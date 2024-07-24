import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../services/events/event.service';
import { Event } from '../../../interfaces/event';

@Component({
  selector: 'app-all-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})
export class AllEventsComponent implements OnInit {
  events: Event[] = [];
  paginatedEvents: Event[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  visiblePages: number[] = [];

  isViewing = false;
  selectedEvent: Event | null = null;
  vipPrice: number | null = null;
  regularPrice: number | null = null;
  totalTickets: number | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe(events => {
      this.events = events;
      this.updatePagination();
    });
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.events.length / this.itemsPerPage);
    this.visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);
    this.setPage(this.currentPage);
  }

  setPage(page: number): void {
    if (page < 1 || page > this.visiblePages.length) return;
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvents = this.events.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.visiblePages.length) {
      this.setPage(this.currentPage + 1);
    }
  }

  toggleEventVisibility(event: Event): void {
    event.isDeleted = !event.isDeleted;
  }

  showViewEventModal(event: Event): void {
    this.selectedEvent = event;
    this.vipPrice = event.ticketTypes.find(t => t.type === 'VIP')?.price || null;
    this.regularPrice = event.ticketTypes.find(t => t.type === 'Regular')?.price || null;
    this.totalTickets = event.ticketTypes.reduce((total, t) => total + t.quantity, 0) || null;
    this.isViewing = true;
  }

  closeViewEventModal(): void {
    this.isViewing = false;
    this.selectedEvent = null;
    this.vipPrice = null;
    this.regularPrice = null;
    this.totalTickets = null;
  }
}