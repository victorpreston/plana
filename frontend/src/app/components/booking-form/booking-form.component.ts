import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Event } from '../../interfaces/event';
import { BookingService } from '../../services/bookings/booking.service';
import { AuthService } from '../../services/auth/auth.service';
import { Booking } from '../../interfaces/booking';
import { User } from '../../interfaces/user';
import { TicketType } from '../../interfaces/ticket';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  @Input() event: Event | null = null;
  @Output() close = new EventEmitter<void>();

  bookingForm: FormGroup;
  selectedTicketType: string = '';
  ticketQuantity: number = 1;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router // Inject Router
  ) {
    this.bookingForm = this.fb.group({
      ticketType: [''],
      quantity: [1]
    });
  }

  ngOnInit(): void {
    if (this.event && this.event.ticketTypes.length > 0) {
      this.selectedTicketType = this.event.ticketTypes[0].type;
    }

    this.authService.user$.subscribe(user => {
      if (user) {
        this.userId = user.id;
      }
    });
  }

  incrementQuantity() {
    this.ticketQuantity++;
  }

  decrementQuantity() {
    if (this.ticketQuantity > 1) {
      this.ticketQuantity--;
    }
  }

  onSubmit() {
    if (this.event && this.userId) {
      const booking: Booking = {
        id: '',
        userId: this.userId,
        eventId: this.event.id,
        ticketTypeId: this.event.ticketTypes.find(tt => tt.type === this.selectedTicketType)?.id || '',
        tickets: this.ticketQuantity,
        status: 'confirmed',
        ticketCode: '',
        totalPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        user: {} as User,
        event: this.event,
        ticketType: {} as TicketType,
      };

      this.bookingService.createBooking(booking).subscribe({
        next: (response) => {
          alert('Booking successful!');
          this.close.emit();
          this.router.navigate(['/payment'], { queryParams: { bookingId: response.id } });
        },
        error: (error) => {
          console.error('Booking failed', error);
          alert('Booking failed. Please try again.');
        }
      });
    }
  }

  onClose() {
    this.close.emit();
  }
}