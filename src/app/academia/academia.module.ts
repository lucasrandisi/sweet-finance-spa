import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcademiaRoutingModule } from './academia-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AbceconomiaComponent } from './abceconomia/abceconomia.component';
import { AnatecnicoComponent } from './anatecnico/anatecnico.component';
import { CriptosComponent } from './criptos/criptos.component';
import { FinanzasComponent } from './finanzas/finanzas.component';
import { HiseconomicaComponent } from './hiseconomica/hiseconomica.component';
import { MercadosComponent } from './mercados/mercados.component';
import { VarmacroeconomicasComponent } from './varmacroeconomicas/varmacroeconomicas.component';


@NgModule({
	declarations: [
		AbceconomiaComponent,
		AnatecnicoComponent,
		CriptosComponent,
		FinanzasComponent,
		HiseconomicaComponent,
		MercadosComponent,
		VarmacroeconomicasComponent
	],
	imports: [
		CommonModule,
		AcademiaRoutingModule,
		SharedModule
	]
})
export class AcademiaModule { }
