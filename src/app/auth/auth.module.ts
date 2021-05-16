import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
	declarations: [
		LoginComponent,
		RegisterComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
	],
	providers: [
		AuthService
	]
})
export class AuthModule { }
