import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoggedInGuard } from './shared/guards/logged-in.guard';

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'register',
		component: RegisterComponent,
	},
	{
        path: 'academia',
        canActivate: [LoggedInGuard],
        loadChildren: () => import('./academia/academia.module').then(m => m.AcademiaModule), 
    },
	{
        path: 'cuenta',
        canActivate: [LoggedInGuard],
        loadChildren: () => import('./cuenta/cuenta.module').then(m => m.CuentaModule), 
    },
	{
        path: 'bolsa',
        canActivate: [LoggedInGuard],
        loadChildren: () => import('./bolsa/bolsa.module').then(m => m.BolsaModule), 
    },
	{
        path: '',
        canActivate: [LoggedInGuard],
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), 
    },
	{
        path: 'trading',
        canActivate: [LoggedInGuard],
        loadChildren: () => import('./trading/trading.module').then(m => m.TradingModule), 
    },
	{
        path: 'info',
        canActivate: [LoggedInGuard],
        loadChildren: () => import('./info/info.module').then(m => m.InfoModule), 
    },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
