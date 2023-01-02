import { Injectable } from '@angular/core';
import { UserInterface } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private apiService : ApiService,
    ) {}

    public async getCurrentUser() {
        return JSON.parse(localStorage.getItem('usuario_actual')!);
    }

    public getAccessToken() : string | null {
        return localStorage.getItem('accessToken');
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


    public changePassword(data: {
        old_password: string,
        new_password: string,
        new_password_confirmation: string
    }) {
        return this.apiService.post('/change-password', data);
    }
}

