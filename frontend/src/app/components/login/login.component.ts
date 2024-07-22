// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { NavbarComponent } from '../navbar/navbar.component';
// import { FooterComponent } from '../footer/footer.component';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../services/auth/auth.service';
// import { User, Role } from '../../interfaces/user';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [RouterLink, ReactiveFormsModule, NavbarComponent, FooterComponent, CommonModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   loginForm: FormGroup;

//   constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//     });
//   }

//   onSubmit() {
//     if (this.loginForm.valid) {
//       const { email, password } = this.loginForm.value;
//       this.authService.login(email, password).subscribe({
//         next: ({ user, token }) => {
//           console.log('Login successful', user, token);
//           this.authService.setUser(user, token);
//           this.handleRedirection(user);
//         },
//         error: (error) => {
//           console.error('Login failed', error);
//           // Handle login error
//         }
//       });
//     }
//   }

//   private handleRedirection(user: User) {
//     switch (user.role) {
//       case Role.ATTENDEE:
//         this.router.navigate(['/events']);
//         break;
//       case Role.MANAGER:
//         this.router.navigate(['/organiser/dashboard']);
//         break;
//       case Role.ADMIN:
//         this.router.navigate(['/admin/analytics']);
//         break;
//       default:
//         this.router.navigate(['/']);
//         break;
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Get the return URL from query parameters
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || null;
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: ({ user, token }) => {
          console.log('Login successful', user, token);
          this.authService.setUser(user, token);
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
    if (this.returnUrl) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      switch (user.role) {
        case Role.ATTENDEE:
          this.router.navigate(['/events']);
          break;
        case Role.MANAGER:
          this.router.navigate(['/organiser/dashboard']);
          break;
        case Role.ADMIN:
          this.router.navigate(['/admin/analytics']);
          break;
        default:
          this.router.navigate(['/']);
          break;
      }
    }
  }
}