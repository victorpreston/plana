import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { EventService } from '../../services/events/event.service';
import { Event } from '../../interfaces/event';
import { Category } from '../../interfaces/category';
import { Tag } from '../../interfaces/tag';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  filterForm: FormGroup;
  events: Event[] = [];
  categories: Category[] = [];
  tags: Tag[] = [];
  locations: string[] = [];
  filteredEvents: Event[] = [];
  selectedTags: string[] = [];

  constructor(private fb: FormBuilder, private eventService: EventService) {
    this.filterForm = this.fb.group({
      location: [''],
      category: [''],
      time: this.fb.group({
        anytime: [false],
        thisWeek: [false],
        nextWeek: [false],
        thisMonth: [false],
        nextMonth: [false],
        thisYear: [false]
      }),
      search: ['']
    });
  }

  ngOnInit(): void {
    this.loadEvents();
    this.loadCategories();
    this.loadTags();
    this.loadLocations();
    this.filterForm.valueChanges.subscribe(() => this.filterEvents());
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe((events) => {
      this.events = events;
      this.filteredEvents = events;
    });
  }

  loadCategories(): void {
    this.eventService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  loadTags(): void {
    this.eventService.getTags().subscribe((tags) => {
      this.tags = tags;
    });
  }

  loadLocations(): void {
    this.eventService.getUniqueLocations().subscribe((locations) => {
      this.locations = locations;
    });
  }

  onClearFilters(): void {
    this.filterForm.reset({
      location: 'All locations',
      category: 'All categories',
      time: {
        anytime: false,
        thisWeek: false,
        nextWeek: false,
        thisMonth: false,
        nextMonth: false,
        thisYear: false
      },
      search: ''
    });
    this.selectedTags = [];
    this.filteredEvents = this.events;
  }

  filterEvents(): void {
    const filters = this.filterForm.value;
    this.filteredEvents = this.events.filter(event => {
      const matchesLocation = filters.location === 'All locations' || event.location === filters.location;
      const matchesCategory = filters.category === 'All categories' || event.categoryId === filters.category;
      const matchesTags = this.selectedTags.length ? event.tags.some(tag => this.selectedTags.includes(tag.tagId)) : true;

      const matchesTime = filters.time.anytime ||
        (filters.time.thisWeek && this.isThisWeek(event.date)) ||
        (filters.time.nextWeek && this.isNextWeek(event.date)) ||
        (filters.time.thisMonth && this.isThisMonth(event.date)) ||
        (filters.time.nextMonth && this.isNextMonth(event.date)) ||
        (filters.time.thisYear && this.isThisYear(event.date));

      const matchesSearch = filters.search ? event.title.toLowerCase().includes(filters.search.toLowerCase()) : true;

      return matchesLocation && matchesCategory && matchesTags && matchesTime && matchesSearch;
    });
  }

  isThisWeek(date: Date): boolean {
    const now = new Date();
    const eventDate = new Date(date);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return eventDate >= startOfWeek && eventDate <= endOfWeek;
  }

  isNextWeek(date: Date): boolean {
    const now = new Date();
    const eventDate = new Date(date);
    const startOfNextWeek = new Date(now.setDate(now.getDate() - now.getDay() + 7));
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

    return eventDate >= startOfNextWeek && eventDate <= endOfNextWeek;
  }

  isThisMonth(date: Date): boolean {
    const now = new Date();
    const eventDate = new Date(date);

    return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
  }

  isNextMonth(date: Date): boolean {
    const now = new Date();
    const eventDate = new Date(date);
    const nextMonth = new Date(now.setMonth(now.getMonth() + 1));

    return eventDate.getMonth() === nextMonth.getMonth() && eventDate.getFullYear() === nextMonth.getFullYear();
  }

  isThisYear(date: Date): boolean {
    const now = new Date();
    const eventDate = new Date(date);

    return eventDate.getFullYear() === now.getFullYear();
  }

  onTagSelect(tag: Tag): void {
    if (this.selectedTags.includes(tag.id)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag.id);
    } else {
      this.selectedTags.push(tag.id);
    }
    this.filterEvents();
  }
  getAttendeeCount(event: Event): number {
    return event.bookings.reduce((sum, booking) => sum + booking.tickets, 0);
  }
}