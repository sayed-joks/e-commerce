import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { Icart } from '../../shared/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink, TranslatePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  cartDetails: Icart = {} as Icart;
  ngOnInit(): void {
    this.getCart();
  }
  getCart(): void {
    this.cartService.getCart().subscribe({
      next: (res) => {
        console.log(res.data);
        this.cartDetails = res.data;
      },
      error: (errr) => {
        console.log(errr);
      },
    });
  }
  updateCount(id: string, num: number): void {
    this.cartService.updateCountProduct(id, num).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this.cartService.totalPrice.next(res.data.totalCartPrice);
      },
    });
  }
  removeItem(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        });
        this.cartService.removeItem(id).subscribe({
          next: (res) => {
            this.cartDetails = res.data;
            this.cartService.numOfCart.next(res.numOfCartItems);
            this.cartService.totalPrice.next(res.data.totalCartPrice);
            console.log(res);
          },
        });
      }
    });
  }
  clearCart(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Clear All!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        });
        this.cartService.clearCart().subscribe({
          next: (res) => {
            console.log(res);
            if (res.message === 'success') {
              this.cartDetails = {} as Icart;
              this.cartService.numOfCart.next(0);
              this.cartService.totalPrice.next(0);
            }
          },
        });
      }
    });
  }
}
