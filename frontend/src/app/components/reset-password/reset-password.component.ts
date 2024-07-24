import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../services/profiles/profile.service';
RouterLink

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private profileService: ProfileService, private router: Router) {
    this.resetPasswordForm = this.fb.group({
      resetCode: [''],
      email: [''],
      newPassword: ['']
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearMessage(): void {
    this.message = '';
    this.messageType = '';
  }

  onSubmit(): void {
    this.isLoading = true;
    this.profileService.resetPassword(
      this.resetPasswordForm.value.resetCode,
      this.resetPasswordForm.value.email,
      this.resetPasswordForm.value.newPassword
    ).subscribe({
      next: () => {
        setTimeout(() => {
          this.isLoading = false;
          this.message = 'Password reset successfully!';
          this.messageType = 'success';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        }, 1000);
      },
      error: () => {
        this.isLoading = false;
        this.message = 'Failed to reset password. Try again.';
        this.messageType = 'error';
      }
    });
  }
}