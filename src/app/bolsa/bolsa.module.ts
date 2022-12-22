import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BolsaRoutingModule } from './bolsa-routing.module';
import { SharedModule } from '../shared/shared.module';
import { BolsaComponent } from './bolsa/bolsa.component';
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
  declarations: [
    BolsaComponent,
  ],
  imports: [
    CommonModule,
    BolsaRoutingModule,
    SharedModule,
    NgApexchartsModule,
  ]
})
export class BolsaModule { }
