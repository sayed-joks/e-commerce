import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { Iproduct } from '../../shared/interfaces/iproduct';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-details',
  imports: [CurrencyPipe, TranslatePipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  idProduct: string = '';
  product: Iproduct = {} as Iproduct;
  imgSorce: string = this.product.imageCover;
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      (param) => (this.idProduct = param.get('id')!)
    );
    this.getSubProduct();
  }
  getSubProduct(): void {
    this.productsService.getSpecificProduct(this.idProduct).subscribe({
      next: (res) => {
        console.log(res.data);

        this.product = res.data;
      },
    });
  }
  getSorce(e: string): void {
    this.imgSorce = e;
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
}
