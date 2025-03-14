import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../core/services/Authentication/authentication.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, Event, NavigationEnd, RouterLink } from '@angular/router';
import { IStaticMethods } from 'flyonui/flyonui';
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}
import { type HSAccordion } from 'flyonui/flyonui';
import { TranslatePipe } from '@ngx-translate/core';
declare global {
  interface Window {
    HSAccordion: typeof HSAccordion; // Specific JS Component
  }
}

if (event instanceof NavigationEnd) {
  setTimeout(() => {
    window.HSAccordion.autoInit(); // Add particular component `autoInit()` method
  }, 100);
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 100);
      }
    });
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 100);
      }
    });
  }

  signin: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$/
      ),
    ]),
  });
  submit(): void {
    this.authenticationService.signing(this.signin.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.message == 'success') {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/home']);
        }
      },
    });
  }
  get emailErrorMessage() {
    if (this.signin.get('email')?.hasError('required')) {
      return 'Email is required.';
    }
    if (this.signin.get('email')?.hasError('email')) {
      return 'Invalid email format.';
    }
    return '';
  }
  get passwordErrorMessage() {
    if (this.signin.get('password')?.hasError('required')) {
      return 'Password is required.';
    }
    if (this.signin.get('password')?.hasError('pattern')) {
      return 'Password must be 8-20 characters and include uppercase, lowercase, number, and special character.';
    }
    return '';
  }
}
