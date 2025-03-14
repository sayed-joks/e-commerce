import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private httpClient:HttpClient) { }

  getAllCategory(): Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories`);
  }
  getSpecificCategory(id:string): Observable<any>{
    return this.httpClient.get(
      `${environment.baseUrl}/categories/${id}`
    );
  }
  
}
