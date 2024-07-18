import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private router: Router) {}

  logout() {
    // Clear user data or token
    setTimeout(() => {
      // Clear token
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect after 2000 milliseconds
      this.router.navigate(['/']);
    }, 2000);
  }
}
