import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {

	constructor(
		private authService: AuthService
	) { }

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const accessToken = this.authService.getAccessToken();

		const newReq = request.clone({
			setHeaders: {
				'Authorization': `Bearer ${accessToken}`
			}
		});

		return next.handle(newReq);
	}
}
