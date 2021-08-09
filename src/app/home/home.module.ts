import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { InfoComponent } from './info/info.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { BolsaComponent } from './bolsa/bolsa.component'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
	declarations: [
		HomeComponent,
  		InfoComponent,
   		BolsaComponent
	],
	imports: [
		CommonModule,
		HomeRoutingModule,
		MatButtonModule,
		MatDividerModule,
		MatCardModule,
		MatInputModule,
		MatFormFieldModule,
		ReactiveFormsModule
	]
})
export class HomeModule { }
