import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { BrandP } from '../../shared/interfaces/brand-p';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { CatP } from '../../shared/interfaces/cat-p';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/Wishlist/wishlist.service';
import { Datum } from '../../shared/interfaces/iwish-list';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, TranslatePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private readonly ProductsService = inject(ProductsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);
  dataWish: Datum[] = [];
  wishIds: string[] = [];
  cats: CatP[] = [];
  brands: BrandP[] = [];
  brandId: string = '';
  ids: string[] = [];
  ngOnInit(): void {
    this.getId();
    this.getBrand();
    this.getProdCat();
    this.getWishList();
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
  getId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (res) => {
        this.brandId = res.get('id')!;
      },
    });
  }
  getBrand(): void {
    this.ProductsService.getProductsOfBrand(this.brandId).subscribe({
      next: (res) => {
        this.brands = res.data;
      },
    });
  }

  getProdCat(): void {
    this.ProductsService.getProductsOfCategories(this.brandId).subscribe({
      next: (res) => {
        this.cats = res.data;
      },
    });
  }
  getWishList(): void {
    this.wishlistService.getFav().subscribe({
      next: (res) => {
        this.dataWish = res.data;
        this.dataWish.forEach((product) => {
          this.wishIds.push(product.id);
        });
      },
    });
  }
  toggleFav(id: string) {
    this.wishlistService.addFav(id).subscribe({
      next: (res) => {
        this.toastrService.success(res.message);
        this.ids = res.data;
      },
    });
  }
}
