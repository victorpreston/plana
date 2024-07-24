import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { ProfileService } from '../../../services/profiles/profile.service';
import { User } from '../../../interfaces/user';
import { Profile } from '../../../interfaces/profile';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponentAdmin implements OnInit {
  user: User | null = null;
  profile: Profile | null = null;
  showDropdown: boolean = false;

  constructor(private authService: AuthService, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user) {
        this.fetchProfile(this.user.id);
      }
    });
  }

  fetchProfile(userId: string): void {
    this.profileService.getProfile(userId).subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: () => {
        console.error('Failed to load profile.');
      }
    });
  }
}