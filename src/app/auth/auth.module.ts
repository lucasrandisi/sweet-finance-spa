import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [
		LoginComponent,
		RegisterComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		SharedModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
	],
})
export class AuthModule { }
