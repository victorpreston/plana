import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/bookings/booking.service';
import { Booking } from '../../../interfaces/booking';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
  providers: [BookingService]
})
export class TicketsComponent implements OnInit {
  ticketForm: FormGroup;
  editForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  bookings: Booking[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  bookingsPerPage: number = 3;
  showBookings: boolean = false;
  showForm: boolean = true;
  editMode: boolean = false;
  bookingToEdit: Booking | null = null;
  showModal: boolean = false;
  modalAction: 'cancel' | 'delete' | null = null;
  modalBookingId: string | null = null;

  constructor(private fb: FormBuilder, private bookingService: BookingService) {
    this.ticketForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      ticketCode: ['', Validators.required],
    });

    this.editForm = this.fb.group({
      tickets: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchBookings();
  }

  toggleView(view: 'form' | 'bookings') {
    this.showForm = view === 'form';
    this.showBookings = view === 'bookings';
  }

  verifyTicket() {
    const ticketCode = this.ticketForm.get('ticketCode')?.value;

    this.bookingService.verifyTicketCode(ticketCode).pipe(
      catchError(error => {
        this.errorMessage = 'Ticket verification failed. Please try again.';
        this.successMessage = null;
        this.setAutoHideMessages();
        return of(null); // Return an observable with a null value to handle the error
      })
    ).subscribe(response => {
      if (response) {
        this.successMessage = 'Ticket verified successfully!';
        this.errorMessage = null;
        this.setAutoHideMessages();
      }
      this.ticketForm.reset(); // Clear the form fields
    });
  }

  private setAutoHideMessages() {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 3000); // Hide messages after 3 seconds
  }

  fetchBookings(): void {
    this.isLoading = true;
    this.bookingService.getRecentBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching bookings', error);
        this.isLoading = false;
      }
    });
  }

  editBooking(booking: Booking): void {
    this.editMode = true;
    this.bookingToEdit = booking;
    this.editForm.patchValue({
      tickets: booking.tickets,
      status: booking.status,
    });
  }

  saveBooking(): void {
    if (this.bookingToEdit) {
      const updatedBooking: Booking = {
        ...this.bookingToEdit,
        tickets: this.editForm.get('tickets')?.value,
        status: this.editForm.get('status')?.value,
      };
      this.bookingService.updateBooking(this.bookingToEdit.id, updatedBooking).subscribe({
        next: () => {
          this.fetchBookings();
          this.editMode = false;
          this.bookingToEdit = null;
        },
        error: (error) => {
          console.error('Error updating booking', error);
        }
      });
    }
  }

  showConfirmationModal(action: 'cancel' | 'delete', bookingId: string): void {
    this.modalAction = action;
    this.modalBookingId = bookingId;
    this.showModal = true;
  }

  confirmAction(): void {
    if (this.modalAction && this.modalBookingId) {
      if (this.modalAction === 'cancel') {
        this.cancelBooking(this.modalBookingId);
      } else if (this.modalAction === 'delete') {
        this.deleteBooking(this.modalBookingId);
      }
      this.closeModal();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.modalAction = null;
    this.modalBookingId = null;
  }

  cancelBooking(bookingId: string): void {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'cancelled';
      this.saveBooking();
    }
  }

  deleteBooking(bookingId: string): void {
    this.bookingService.deleteBooking(bookingId).subscribe({
      next: () => {
        this.fetchBookings();
      },
      error: (error) => {
        console.error('Error deleting booking', error);
      }
    });
  }

  get paginatedBookings(): Booking[] {
    const start = (this.currentPage - 1) * this.bookingsPerPage;
    const end = start + this.bookingsPerPage;
    return this.bookings.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage * this.bookingsPerPage < this.bookings.length) {
      this.currentPage++;
    }
  }

  setPage(page: number): void {
    this.currentPage = page;
  }

  get visiblePages(): number[] {
    const totalPages = Math.ceil(this.bookings.length / this.bookingsPerPage);
    const startPage = Math.max(1, this.currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 1);
    const visiblePages = [];

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }
}