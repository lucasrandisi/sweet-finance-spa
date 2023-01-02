import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { UserInterface } from 'src/app/shared/models/user.model';
import { ApiService } from 'src/app/shared/services/api.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    form: FormGroup;
    currentUser: UserInterface;

    public hideOldPassword  : boolean = true;
    public hidePassword : boolean = true;
	public hideConfirmPassword : boolean = true;

    constructor(
        private snackBar: SnackBarService,
        private apiService: ApiService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.form = new FormGroup({
            old_password: new FormControl(''),
            new_password: new FormControl(''),
            new_password_confirmation: new FormControl(''),
        });
    }

    public async submit() {
        if (!this.form.valid) {
            return;
        }

        if(this.form.get("new_password")?.value != this.form.get("new_password_confirmation")?.value){
			this.snackBar.show("Las contraseñas no coinciden.");
            return;
		}

		if(this.form.get("new_password")?.value.length < 6){
			this.snackBar.show("La contraseña debe tener más de 6 caracteres.");
            return;
		}

        await this.apiService.post('/change-password', {
            old_password: this.form.get('old_password')?.value,
            new_password: this.form.get('new_password')?.value,
            new_password_confirmation: this.form.get('new_password_confirmation')?.value
        });

        this.snackBar.show("Cambios guardados con éxito.");
		this.router.navigateByUrl('/');
    }
}
