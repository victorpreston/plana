// import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
// import { RouterLink, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../services/auth/auth.service';
// import { User } from '../../interfaces/user';
// import { Subscription } from 'rxjs';

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

//   constructor(private authService: AuthService, private router: Router, private cd: ChangeDetectorRef) {}

//   ngOnInit(): void {
//     this.userSubscription = this.authService.user$.subscribe(user => {
//       this.user = user;
//       if (this.user && this.user.role === 'ATTENDEE') {
//         this.router.navigate(['/events']);
//       }
//       this.cd.detectChanges();
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.userSubscription) {
//       this.userSubscription.unsubscribe();
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
import { User } from '../../interfaces/user';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterLink, CommonModule]
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: User | null = null;
  private userSubscription: Subscription | undefined;
  private routerSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user && this.user.role === 'ATTENDEE') {
        // Check the current URL before redirecting
        this.routerSubscription = this.router.events.pipe(
          filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
          if (event.url === '/' || event.url === '/login' || event.url === '/register') {
            this.router.navigate(['/events']);
          }
        });
      }
      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}