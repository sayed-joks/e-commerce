import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../core/services/Authentication/authentication.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  step: number = 1;
  verifyEmail: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });
  verifyCode: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [
      Validators.required,
      Validators.pattern(/[0-9]{6}/),
    ]),
  });
  resetPassword: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [
      Validators.required,
      Validators.pattern(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$/
      ),
    ]),
  });
  submitEmail(): void {
    let emailValue = this.verifyEmail.get('email')?.value;
    this.resetPassword.get('email')?.patchValue(emailValue);
    this,
      this.authenticationService
        .forgotPassword(this.verifyEmail.value)
        .subscribe({
          next: (res) => {
            if (res.statusMsg == 'success') {
              this.step = 2;
            }
          },
        });
  }
  submitCode(): void {
    this.authenticationService
      .verifyResetCode(this.verifyCode.value)
      .subscribe({
        next: (res) => {
          if (res.status == 'Success') {
            this.step = 3;
          }
        },
      });
  }
  setPassword(): void {
    this.authenticationService
      .resetPassword(this.resetPassword.value)
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/home']);
          this.authenticationService.saveUserDate();
        },
      });
  }
}
