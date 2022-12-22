import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BolsaComponent } from './bolsa/bolsa.component';

const routes: Routes = [
  {
		path: '',
		component: BolsaComponent,
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BolsaRoutingModule { }
