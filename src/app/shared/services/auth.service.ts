import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserInterface } from '../models/user.model';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private httpClient: HttpClient;

	private _currentUser: UserInterface | null;
	private _accessToken: string;

	constructor(httpClient: HttpClient) {
		this.httpClient = httpClient;
	}

	get accessToken() {
		if (this._accessToken) {
			return this._accessToken;
		}

		const storageAccessToken = window.localStorage.getItem('accessToken');

		if (storageAccessToken) {
			this._accessToken = storageAccessToken;
		}

		return this._accessToken;
	}

	get currentUser() {
		if (this._currentUser) {
			return this._currentUser;
		}

		const storageCurrentUser = window.localStorage.getItem('currentUser');

		if (storageCurrentUser) {
			this._currentUser = JSON.parse(storageCurrentUser);
		}

		return this._currentUser;
	}


	registerUser(user: Partial<UserInterface>) {
		const url = `${environment.apiUrl}/register	`;

		return this.httpClient.post(url, user).pipe(
			tap((response: any) => {
				this._currentUser = response.user;
				this._accessToken = response.access_token;

				window.localStorage.setItem('currentUser', JSON.stringify(this._currentUser));
				window.localStorage.setItem('accessToken', this._accessToken);
			})
		);
	}


	login(credentials: { email: string, password: string }) {
		const url = `${environment.apiUrl}/login`;

		return this.httpClient.post(url, credentials).pipe(
			tap((response: any) => {
				this._currentUser = response.user;
				this._accessToken = response.access_token

				window.localStorage.setItem('currentUser', JSON.stringify(this._currentUser));
				window.localStorage.setItem('accessToken', this._accessToken);
			})
		);
	}

	logout() {
		const url = `${environment.apiUrl}/logout`;

		return this.httpClient.post(url, null).pipe(
			tap(() => {
				this._currentUser = null;
				this._accessToken = '';

				window.localStorage.removeItem('currentUser');
				window.localStorage.removeItem('accessToken');
			})
		);
	}

}

