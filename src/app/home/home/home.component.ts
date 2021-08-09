import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	name: string;
	
	constructor(
		private authService: AuthService,
		private router: Router,
		private http: HttpClient
	) { }

	//se ejecuta al iniciar el componente
	ngOnInit(): void {
	}

	logout() {
		this.authService.logout().subscribe(
			() => this.router.navigate(['/login'])
		)
	}
}
