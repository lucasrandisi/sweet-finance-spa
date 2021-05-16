import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserInterface } from '../models/user.model';

@Injectable()
export class AuthService {
	private httpClient: HttpClient;

	currentUser: UserInterface;
	access_token: string;

	constructor(httpClient: HttpClient) {
		this.httpClient = httpClient;
	}


	registerUser(user: Partial<UserInterface>) {
		const url = `${environment.apiUrl}/register	`;

		return this.httpClient.post(url, user).pipe(
			tap((response: any) => {
				this.currentUser = response.user;
				this.access_token = response.access_token
			})
		);
	}


	login(credentials: { email: string, password: string }) {
		const url = `${environment.apiUrl}/login`;

		return this.httpClient.post(url, credentials).pipe(
			tap((response: any) => {
				this.currentUser = response.user;
				this.access_token = response.access_token
			})
		);
	}

}

