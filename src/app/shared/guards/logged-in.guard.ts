import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class LoggedInGuard implements CanActivate, CanActivateChild {
	constructor(
		private authService: AuthService,
		private router: Router
	) { }


	canActivate() {
		const accessToken = this.authService.accessToken;

		if (!accessToken) {
			this.router.navigate(['/login']);
			return false;
		}

		return true
	}

	canActivateChild() {
		return this.canActivate();
	}
}
