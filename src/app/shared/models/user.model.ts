import { environment } from "src/environments/environment";

export interface UserInterface {
    name: string;
    email: string;
    finance: number;
}

export class User implements UserInterface {
    static readonly modelUrl: string = "users"

    name: string;
    email: string;
    finance: number;


    constructor(props: Partial<UserInterface>) {
        Object.assign(this, props)
    }

    static getModelRoute(id?: number) {
        if (id) {
            return `${environment.apiUrl}/${this.modelUrl}/${id}`;
        }

        return `${environment.apiUrl}/${this.modelUrl}`;
    }
}