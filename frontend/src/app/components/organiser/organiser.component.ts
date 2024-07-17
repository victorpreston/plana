import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponentManager } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-organiser',
  standalone: true,
  imports: [RouterOutlet, NavbarComponentManager, SidebarComponent],
  templateUrl: './organiser.component.html',
  styleUrl: './organiser.component.css'
})
export class OrganiserComponent {

}
