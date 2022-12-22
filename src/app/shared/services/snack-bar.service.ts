import { Injectable, NgModule } from "@angular/core";
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from "@angular/material/snack-bar";

@Injectable()
@NgModule()
export class SnackBarService {

    public constructor(
        private _snackBar: MatSnackBar
    ) { }

    public show(message: string, duration: number = 5000): MatSnackBarRef<SimpleSnackBar> {
        return this._snackBar.open(message, 'OK', {
            duration: duration,
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
        });
    }
}
