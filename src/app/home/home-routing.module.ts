import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { AddFinanceComponent } from './account/add-finance/add-finance.component';
import { BolsaComponent } from './bolsa/bolsa.component';
import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';
import { TradingComponent } from './trading/trading.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AbceconomiaComponent } from './academia/abceconomia/abceconomia.component';
import { AnatecnicoComponent } from './academia/anatecnico/anatecnico.component';
import { CriptosComponent } from './academia/criptos/criptos.component';
import { FinanzasComponent } from './academia/finanzas/finanzas.component';
import { HiseconomicaComponent } from './academia/hiseconomica/hiseconomica.component';
import { MercadosComponent } from './academia/mercados/mercados.component';
import { VarmacroeconomicasComponent } from './academia/varmacroeconomicas/varmacroeconomicas.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: 'info',
                component: InfoComponent,
            },
            {
                path: 'bolsa',
                component: BolsaComponent,
            },
            {
                path: '',
                component: DashboardComponent,
            },
            {
                path: 'trading',
                component: TradingComponent,
            },
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
            {
                path: 'account',
                component: AccountComponent
            },
            {
                path: 'account/change-password',
                component: ChangePasswordComponent
            },
            {
                path: 'account/add-finance',
                component: AddFinanceComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
