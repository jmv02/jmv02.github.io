import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  regexp = new RegExp(/^[a-z]([a-z0-9]*)@[a-z]+(-[a-z]+)?\.[a-z]+$/);
  constructor(private authService: AuthService, private router: Router) { }

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.email, Validators.required]),
    password: new FormControl("", [Validators.required])
  })
  login(): void {
   if(this.loginForm.valid){
    const { email,password} = this.loginForm.value;
    if (email?.match(this.regexp) && password) {
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log("Email: " + email, "Password: " + password, "Response: " + response);
          this.authService.saveToken(response.token)
          this.router.navigate(['/home'])
        }
      }) 
    } else {
      this.router.navigate(['/']);
    }
    }
  } 
  getValidations() {
    return this.loginForm.controls;
  }
}
