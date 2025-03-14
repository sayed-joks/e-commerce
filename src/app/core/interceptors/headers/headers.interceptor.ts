import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  let id = inject(PLATFORM_ID);
  if (
    req.url.includes('cart') ||
    req.url.includes('checkout') ||
    req.url.includes('home') ||
    req.url.includes('wishlist')
  ) {
    if (isPlatformBrowser(id)) {
      req = req.clone({
        setHeaders: {
          token: localStorage.getItem('token')!,
        },
      });
    }
  }
  return next(req);
};
