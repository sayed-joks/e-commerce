import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/catergories/categories.service';
import { ICategories } from '../../shared/interfaces/icategories';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  allCat: ICategories[] = [];
  ngOnInit(): void {
    this.getCat();
  }
  getCat(): void {
    this.categoriesService.getAllCategory().subscribe({
      next: (res) => {
        this.allCat = res.data;
      },
    });
  }
}
