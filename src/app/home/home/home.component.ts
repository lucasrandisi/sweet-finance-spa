import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	ngOnInit(): void {
	}

	logout() {
		this.authService.logout().subscribe(
			() => this.router.navigate(['/login'])
		)
	}
}
