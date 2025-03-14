import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/Wishlist/wishlist.service';
import { IWishList } from '../../shared/interfaces/iwish-list';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe, TranslatePipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  allWish: IWishList = {} as IWishList;
  ngOnInit(): void {
    this.getWishList();
  }
  getWishList(): void {
    this.wishlistService.getFav().subscribe({
      next: (res) => {
        this.allWish = res;
      },
    });
  }
  addToCart(id: string): void {
    this.cartService.AddProductToCart(id).subscribe({
      next: (res) => {
        this.toastrService.success(res.message, 'FreshCart');
        this.cartService.numOfCart.next(res.numOfCartItems);
        this.cartService.totalPrice.next(res.data.totalCartPrice);
      },
    });
  }
  removeFav(id: string): void {
    this.wishlistService.removeFav(id).subscribe({
      next: (res) => {
        this.toastrService.success(res.message, 'FreshCart');
        this.getWishList();
      },
    });
  }
}
