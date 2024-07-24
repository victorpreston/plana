import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profiles/profile.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-reset-password-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './reset-password-request.component.html',
  styleUrls: ['./reset-password-request.component.css']
})
export class ResetPasswordRequestComponent {
  resetPasswordRequestForm: FormGroup;
  isLoading: boolean = false;
  message: string = '';

  constructor(private fb: FormBuilder, private profileService: ProfileService, private router: Router) {
    this.resetPasswordRequestForm = this.fb.group({
      email: ['']
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.profileService.requestPasswordReset(this.resetPasswordRequestForm.value.email).subscribe({
      next: () => {
        setTimeout(() => {
          this.isLoading = false;
          this.message = 'Email sent successfully!';
          setTimeout(() => {
            this.router.navigate(['/reset-password']);
          }, 1500);
        }, 1000);
      },
      error: () => {
        this.isLoading = false;
        this.message = 'Failed to send email. Try again.';
      }
    });
  }
}
