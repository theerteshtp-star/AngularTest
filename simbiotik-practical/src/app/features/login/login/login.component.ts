import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
   standalone: true,
  imports:[CommonModule,ReactiveFormsModule]
})
export class LoginComponent {
  loading = false;
  error = '';
  form!: FormGroup; 

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}
ngOnInit(){
 this.form= this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
}
  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { username, password } = this.form.value;
    this.auth.login(username!, password!).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/']);; },
      error: (err) => { this.loading = false; this.error = err?.error?.message || 'Login failed'; }
    });
  }
}
