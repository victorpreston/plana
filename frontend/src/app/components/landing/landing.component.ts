import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLocationArrow, faSearch, faArrowRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, NavbarComponent, FooterComponent, FooterComponent]
})
export class LandingComponent {
  faLocationArrow = faLocationArrow;
  faSearch = faSearch;
  faArrowRight = faArrowRight;
  faCheckCircle = faCheckCircle;
}
