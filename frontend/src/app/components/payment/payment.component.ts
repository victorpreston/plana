import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;
  bookingId: string | null = null;

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      cardName: ['', Validators.required],
      expiryDate: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.bookingId = params['bookingId'];
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      console.log('Payment details:', this.paymentForm.value);
      // Handle payment submission
      alert('Payment successful!');
    } else {
      alert('Please fill in all required fields.');
    }
  }
}