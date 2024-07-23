import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profiles/profile.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Profile } from '../../../interfaces/profile';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-my-settings',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './my-settings.component.html',
  styleUrls: ['./my-settings.component.css']
})
export class MySettingsComponent implements OnInit {
  isEditing: boolean = false;
  isLoading: boolean = false;
  userProfile: Profile | null = null;
  profileForm: FormGroup;
  email: string = '';

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.email = user.email;
        this.profileService.getProfile(user.id).subscribe(profile => {
          this.userProfile = profile;
          this.profileForm.patchValue({
            username: profile.firstName + ' ' + profile.lastName,
            email: user.email, // Get email from the user
            phone: profile.phone
          });
        });
      }
    });
  }

  toggleEdit() {
    this.isLoading = true;
    setTimeout(() => {
      this.isEditing = !this.isEditing;
      this.isLoading = false;
    }, 1000); // 1 second delay
  }

  cancelEdit() {
    this.isEditing = false;
  }

  saveChanges() {
    if (this.profileForm.valid && this.userProfile) {
      const updatedProfile: Profile = {
        ...this.userProfile,
        firstName: this.profileForm.value.username.split(' ')[0],
        lastName: this.profileForm.value.username.split(' ')[1],
        phone: this.profileForm.value.phone
      };

      this.profileService.editProfile(this.userProfile.id, updatedProfile).subscribe({
        next: () => {
          this.isEditing = false;
          this.userProfile = updatedProfile;
        },
        error: (err) => {
          console.error('Error updating profile', err);
          // Add error handling logic here
        }
      });

      if (this.profileForm.value.password && this.profileForm.value.password === this.profileForm.value.confirmPassword) {
        this.profileService.changePassword(this.userProfile.id, this.profileForm.value.password).subscribe({
          next: () => {
            console.log('Password changed successfully');
          },
          error: (err) => {
            console.error('Error changing password', err);
            // Add error handling logic here
          }
        });
      }
    }
  }
}