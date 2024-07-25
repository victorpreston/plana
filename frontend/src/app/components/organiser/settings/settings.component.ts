import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { ProfileService } from '../../../services/profiles/profile.service';
import { Profile } from '../../../interfaces/profile';
import { User } from '../../../interfaces/user';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  user: User | null = null;
  profile: Profile | null = null;
  isLoading: boolean = false;
  isEditing: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user) {
        this.fetchProfile(this.user.id);
      }
    });
  }

  fetchProfile(userId: string): void {
    this.isLoading = true;
    this.profileService.getProfile(userId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loadProfile(profile);
        this.isLoading = false;
      },
      error: () => {
        this.showAlert('Failed to load profile. Please try again.', 'error');
        this.isLoading = false;
      }
    });
  }

  loadProfile(profile: Profile): void {
    this.profileForm.patchValue({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      imageUrl: profile.imageUrl
    });
  }

  enableEditing(): void {
    this.isEditing = true;
  }

  disableEditing(): void {
    this.isEditing = false;
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.user) return;
    this.isLoading = true;

    this.profileService.editProfile(this.user.id, this.profileForm.value).subscribe({
      next: (profile) => {
        const updatedUser = { ...this.user, profile } as User;
        this.authService.setUser(updatedUser, localStorage.getItem('token')!);
        this.showAlert('Profile updated successfully!', 'success');
        this.profile = profile;
        this.disableEditing();
      },
      error: () => {
        this.showAlert('Failed to update profile. Please try again.', 'error');
      },
      complete: () => (this.isLoading = false)
    });
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadImageToCloudinary(file);
    }
  }

  uploadImageToCloudinary(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 't2gtalks');
    formData.append('cloud_name', 'dtn9kzx2v');

    this.isLoading = true;

    fetch('https://api.cloudinary.com/v1_1/dtn9kzx2v/image/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        this.profileForm.patchValue({ imageUrl: data.secure_url });
        this.profile!.imageUrl = data.secure_url;  // Update the profile image immediately
        this.isLoading = false;
        this.showAlert('Image uploaded successfully!', 'success');
      })
      .catch(() => {
        this.isLoading = false;
        this.showAlert('Failed to upload image. Please try again.', 'error');
      });
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = '';
    }, 5000);
  }
}