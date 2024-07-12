import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css'
})
export class BookingsComponent {
  bookings = [
    {
      eventName: 'Summer Festival',
      numBookings: 120,
      regularTicketsRevenue: 2400,
      vipTicketsRevenue: 3600
    },
    {
      eventName: 'Tech Conference',
      numBookings: 200,
      regularTicketsRevenue: 4000,
      vipTicketsRevenue: 6000
    }
    // more bookings...
  ];

  getTotalRegularRevenue(): number {
    return this.bookings.reduce((total, booking) => total + booking.regularTicketsRevenue, 0);
  }

  getTotalVipRevenue(): number {
    return this.bookings.reduce((total, booking) => total + booking.vipTicketsRevenue, 0);
  }
}
