import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
	form: FormGroup;

	public hidePassword     : boolean = true;
	public hideConfirmPassword : boolean = true;

	constructor(
		private authService: AuthService,
		private router: Router,
		private snackBar : SnackBarService,
	) { }

	ngOnInit(): void {
		this.initializeForm();
	}

	public initializeForm() {
		this.form = new FormGroup({
			name: new FormControl(),
			email: new FormControl(),
			password: new FormControl(),
			password_confirmation: new FormControl()
		});
	}

	public async submit(){    
		if(this.form.get("email")?.value == '' || this.form.get("password")?.value == '' 
			|| this.form.get("nombre")?.value == '' || this.form.get("password_confirmation")?.value == ''){
            return;
        }

        if(!this.form.get("email")?.value.includes('@')){
            this.snackBar.show("El email no es una dirección de correo válida.");
            return;
        }

		if(this.form.get("password")?.value != this.form.get("password_confirmation")?.value){
			this.snackBar.show("Las contraseñas no coinciden.");
            return;
		}

		if(this.form.get("password")?.value.length < 6){
			this.snackBar.show("La contraseña debe tener más de 6 caracteres.");
            return;
		}

		await this.authService.registrar(
			this.form.get("name")?.value,
			this.form.get("email")?.value,
			this.form.get("password")?.value,
			this.form.get("password_confirmation")?.value,
		);
		this.router.navigateByUrl('/login');

		this.snackBar.show("Cuenta creada con éxito.");
		
    }

	public navegar(path: string){
		this.router.navigateByUrl(path);
	}
}
