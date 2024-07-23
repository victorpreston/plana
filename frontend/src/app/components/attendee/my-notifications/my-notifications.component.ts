import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-notifications',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './my-notifications.component.html',
  styleUrl: './my-notifications.component.css'
})
export class MyNotificationsComponent {

}
