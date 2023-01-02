import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss']
})
export class MisDatosComponent implements OnInit {
	public form!: FormGroup;
	public user: any;

	constructor(
		private authService : AuthService,
		private snackBar : SnackBarService,
		private apiService : ApiService,
		private router: Router,
	) { }

	async ngOnInit(): Promise<void> {
		await this.authService.getCurrentUser().then((usuario) => {
			this.user = usuario;
		});
		this.inicializarForm();
	}

	public inicializarForm() {
		this.form = new FormGroup({
			email: new FormControl(''),
			nombre: new FormControl(''),
		});

		this.form.get('email')?.setValue(this.user.email);
		this.form.get('nombre')?.setValue(this.user.name);
	}

	public async submit() {
		if (!this.form.valid) {
			return;
		}

		let response = await this.apiService.patch('/me', {
			email: this.form.get('email')?.value,
			name: this.form.get('nombre')?.value,
		});

		this.authService.setCurrentUser(response);

		this.snackBar.show("Cambios guardados con éxito.");
		this.router.navigateByUrl('/');
	}

}
