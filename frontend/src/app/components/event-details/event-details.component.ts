import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/events/event.service';
import { ProfileService } from '../../services/profiles/profile.service';
import { AuthService } from '../../services/auth/auth.service';
import { Event } from '../../interfaces/event';
import { Tag } from '../../interfaces/tag';
import { NavbarComponent } from '../navbar/navbar.component';
import { User } from '../../interfaces/user';
import { FooterComponent } from '../footer/footer.component';
import { BookingFormComponent } from '../booking-form/booking-form.component';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, RouterLink, FooterComponent, BookingFormComponent],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;
  tags: Tag[] = [];
  selectedTags: string[] = [];
  user: User | null = null;
  facebookShareUrl: string = '';
  twitterShareUrl: string = '';
  youtubeShareUrl: string = '';
  instagramShareUrl: string = '';
  showLoginPrompt: boolean = false;
  showBookingForm: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    console.log('Navigated to event details with ID:', eventId);
    if (eventId) {
      this.eventService.getEventById(eventId).subscribe(event => {
        this.event = event;
        console.log('Event details loaded:', this.event);
        this.updateShareUrls();
        if (event.managerId) {
          this.loadManagerProfile(event.managerId);
        }
      });
    }
    this.loadTags();

    this.authService.user$.subscribe(user => {
      this.user = user;
      console.log('Current user:', this.user);
    });
  }

  loadTags(): void {
    this.eventService.getTags().subscribe(tags => {
      this.tags = tags;
    });
  }

  onTagSelect(tag: Tag): void {
    if (this.selectedTags.includes(tag.id)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag.id);
    } else {
      this.selectedTags.push(tag.id);
    }
    // Implement tag filter logic here
  }

  updateShareUrls(): void {
    if (this.event) {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`Check out this event: ${this.event.title}`);
      this.facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      this.twitterShareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      this.youtubeShareUrl = `https://www.youtube.com/share?url=${url}`;
      this.instagramShareUrl = `https://www.instagram.com/?url=${url}`;
    }
  }

  loadManagerProfile(managerId: string): void {
    this.profileService.getProfile(managerId).subscribe(profile => {
      if (this.event) {
        this.event.manager.profile = profile;
        console.log('Manager profile loaded:', profile);
      }
    });
  }

  handleBooking(): void {
    if (!this.user) {
      this.showLoginPrompt = true;
    } else if (this.user.role !== 'ATTENDEE') {
      alert("You need to have an attendee role to book this event.");
    } else {
      this.showBookingForm = true;
    }
  }

  navigateToLogin(): void {
    this.closeLoginPrompt();
    const returnUrl = this.router.url;
    this.router.navigate(['/login'], { queryParams: { returnUrl } });
  }

  closeLoginPrompt(): void {
    this.showLoginPrompt = false;
  }

  closeBookingForm(): void {
    this.showBookingForm = false;
  }

  getAttendeeCount(event: Event): number {
    return event.bookings.reduce((sum, booking) => sum + booking.tickets, 0);
  }
}