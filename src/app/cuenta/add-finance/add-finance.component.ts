import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-add-finance',
  templateUrl: './add-finance.component.html',
  styleUrls: ['./add-finance.component.scss']
})
export class AddFinanceComponent implements OnInit {

	constructor(
		private authService: AuthService,
		private snackBar: SnackBarService
	) { }

	public form: FormGroup;
	public user: any = {
		finance: ''
	};

  	async ngOnInit(): Promise<void> {
		await this.authService.getCurrentUser().then((usuario) => {
			this.user = usuario;
		});

		this.inicializarForm();
  	}
  
  	public inicializarForm() {
		this.form = new FormGroup({
			finance: new FormControl('')
		});
	}

	public submit(){
		console.log(this.form.get('finance')?.value);
		this.snackBar.show('Transacción enviada con éxito.');
	}

}
