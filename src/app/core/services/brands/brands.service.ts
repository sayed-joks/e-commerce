import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  constructor(private httpClient:HttpClient) { }
  getAllBradns(): Observable<any>{
    return this.httpClient
      .get(`${environment.baseUrl}/api/v1/brands
`);
  }
  getSpecificBrand(id:string): Observable<any>{
    return this.httpClient.get(
      `${environment.baseUrl}/api/v1/brands/${id}`
    );
  }
}
