import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InfoComponent } from './info/info.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { BolsaComponent } from './bolsa/bolsa.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TradingComponent } from './trading/trading.component';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AccountComponent } from './account/account.component';
import { MatMenuModule } from '@angular/material/menu';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AbceconomiaComponent } from './academia/abceconomia/abceconomia.component';
import { MercadosComponent } from './academia/mercados/mercados.component';
import { VarmacroeconomicasComponent } from './academia/varmacroeconomicas/varmacroeconomicas.component';
import { FinanzasComponent } from './academia/finanzas/finanzas.component';
import { AnatecnicoComponent } from './academia/anatecnico/anatecnico.component';
import { CriptosComponent } from './academia/criptos/criptos.component';
import { HiseconomicaComponent } from './academia/hiseconomica/hiseconomica.component';
import { AddFinanceComponent } from './account/add-finance/add-finance.component';

@NgModule({
	declarations: [
		HomeComponent,
		InfoComponent,
		BolsaComponent,
		TradingComponent,
		AccountComponent,
		ChangePasswordComponent,
		DashboardComponent,
		AbceconomiaComponent,
		MercadosComponent,
		VarmacroeconomicasComponent,
		FinanzasComponent,
		AnatecnicoComponent,
		CriptosComponent,
		HiseconomicaComponent,
  AddFinanceComponent
	],
	imports: [
		CommonModule,
		HomeRoutingModule,
		MatButtonModule,
		MatDividerModule,
		MatCardModule,
		MatInputModule,
		MatSelectModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		NgApexchartsModule,
		FormsModule,
		MatIconModule,
		MatSnackBarModule,
		MatMenuModule
	]
})
export class HomeModule { }
