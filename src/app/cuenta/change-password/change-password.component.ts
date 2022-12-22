import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInterface } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    form: FormGroup;
    currentUser: UserInterface;

    constructor(
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.form = new FormGroup({
            old_password: new FormControl('', [Validators.required]),
            new_password: new FormControl('', [Validators.required]),
            new_password_confirmation: new FormControl('', [Validators.required]),
        });
    }

    onSubmit() {
        if (this.form.valid) {
            this.authService.changePassword(this.form.value).subscribe({
                next: () => console.log('Contraseña actualizada', 'done'),
                error: (errorResponse: HttpErrorResponse) => {
                    if (errorResponse.status === 401) {
                        console.log('Contraseña invalida', 'close')
                    }
                }
            });
        }
    }
}
