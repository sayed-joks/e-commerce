import { Component, inject, input, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IJwtDecode } from '../../shared/interfaces/jwt-decode';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { MyTranslateService } from '../../core/services/translate/my-translate.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, FormsModule, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isLogin = input<boolean>(true);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly myTranslateService = inject(MyTranslateService);
  private readonly Router = inject(Router);
  private readonly platId = inject(PLATFORM_ID);
  cartNum: number = 0;
  totalPrice: number = 0;
  isChecked: boolean = false;
  userData: IJwtDecode = {} as IJwtDecode;

  ngOnInit() {
    if (isPlatformBrowser(this.platId)) {
      if (localStorage.getItem('token')) {
        this.userData = jwtDecode(localStorage.getItem('token')!);
      }
      if (localStorage.getItem('token')) {
        this.cartService.numOfCart.subscribe({
          next: (num) => {
            this.cartNum = num;
          },
        });
        this.cartService.totalPrice.subscribe({
          next: (num) => {
            this.totalPrice = num;
          },
        });
        this.cartService.getCart().subscribe({
          next: (res) => {
            this.cartService.numOfCart.next(res.numOfCartItems);
            this.cartService.totalPrice.next(res.data.totalCartPrice);
          },
        });
      }
      document.documentElement.classList.toggle(
        'dark',
        localStorage.getItem('theme') === 'dark' ||
          (!('theme' in localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
      if (
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        this.isChecked = true;
      }
    }
  }
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  changed(evt: any) {
    this.isChecked = evt.target.checked;
    if (evt.target.checked) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
    document.documentElement.classList.toggle(
      'dark',
      localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
    console.log(this.userData);
  }
  change(lang: string): void {
    this.myTranslateService.changeLang(lang);
  }
}
