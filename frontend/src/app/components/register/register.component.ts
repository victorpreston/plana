import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    terms: new FormControl(false, Validators.requiredTrue)
  });

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.registerForm.valid) {
      const email = this.registerForm.get('email')!.value!;
      const password = this.registerForm.get('password')!.value!;
      const name = this.registerForm.get('name')!.value!;
      const phone = this.registerForm.get('phone')!.value!;
      const [firstName, lastName] = name.split(' '); // Assuming the name field contains both first and last name
      this.authService.register(email, password, firstName, lastName, phone).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          // Handle registration error
        }
      });
    } else {
      // Handle form errors
      console.log('Form is invalid');
    }
  }
}
