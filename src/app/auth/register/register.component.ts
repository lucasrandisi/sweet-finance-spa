import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
	form: FormGroup;

	constructor(
		private authService: AuthService
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
			response => console.log(response)
		);
	}
}
