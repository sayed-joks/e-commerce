import { Component, inject, PLATFORM_ID } from '@angular/core';
import { AuthenticationService } from '../../core/services/Authentication/authentication.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);

  isLoading: boolean = false;
  register: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$/
        ),
      ]),
      rePassword: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^01[0-9]{9}$/),
      ]),
    },
    this.confirmPassword
  );
  submit(): void {
    this.isLoading = true;
    this.authenticationService.signUp(this.register.value).subscribe({
      next: (res) => {
        if (res.message == 'success') {
          this.router.navigate(['/login']);
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }
  get nameErrorMessage() {
    if (this.register.get('name')?.hasError('required')) {
      return this.translateService.instant('register.errors.nameRequired');
    }
    if (this.register.get('name')?.hasError('minlength')) {
      return this.translateService.instant('register.errors.nameMinLength');
    }
    if (this.register.get('name')?.hasError('maxlength')) {
      return this.translateService.instant('register.errors.nameMaxLength');
    }
    return '';
  }
  get emailErrorMessage() {
    if (this.register.get('email')?.hasError('required')) {
      return this.translateService.instant('register.errors.emailRequired');
    }
    if (this.register.get('email')?.hasError('email')) {
      return this.translateService.instant('register.errors.emailInvalid');
    }
    return '';
  }
  get passwordErrorMessage() {
    if (this.register.get('password')?.hasError('required')) {
      return this.translateService.instant('register.errors.passwordRequired');
    }
    if (this.register.get('password')?.hasError('pattern')) {
      return this.translateService.instant('register.errors.passwordInvalid');
    }
    return '';
  }
  get rePasswordErrorMessage() {
    if (this.register.get('rePassword')?.hasError('required')) {
      return this.translateService.instant(
        'register.errors.rePasswordRequired'
      );
    }
    if (this.register.getError('missmatch')) {
      return this.translateService.instant('register.errors.passwordMismatch');
    }
    return '';
  }
  get phoneErrorMessage() {
    if (this.register.get('phone')?.hasError('required')) {
      return this.translateService.instant('register.errors.phoneRequired');
    }
    if (this.register.get('phone')?.hasError('pattern')) {
      return this.translateService.instant('register.errors.phoneInvalid');
    }
    return '';
  }
  confirmPassword(group: AbstractControl) {
    let password = group.get('password')?.value;
    let rePassword = group.get('rePassword')?.value;
    if (password == rePassword) {
      return null;
    } else {
      return { missmatch: true };
    }
  }
}
