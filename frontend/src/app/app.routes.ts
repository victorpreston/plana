import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EventsComponent } from './components/events/events.component';
import { OrganiserComponent } from './components/organiser/organiser.component';
import { DashboardComponent } from './components/organiser/dashboard/dashboard.component';
import { BookingsComponent } from './components/organiser/bookings/bookings.component';
import { TicketsComponent } from './components/organiser/tickets/tickets.component';
import { InboxComponent } from './components/organiser/inbox/inbox.component';
import { AttendeesComponent } from './components/organiser/attendees/attendees.component';
import { SettingsComponent } from './components/organiser/settings/settings.component';
import { EventComponent } from './components/organiser/events/events.component';
export const routes: Routes = [
    { path: '', component: LandingComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'events', component: EventsComponent},
    {
        path: 'organiser',
        component: OrganiserComponent,
        children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'events', component: EventComponent },
          { path: 'bookings', component: BookingsComponent },
          { path: 'tickets', component: TicketsComponent },
          { path: 'inbox', component: InboxComponent },
          { path: 'attendees', component: AttendeesComponent },
          { path: 'settings', component: SettingsComponent },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
      },
];
