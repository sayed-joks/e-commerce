import { CurrencyPipe, DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { OrdersService } from '../../core/services/orders/orders.service';
import { jwtDecode } from 'jwt-decode';
import { IJwtDecode } from '../../shared/interfaces/jwt-decode';
import { IallOrders } from '../../shared/interfaces/iall-orders';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-allorders',
  imports: [CurrencyPipe, DatePipe, TranslatePipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss',
})
export class AllordersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly id = inject(PLATFORM_ID);
  userData: IJwtDecode = {} as IJwtDecode;
  allUserOrders: IallOrders[] = [];
  ngOnInit(): void {
    this.userData = jwtDecode(localStorage.getItem('token')!);
    this.getUserOrders();
  }
  getUserOrders(): void {
    this.ordersService.getUserOrders(this.userData.id).subscribe({
      next: (res) => {
        console.log(res);
        this.allUserOrders = res;
      },
    });
  }
}
