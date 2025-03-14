import { Component, inject, OnInit } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrands } from '../../shared/interfaces/ibrands';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brands',
  imports: [RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  allBrand: IBrands[] = [];
  ngOnInit(): void {
    this.getBrands();
  }
  getBrands(): void {
    this.brandsService.getAllBradns().subscribe({
      next: (res) => {
        console.log(res);
        this.allBrand = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
