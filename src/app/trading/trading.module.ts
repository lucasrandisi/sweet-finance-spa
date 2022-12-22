import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TradingRoutingModule } from './trading-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TradingComponent } from './trading/trading.component';


@NgModule({
  declarations: [
    TradingComponent
  ],
  imports: [
    CommonModule,
    TradingRoutingModule,
    SharedModule,
    NgApexchartsModule
  ]
})
export class TradingModule { }
