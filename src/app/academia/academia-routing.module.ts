import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbceconomiaComponent } from './abceconomia/abceconomia.component';
import { AnatecnicoComponent } from './anatecnico/anatecnico.component';
import { CriptosComponent } from './criptos/criptos.component';
import { FinanzasComponent } from './finanzas/finanzas.component';
import { HiseconomicaComponent } from './hiseconomica/hiseconomica.component';
import { MercadosComponent } from './mercados/mercados.component';
import { VarmacroeconomicasComponent } from './varmacroeconomicas/varmacroeconomicas.component';

const routes: Routes = [
	{
		path: 'abceconomia',
		component: AbceconomiaComponent,
	},
	{
		path: 'anatecnico',
		component: AnatecnicoComponent,
	},
	{
		path: 'criptos',
		component: CriptosComponent,
	},
	{
		path: 'finanzas',
		component: FinanzasComponent,
	},
	{
		path: 'hiseconomi',
		component: HiseconomicaComponent,
	},
	{
		path: 'mercados',
		component: MercadosComponent,
	},
	{
		path: 'vareco',
		component: VarmacroeconomicasComponent,
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademiaRoutingModule { }
