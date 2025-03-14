import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../shared/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private httpClient: HttpClient) {}

  signUp(data: object): Observable<any> {
    return this.httpClient.post(
      `https://ecommerce.routemisr.com/api/v1/auth/signup`,
      data
    );
  }
  signing(data: any): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signin`,
      data
    );
  }
  forgotPassword(data: any): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/forgotPasswords`,
      data
    );
  }
  verifyResetCode(data: any): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/verifyResetCode`,
      data
    );
  }
  changeMyPassword(data: any): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/api/v1/users/changeMyPassword`,
      data
    );
  }
  resetPassword(data: any): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/api/v1/auth/resetPassword`,
      data
    );
  }
  updateLoggedUserdata(data: any): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/api/v1/users/updateMe/`,
      data
    );
  }
  saveUserDate(): void {
    let userData = jwtDecode(localStorage.getItem('token')!);
  }
}
