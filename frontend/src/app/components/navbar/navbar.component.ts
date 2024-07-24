// import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
// import { RouterLink, Router, NavigationEnd, Event } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../services/auth/auth.service';
// import { BookingService } from '../../services/bookings/booking.service';
// import { User } from '../../interfaces/user';
// import { Subscription } from 'rxjs';
// import { filter } from 'rxjs/operators';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css'],
//   imports: [RouterLink, CommonModule]
// })
// export class NavbarComponent implements OnInit, OnDestroy {
//   user: User | null = null;
//   private userSubscription: Subscription | undefined;
//   private routerSubscription: Subscription | undefined;
//   private bookingSubscription: Subscription | undefined;
//   totalEvents: number = 0;
//   totalTickets: number = 0;

//   constructor(private authService: AuthService, private bookingService: BookingService, private router: Router, private cd: ChangeDetectorRef) {}

//   ngOnInit(): void {
//     this.userSubscription = this.authService.user$.subscribe(user => {
//       this.user = user;
//       if (this.user) {
//         this.fetchUserBookings();
//         if (this.user.role === 'ATTENDEE') {
//           // Check the current URL before redirecting
//           this.routerSubscription = this.router.events.pipe(
//             filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
//           ).subscribe((event: NavigationEnd) => {
//             if (event.url === '/' || event.url === '/login' || event.url === '/register') {
//               this.router.navigate(['/events']);
//             }
//           });
//         }
//       }
//       this.cd.detectChanges();
//     });
//   }

//   fetchUserBookings(): void {
//     this.bookingSubscription = this.bookingService.getUserBookings().subscribe({
//       next: (bookings) => {
//         this.totalEvents = bookings.length;
//         this.totalTickets = bookings.reduce((acc, booking) => acc + booking.tickets, 0);
//         this.cd.detectChanges();
//       },
//       error: (error) => {
//         console.error('Error fetching user bookings', error);
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.userSubscription) {
//       this.userSubscription.unsubscribe();
//     }
//     if (this.routerSubscription) {
//       this.routerSubscription.unsubscribe();
//     }
//     if (this.bookingSubscription) {
//       this.bookingSubscription.unsubscribe();
//     }
//   }

//   logout(): void {
//     this.authService.logout();
//     this.router.navigate(['/']);
//   }
// }
import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, Router, NavigationEnd, Event } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { BookingService } from '../../services/bookings/booking.service';
import { User } from '../../interfaces/user';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RequestRoleComponent } from '../request-role/request-role.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterLink, CommonModule, RequestRoleComponent]
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: User | null = null;
  private userSubscription: Subscription | undefined;
  private routerSubscription: Subscription | undefined;
  private bookingSubscription: Subscription | undefined;
  totalEvents: number = 0;
  totalTickets: number = 0;
  showRequestRolePopup: boolean = false;

  constructor(private authService: AuthService, private bookingService: BookingService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user) {
        this.fetchUserBookings();
        if (this.user.role === 'ATTENDEE') {
          // Check the current URL before redirecting
          this.routerSubscription = this.router.events.pipe(
            filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
          ).subscribe((event: NavigationEnd) => {
            if (event.url === '/' || event.url === '/login' || event.url === '/register') {
              this.router.navigate(['/events']);
            }
          });
        }
      }
      this.cd.detectChanges();
    });
  }

  fetchUserBookings(): void {
    this.bookingSubscription = this.bookingService.getUserBookings().subscribe({
      next: (bookings) => {
        this.totalEvents = bookings.length;
        this.totalTickets = bookings.reduce((acc, booking) => acc + booking.tickets, 0);
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching user bookings', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.bookingSubscription) {
      this.bookingSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  handleCreateEventClick(): void {
    if (this.user && this.user.role !== 'MANAGER') {
      this.showRequestRolePopup = true;
    } else {
      this.router.navigate(['/create-event']);
    }
  }

  closeRequestRolePopup(): void {
    this.showRequestRolePopup = false;
  }
}