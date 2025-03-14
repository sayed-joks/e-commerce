import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrdersService } from '../../core/services/orders/orders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-chechout',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './chechout.component.html',
  styleUrl: './chechout.component.scss',
})
export class ChechoutComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly ActivatedRoute = inject(ActivatedRoute);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  private readonly cartService = inject(CartService);

  cartId: string = '';
  ngOnInit(): void {
    this.getID();
  }
  checkout: FormGroup = new FormGroup({
    details: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^01[0-9]{9}$/),
    ]),
    city: new FormControl(null, [Validators.required]),
  });
  get phoneErrorMessage() {
    if (this.checkout.get('phone')?.hasError('required')) {
      return this.translateService.instant('register.errors.phoneRequired');
    }
    if (this.checkout.get('phone')?.hasError('pattern')) {
      return this.translateService.instant('register.errors.phoneInvalid');
    }
    return '';
  }
  get cityErrorMessage() {
    if (this.checkout.get('city')?.hasError('required')) {
      return this.translateService.instant('cityRequired');
    }
    return '';
  }
  get detailsErrorMessage() {
    if (this.checkout.get('details')?.hasError('required')) {
      return this.translateService.instant('detailsRequired');
    }
    return '';
  }
  getID(): void {
    this.ActivatedRoute.paramMap.subscribe({
      next: (par) => {
        this.cartId = par.get('id')!;
      },
    });
  }
  cash(): void {
    this.ordersService
      .cashOrder(this.cartId, this.checkout.value)
      .subscribe((res) => {
        this.toastrService.success(
          'Your request has been sent successfully',
          'FreshCart'
        );
        this.cartService.numOfCart.next(0);
        this.cartService.totalPrice.next(0);
        setTimeout(() => {
          this.router.navigate(['/allorders']);
        }, 3000);
      });
  }
  payOnline(): void {
    this.ordersService
      .checkOut(this.cartId, this.checkout.value)
      .subscribe((res) => {
        open(res.session.url, '_self');
      });
  }
}
