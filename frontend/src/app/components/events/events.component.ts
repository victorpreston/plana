import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      location: [''],
      category: [''],
      time: this.fb.group({
        anytime: [false],
        thisWeek: [false],
        nextWeek: [false],
        thisMonth: [false],
        nextMonth: [false],
        thisYear: [false]
      }),
      price: [0],
      search: ['']
    });
  }

  onClearFilters() {
    this.filterForm.reset({
      location: '',
      category: '',
      time: {
        anytime: false,
        thisWeek: false,
        nextWeek: false,
        thisMonth: false,
        nextMonth: false,
        thisYear: false
      },
      price: 0,
      search: ''
    });
  }

  onSearch() {
    const filters = this.filterForm.value;
    console.log(filters);
  }
}