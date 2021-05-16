import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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
			name: new FormControl(),
			email: new FormControl(),
			password: new FormControl(),
			password_confirmation: new FormControl()
		});
	}

	submit() {
		this.authService.registerUser(this.form.value).subscribe(
			() => this.router.navigate([''])
		);
	}
}
