import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoggedInGuard } from './shared/guards/logged-in.guard';
import { LoggedOutGuard } from './shared/guards/logged-out.guard';

//corregir, llamar desde el home
import { InfoComponent } from './home/info/info.component';

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [LoggedOutGuard]
	},
	{
		path: 'register',
		component: RegisterComponent,
		canActivate: [LoggedOutGuard]
	},
	{
		path: '',
		pathMatch: 'full',
		loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
		//canActivateChild: [LoggedInGuard]
	},
	{
		path: 'home/info',
		component: InfoComponent,
	}
	
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
