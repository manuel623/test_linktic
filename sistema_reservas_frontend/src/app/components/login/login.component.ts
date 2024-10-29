import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  activeButton: boolean = false;

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
   }

  ngOnInit(): void { }

  /** 
   * Verifica la autenticación del usuario
   */
  verificationLogin(): void {
    if (this.loginForm.valid) {
      this.activeButton = true;
      const datos = this.loginForm.value;
      this.authService.login({ email: datos.email, password: datos.password }).subscribe(
        (response) => {
          localStorage.setItem('token', JSON.stringify(response.token));
          localStorage.setItem('user', JSON.stringify(response.user));
          this.activeButton = false;
          this._router.navigate(['/admin']);
        },
        (error) => {          
          this.activeButton = false;
          Swal.fire({
            title: 'Advertencia',
            text: error.error.message || 'Ocurrió un error.',
            icon: 'warning',
            confirmButtonText: 'OK',
          });
        }
      );
    }
  }
}
