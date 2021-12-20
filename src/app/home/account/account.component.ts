import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';
import { UserInterface } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/users.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
    form: FormGroup;
    currentUser: UserInterface;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.currentUser = this.authService.currentUser!;
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
            this.userService.updateMe(this.form.value).subscribe({
                next: () => this.openSnackbar('Datos guardados', 'done'),
                error: () => this.openSnackbar('Ocurrió un error al guardar los datos', 'close')
            });
        }
    }

    openSnackbar(message: string, icon: string) {
        this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
                message,
                icon
            },
            duration: 2000
        });
    }
}
