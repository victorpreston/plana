import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-attendees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.css']
})
export class AttendeesComponent implements AfterViewInit {
  attendees = [
    {
      id: 1,
      profileImage: 'assets/profile.png',
      name: 'Gladys Jones',
      email: 'gladys@example.com',
      contact: '+1 (123) 456-7890',
      ticketPrice: 50.00,
      event: {
        name: 'Summer Festival',
        ticketType: 'VIP'
      }
    },
    {
      id: 2,
      profileImage: 'assets/profile.png',
      name: 'Jennie Cooper',
      email: 'jennie@example.com',
      contact: '+1 (987) 654-3210',
      ticketPrice: 30.00,
      event: {
        name: 'Tech Conference',
        ticketType: 'Regular'
      }
    },
    {
      id: 3,
      profileImage: 'assets/profile.png',
      name: 'Jennie Cooper',
      email: 'jennie@example.com',
      contact: '+1 (987) 654-3210',
      ticketPrice: 30.00,
      event: {
        name: 'Tech Conference',
        ticketType: 'Regular'
      }
    },
    {
      id: 4,
      profileImage: 'assets/profile.png',
      name: 'Jennie Cooper',
      email: 'jennie@example.com',
      contact: '+1 (987) 654-3210',
      ticketPrice: 30.00,
      event: {
        name: 'Tech Conference',
        ticketType: 'Regular'
      }
    }
  ];

  ngAfterViewInit() {
    this.attendees.forEach(attendee => {
      const button = document.getElementById(`profile-${attendee.id}`);
      const popover = document.getElementById(`popover-attendee-${attendee.id}`);

      if (button && popover) {
        createPopper(button, popover, {
          placement: 'right',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [8, 8],
              },
            },
            {
              name: 'preventOverflow',
              options: {
                boundariesElement: 'viewport',
              },
            },
          ],
        });
      }
    });
  }

  showPopover(id: number) {
    const popover = document.getElementById(`popover-attendee-${id}`);
    if (popover) {
      popover.classList.remove('hidden');
      popover.classList.add('block');
    }
  }

  hidePopover(id: number) {
    const popover = document.getElementById(`popover-attendee-${id}`);
    if (popover) {
      popover.classList.remove('block');
      popover.classList.add('hidden');
    }
  }
}