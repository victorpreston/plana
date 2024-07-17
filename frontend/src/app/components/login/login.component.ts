import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { User, Role } from '../../interfaces/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: ({ user, token }) => {
          console.log('Login successful', user, token);
          this.handleRedirection(user);
        },
        error: (error) => {
          console.error('Login failed', error);
          // Handle login error
        }
      });
    }
  }

  private handleRedirection(user: User) {
    switch (user.role) {
      case Role.ATTENDEE:
        this.router.navigate(['/attendee']);
        break;
      case Role.MANAGER:
        this.router.navigate(['/organiser']);
        break;
      case Role.ADMIN:
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }
}
