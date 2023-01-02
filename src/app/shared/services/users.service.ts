import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { UserInterface } from "../models/user.model";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService
    ) {
    }

    updateMe(data: UserInterface) {
        /*
        const url = `${environment.apiEndpoint}/me	`;

        return this.httpClient.patch<UserInterface>(url, data).pipe(
            tap(data => this.authService.getCurrentUser() = data)
        );
        */
    }
}