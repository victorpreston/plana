import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from "../footer/footer.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, NavbarComponent, FooterComponent, FooterComponent, RouterLink]
})
export class LandingComponent {
  yearsCount: number = 0;
  attendedCount: number = 0;
  attendeesCount: number = 0;
  usersCount: number = 0;

  private readonly yearsTarget: number = 6;
  private readonly attendedTarget: number = 5000;
  private readonly attendeeTarget: number = 400;
  private readonly userTarget: number = 6000;

  ngOnInit(): void {
    this.animateCount('yearsCount', this.yearsTarget, 50);
    this.animateCount('attendedCount', this.attendedTarget, 20);
    this.animateCount('attendeesCount', this.attendeeTarget, 50);
    this.animateCount('usersCount', this.userTarget, 20);
  }

  private animateCount(property: string, target: number, duration: number): void {
    const increment = target / duration;
    let count = 0;

    const interval = setInterval(() => {
      count += increment;
      if (count >= target) {
        count = target;
        clearInterval(interval);
      }
      (this as any)[property] = Math.ceil(count);
    }, 50);
  }
}
