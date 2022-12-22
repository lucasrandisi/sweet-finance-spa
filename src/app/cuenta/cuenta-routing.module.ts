import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFinanceComponent } from './add-finance/add-finance.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MisDatosComponent } from './mis-datos/mis-datos.component';

const routes: Routes = [
  {
		path: '',
		component: MisDatosComponent,
	},
  {
		path: 'add-finance',
		component: AddFinanceComponent,
	},
  {
		path: 'change-password',
		component: ChangePasswordComponent,
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentaRoutingModule { }
