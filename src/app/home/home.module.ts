import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { InfoComponent } from './info/info.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card'; 


@NgModule({
	declarations: [
		HomeComponent,
  		InfoComponent
	],
	imports: [
		CommonModule,
		HomeRoutingModule,
		MatButtonModule,
		MatDividerModule,
		MatCardModule
	]
})
export class HomeModule { }
