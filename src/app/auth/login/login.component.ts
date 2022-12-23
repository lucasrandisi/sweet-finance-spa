import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	form: FormGroup;
	public hidePassword     : boolean = true;

	constructor(
		private authService: AuthService,
		private router: Router,
		private snackBar : SnackBarService,
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

	async submit() {
		if(this.form.get("email")?.value == '' || this.form.get("password")?.value == ''){
            return;
        }

        if(!this.form.get("email")?.value.includes('@')){
            this.snackBar.show("El email no es una dirección de correo válida.");
            return;
        }

        await this.authService.login(
            this.form.get("email")?.value,
            this.form.get("password")?.value,
        );
        
		this.router.navigate(['']);

	}
}
