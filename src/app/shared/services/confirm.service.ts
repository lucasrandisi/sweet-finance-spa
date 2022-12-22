import { ConfirmComponent   } from "../components/confirm/confirm.component";
import { Injectable,        } from "@angular/core";
import { MatDialog,         } from '@angular/material/dialog';
import { NgModule           } from "@angular/core";
import { Observable         } from "rxjs";

@Injectable()
@NgModule()
export class ConfirmService {

    public constructor(
        private dialog: MatDialog,
    ) { }

    public ask(message: string): Observable<void> {
        return this.dialog.open(ConfirmComponent,  {
            disableClose : false,
            autoFocus    : true,
            data         : { 
                message: message,
            }
        }).componentInstance.confirm;
    }

    public async askAsync(message: string): Promise<void> {
        return new Promise((resolve) => {
            this.ask(message).subscribe(() => {
                resolve();
            });
        });
    }
}