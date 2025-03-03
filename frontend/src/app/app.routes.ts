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
import { AdminComponent } from './components/admin/admin.component';
import { UsersComponent } from './components/admin/users/users.component';
import { AnalyticsComponent } from './components/admin/analytics/analytics.component';
import { ManagersComponent } from './components/admin/managers/managers.component';
import { AllEventsComponent } from './components/admin/all-events/all-events.component';
import { CategoriesComponent } from './components/admin/categories/categories.component';
import { ProfileSettingsComponent } from './components/admin/profile-settings/profile-settings.component';
import { CalendarComponent } from './components/admin/calendar/calendar.component';
import { MessagesComponent } from './components/admin/messages/messages.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { PaymentComponent } from './components/payment/payment.component';
import { MySettingsComponent } from './components/attendee/my-settings/my-settings.component';
import { MyBookingsComponent } from './components/attendee/my-bookings/my-bookings.component';
import { MyTicketsComponent } from './components/attendee/my-tickets/my-tickets.component';
import { MyNotificationsComponent } from './components/attendee/my-notifications/my-notifications.component';
import { MyCalendarComponent } from './components/attendee/my-calendar/my-calendar.component';
import { ResetPasswordRequestComponent } from './components/reset-password-request/reset-password-request.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

export const routes: Routes = [
    { path: '', component: LandingComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'events', component: EventsComponent},
    { path: 'events/:id', component: EventDetailsComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'my-settings', component: MySettingsComponent },
    { path: 'my-bookings', component: MyBookingsComponent },
    { path: 'my-tickets', component: MyTicketsComponent },
    { path: 'my-notifications', component: MyNotificationsComponent },
    { path: 'my-calendar', component: MyCalendarComponent },
    { path: 'reset-password-request', component: ResetPasswordRequestComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
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
      { path: 'admin', 
        component: AdminComponent, 
        children: [
        { path: 'analytics', component: AnalyticsComponent },
        { path: 'users', component: UsersComponent },
        { path: 'managers', component: ManagersComponent },
        { path: 'messages', component: MessagesComponent},
        { path: 'all-events', component: AllEventsComponent },
        { path: 'categories', component: CategoriesComponent },
        { path: 'profile-settings', component: ProfileSettingsComponent },
        { path: 'calendar', component: CalendarComponent },
        { path: '', redirectTo: 'analytics', pathMatch: 'full' },
        // { path: 'category', component: CategoriesComponent },
      ]},
      { path: '**', component: NotfoundComponent },

];
