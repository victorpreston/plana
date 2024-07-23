import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/bookings/booking.service';
import { Booking } from '../../../interfaces/booking';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [NavbarComponent, RouterLink, CommonModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  activeBookings: Booking[] = [];
  cancelledBookings: Booking[] = [];
  isLoading: boolean = false;
  showCancelled: boolean = false;
  activePage: number = 1;
  cancelledPage: number = 1;
  bookingsPerPage: number = 3;
  maxVisiblePages: number = 3;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.isLoading = true;
    this.bookingService.getUserBookings().subscribe({
      next: (bookings) => {
        this.activeBookings = bookings.filter(booking => booking.status !== 'cancelled');
        this.cancelledBookings = bookings.filter(booking => booking.status === 'cancelled');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching bookings', error);
        this.isLoading = false;
      }
    });
  }

  cancelBooking(bookingId: string): void {
    const booking = this.activeBookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'cancelled';
      this.bookingService.updateBooking(bookingId, booking).subscribe({
        next: () => {
          this.fetchBookings();
        },
        error: (error) => {
          console.error('Error cancelling booking', error);
        }
      });
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

  toggleBookings(showCancelled: boolean): void {
    this.isLoading = true;
    setTimeout(() => {
      this.showCancelled = showCancelled;
      this.isLoading = false;
    }, 1000);
  }

  get paginatedActiveBookings(): Booking[] {
    const start = (this.activePage - 1) * this.bookingsPerPage;
    const end = start + this.bookingsPerPage;
    return this.activeBookings.slice(start, end);
  }

  get paginatedCancelledBookings(): Booking[] {
    const start = (this.cancelledPage - 1) * this.bookingsPerPage;
    const end = start + this.bookingsPerPage;
    return this.cancelledBookings.slice(start, end);
  }

  previousPage(type: 'active' | 'cancelled'): void {
    if (type === 'active' && this.activePage > 1) {
      this.activePage--;
    } else if (type === 'cancelled' && this.cancelledPage > 1) {
      this.cancelledPage--;
    }
  }

  nextPage(type: 'active' | 'cancelled'): void {
    if (type === 'active' && this.activePage * this.bookingsPerPage < this.activeBookings.length) {
      this.activePage++;
    } else if (type === 'cancelled' && this.cancelledPage * this.bookingsPerPage < this.cancelledBookings.length) {
      this.cancelledPage++;
    }
  }

  setPage(type: 'active' | 'cancelled', page: number): void {
    if (type === 'active') {
      this.activePage = page;
    } else if (type === 'cancelled') {
      this.cancelledPage = page;
    }
  }

  get visibleActivePages(): number[] {
    return this.getVisiblePages(this.activePages, this.activePage);
  }

  get visibleCancelledPages(): number[] {
    return this.getVisiblePages(this.cancelledPages, this.cancelledPage);
  }

  get activePages(): number[] {
    return Array(Math.ceil(this.activeBookings.length / this.bookingsPerPage)).fill(0).map((x, i) => i + 1);
  }

  get cancelledPages(): number[] {
    return Array(Math.ceil(this.cancelledBookings.length / this.bookingsPerPage)).fill(0).map((x, i) => i + 1);
  }

  getVisiblePages(pages: number[], currentPage: number): number[] {
    const totalPages = pages.length;
    const startPage = Math.max(1, currentPage - Math.floor(this.maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + this.maxVisiblePages - 1);
    const visiblePages = [];

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }
}