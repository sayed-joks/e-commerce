import { Component, inject, OnInit } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CartService } from '../../core/services/cart/cart.service';
import { ProductsService } from '../../core/services/products/products.service';
import { ICategories } from '../../shared/interfaces/icategories';
import { CurrencyPipe, NgClass, NgFor } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { FormsModule } from '@angular/forms';
import { Iproduct } from '../../shared/interfaces/iproduct';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/Wishlist/wishlist.service';
import { Datum } from '../../shared/interfaces/iwish-list';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [
    CurrencyPipe,
    CarouselModule,
    SearchPipe,
    FormsModule,
    TranslatePipe,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);
  products: Iproduct[] = [];
  allCat: ICategories[] = [];
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 40;
  nextPage: number | null = null;
  text: string = '';
  ids: string[] = [];
  dataWish: Datum[] = [];
  wishIds: string[] = [];

  ngOnInit(): void {
    this.showAllProducts(this.currentPage);
    this.getWishList();
  }
  showAllProducts(page: number): void {
    this.productsService.getAllProducts(page).subscribe({
      next: (res) => {
        this.products = res.data;
        this.currentPage = res.metadata.currentPage;
        this.totalPages = res.metadata.numberOfPages;
        this.nextPage = res.metadata.nextPage || null;
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
  onPageChange(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.showAllProducts(page);
    }
  }
  getWishList(): void {
    this.wishlistService.getFav().subscribe({
      next: (res) => {
        this.dataWish = res.data;
        this.dataWish.forEach((product) => {
          this.wishIds.push(product.id);
        });
        console.log(this.wishIds);
      },
    });
  }
  toggleFav(id: string) {
    this.wishlistService.addFav(id).subscribe({
      next: (res) => {
        this.toastrService.success(res.message);
        console.log(res.data);
        this.ids = res.data;
      },
    });
  }
}
