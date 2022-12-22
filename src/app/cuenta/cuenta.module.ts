import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuentaRoutingModule } from './cuenta-routing.module';
import { MisDatosComponent } from './mis-datos/mis-datos.component';
import { SharedModule } from '../shared/shared.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AddFinanceComponent } from './add-finance/add-finance.component';


@NgModule({
  	declarations: [
		MisDatosComponent,
		ChangePasswordComponent,
		AddFinanceComponent,
	],
	imports: [
		CommonModule,
		CuentaRoutingModule,
		SharedModule
  ]
})
export class CuentaModule { }
