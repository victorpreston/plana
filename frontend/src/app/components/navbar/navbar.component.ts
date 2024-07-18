import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterLink, CommonModule]
})
export class NavbarComponent {
  user: User | null = null;

  constructor(private authService: AuthService, private router: Router, private cd: ChangeDetectorRef) {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.cd.detectChanges();
      if (this.user && this.user.role === 'ATTENDEE') {
        this.router.navigate(['/events']);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}