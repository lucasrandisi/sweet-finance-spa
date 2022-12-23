import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserInterface } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private httpClient: HttpClient;

    private _currentUser: UserInterface | null;
    private _accessToken: string;

    constructor(
        httpClient: HttpClient,
        private apiService : ApiService,
    ) {
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


    set currentUser(value) {
        this._currentUser = value;

        window.localStorage.setItem('currentUser', JSON.stringify(this._currentUser));
    }


    public async registrar (nombre:string, email:string, password:string, password_confirmation:string) {
        await this.apiService.post("/register",{
            name : nombre,
            email : email,
            password : password,
            password_confirmation: password_confirmation
        });
    }

    public async login(email:string,password:string) : Promise<void> {
        const response = await this.apiService.post("/login",{
            email    : email,
            password : password,
        });

        localStorage.setItem('accessToken', response.access_token);
        localStorage.setItem('usuario_actual', JSON.stringify(response.user));
    }

    public async logout() : Promise<any> {
        await this.apiService.post("/logout",{});

        localStorage.removeItem('accessToken');
        localStorage.removeItem('usuario_actual');
    }


    changePassword(data: {
        old_password: string,
        new_password: string,
        new_password_confirmation: string
    }) {
        const url = `${environment.apiEndpoint}/change-password`;

        return this.httpClient.post(url, data);
    }
}

