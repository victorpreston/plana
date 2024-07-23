import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.css'
})
export class MyTicketsComponent {

}
