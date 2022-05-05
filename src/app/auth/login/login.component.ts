import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	form: FormGroup;

	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	ngOnInit(): void {
		this.initializeForm();
	}

	initializeForm() {
		this.form = new FormGroup({
			email: new FormControl(),
			password: new FormControl(),
		});
	}

	submit() {
		this.authService.login(this.form.value).subscribe(
			() => this.router.navigate(['']),
			(error:any)=>{
				Swal.fire('Usuario o contraseña incorrectos', 'Por favor, intentalo nuevamente', 'error');
		});
		
	}
}
