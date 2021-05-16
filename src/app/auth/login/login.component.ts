import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	form: FormGroup;

	constructor(
		private authService: AuthService
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
			response => console.log(response)
		);
	}
}
