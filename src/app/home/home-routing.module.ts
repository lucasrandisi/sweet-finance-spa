import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BolsaComponent } from './bolsa/bolsa.component';
import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';
import { TradingComponent } from './trading/trading.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		children:[
			{
			path: 'info',
			component: InfoComponent,
			},
			{
				path: 'bolsa',
				component: BolsaComponent,
			},
			{
				path: 'trading',
				component: TradingComponent,
			}
		]	
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HomeRoutingModule { }
