import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../shared/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private httpClient: HttpClient) {}
  userToken = localStorage.getItem('token');
  cashOrder(id: string, data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/orders/${id}`,
      {
        shippingAddress: data,
      },
      {
        headers: {
          token: this.userToken!,
        },
      }
    );
  }
  getAllOrders(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/orders/`);
  }
  getUserOrders(id: string): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}/api/v1/orders/user/${id}`
    );
  }
  checkOut(id: string, data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${id}?url=https://e-commerce-lyart-nine-68.vercel.app`,
      {
        shippingAddress: data,
      }
    );
  }
}
