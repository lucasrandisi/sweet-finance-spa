import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInterface } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss']
})
export class MisDatosComponent implements OnInit {
	form: FormGroup;
	currentUser: any;

	constructor(
		private userService: UserService,
		private authService: AuthService,
		private snackBar: MatSnackBar
	) { }

	ngOnInit(): void {
		this.currentUser = this.authService.getCurrentUser();
		this.initForm();
	}

	initForm() {
		this.form = new FormGroup({
			email: new FormControl(this.currentUser.email, [Validators.required]),
			name: new FormControl(this.currentUser.name, [Validators.required]),
		});
	}

	onSubmit() {
		if (this.form.valid) {
			/*
			this.userService.updateMe(this.form.value).subscribe({
				next: () => console.log('Datos guardados', 'done'),
				error: () => console.log('Ocurrió un error al guardar los datos', 'close')
			});
			*/
		}
	}

}
