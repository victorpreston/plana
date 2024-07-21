// import { Component, ChangeDetectorRef } from '@angular/core';
// import { RouterLink, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../services/auth/auth.service';
// import { User } from '../../interfaces/user';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css'],
//   imports: [RouterLink, CommonModule]
// })
// export class NavbarComponent {
//   user: User | null = null;
//   // isDropdownVisible = false;

//   constructor(private authService: AuthService, private router: Router, private cd: ChangeDetectorRef) {
//     this.authService.user$.subscribe(user => {
//       this.user = user;
//       this.cd.detectChanges();
//       if (this.user && this.user.role === 'ATTENDEE') {
//         this.router.navigate(['/events']);
//       }
//     });
//   }

//   // onMouseOver() {
//   //   this.isDropdownVisible = true;
//   // }

//   // onMouseLeave() {
//   //   this.isDropdownVisible = false;
//   // }

//   logout() {
//     this.authService.logout();
//     this.router.navigate(['/']);
//   }
// }

import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/user';
import { Subscription } from 'rxjs';

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

  constructor(private authService: AuthService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user && this.user.role === 'ATTENDEE') {
        this.router.navigate(['/events']);
      }
      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}