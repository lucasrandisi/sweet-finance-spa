import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
	declarations: [
		SnackbarComponent
	],
	imports: [
		CommonModule,
		MatIconModule
	]
})
export class SharedModule { }
