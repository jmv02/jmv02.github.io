import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../types';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmpwd: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private authService: AuthService,private router: Router) {
  }
  
  register(): void {
    if (this.registerForm.valid) {
      const { email, username, password ,confirmpwd} = this.registerForm.value;
      if (typeof email === "string" && typeof username === "string" && typeof password === "string"&& typeof confirmpwd === "string") {
        if(password !== confirmpwd){
          console.log("Contraseñas no coinciden")
          return;
        }
        this.authService.register(email, username, password).subscribe({
          next: (response) => {
            console.log('El usuario se ha registrado correctamente', response);
            this.router.navigate([''])
          }
        });
      }
    }
  }
}
