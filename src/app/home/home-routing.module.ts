import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { BolsaComponent } from './bolsa/bolsa.component';
import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';
import { TradingComponent } from './trading/trading.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
                path: 'account',
                component: AccountComponent
            },
            {
                path: 'account/change-password',
                component: ChangePasswordComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
