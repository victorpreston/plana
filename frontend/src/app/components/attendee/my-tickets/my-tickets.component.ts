import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/bookings/booking.service';
import { Booking } from '../../../interfaces/booking';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [NavbarComponent, RouterLink, CommonModule],
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.css']
})
export class MyTicketsComponent implements OnInit {
  bookings: Booking[] = [];
  individualTickets: Booking[] = [];
  groupTickets: Booking[] = [];
  isLoading: boolean = false;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.fetchUserBookings();
  }

  fetchUserBookings(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.bookingService.getUserBookings().subscribe({
        next: (bookings) => {
          this.bookings = bookings;
          this.individualTickets = bookings.filter(booking => booking.tickets === 1);
          this.groupTickets = bookings.filter(booking => booking.tickets > 1);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching bookings', error);
          this.isLoading = false;
        }
      });
    }, 1500);
  }

  downloadTicket(ticket: Booking): void {
    const doc = new jsPDF();
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=${ticket.ticketCode}&size=100x100`;
    doc.setFontSize(18);
    doc.text(`Event: ${ticket.event.title}`, 10, 10);
    doc.setFontSize(14);
    doc.text(`Description: ${ticket.event.description}`, 10, 30);
    doc.text(`Date: ${new Date(ticket.event.date).toLocaleDateString()}`, 10, 40);
    doc.text(`Location: ${ticket.event.location}`, 10, 50);
    doc.text(`Ticket Code: ${ticket.ticketCode}`, 10, 60);
    doc.text(`Status: ${ticket.status}`, 10, 70);
    doc.addImage(qrCode, 'PNG', 150, 10, 40, 40);

    const pdfBlob = doc.output('blob');
    saveAs(pdfBlob, `ticket-${ticket.id}.pdf`);
  }

  downloadGroupTickets(ticket: Booking): void {
    const doc = new jsPDF();
    for (let i = 0; i < ticket.tickets; i++) {
      if (i > 0) {
        doc.addPage();
      }
      const qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=${ticket.ticketCode}-${i + 1}&size=100x100`;
      doc.setFontSize(18);
      doc.text(`Event: ${ticket.event.title}`, 10, 10);
      doc.setFontSize(14);
      doc.text(`Description: ${ticket.event.description}`, 10, 30);
      doc.text(`Date: ${new Date(ticket.event.date).toLocaleDateString()}`, 10, 40);
      doc.text(`Location: ${ticket.event.location}`, 10, 50);
      doc.text(`Ticket Code: ${ticket.ticketCode}-${i + 1}`, 10, 60);
      doc.text(`Status: ${ticket.status}`, 10, 70);
      doc.addImage(qrCode, 'PNG', 150, 10, 40, 40);
    }

    const pdfBlob = doc.output('blob');
    saveAs(pdfBlob, `group-tickets-${ticket.id}.pdf`);
  }
}