import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-finance',
  templateUrl: './add-finance.component.html',
  styleUrls: ['./add-finance.component.scss']
})
export class AddFinanceComponent implements OnInit {

	constructor(
		private authService: AuthService,
		private apiService : ApiService,
		private snackBar: SnackBarService,
		private router: Router,
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

	public async submit(){
		await this.apiService.post('/finance', {
			"amount": this.form.get('finance')?.value,
		});
		this.router.navigate(['']);
		this.snackBar.show('Transacción enviada con éxito.');
	}

}
