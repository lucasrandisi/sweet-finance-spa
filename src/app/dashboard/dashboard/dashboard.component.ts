import { Component, OnInit, ViewChild } from '@angular/core';
import { News } from '../news';
import { Tickers } from '../tickers';
import { LocatorService } from 'src/app/shared/services/locator.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ApiService } from 'src/app/shared/services/api.service';

import {
	ChartComponent,
	ApexAxisChartSeries,
	ApexChart,
	ApexYAxis,
	ApexXAxis,
	ApexPlotOptions,
	ApexDataLabels,
	ApexStroke,
} from "ng-apexcharts";

export type ChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	xaxis: ApexXAxis;
	yaxis: ApexYAxis;
	plotOptions: ApexPlotOptions;
	dataLabels: ApexDataLabels;
	stroke: ApexStroke;
};

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
	protected spinnerService  = LocatorService.injector.get(SpinnerService);

  	constructor(
		private authService : AuthService,
		private apiService : ApiService,
	) { }

	public user : any = {
		name: ''
	};
  	public noticias : News[] = [];
	public acciones : any = [];
	public mejoresAcciones : Tickers[] = [];
	public peoresAcciones : Tickers[] = [];

	@ViewChild("chart") chart: ChartComponent;
	public chartOptions: any;

	async ngOnInit(): Promise<void> {
		await this.spinnerService.go(async() => {
			this.authService.getCurrentUser().then((usuario) => {
				this.user = usuario;
			});
			await this.obtenerNoticias();
			await this.dibujarGraficoAcciones();
			await this.dibujarTablas();
		});
	}

	public async obtenerNoticias(){
		let noticias: any[] = [];

		let noticiasPrimeraPagina = await this.apiService.getData('/marketaux', {
			path: 'news/all',
			language: 'es',
			countries: 'us, ar, br, cn',
			page: '1'
		}); 

		let noticiasSegundaPagina = await this.apiService.getData('/marketaux', {
			path: 'news/all',
			language: 'es',
			countries: 'us, ar, br, cn',
			page: '2'
		}); 

		noticiasPrimeraPagina.data.forEach((noticia : any) => {
			noticias.push(noticia);
		});

		noticiasSegundaPagina.data.forEach((noticia : any) => {
			noticias.push(noticia);
		});

		noticias.forEach((noticia :any) => {
			let descripcion = noticia.description;
				if(descripcion.substr(0,10)!=noticia.snippet.substr(0,10)){
					descripcion = descripcion + ' ' + noticia.snippet;
				}
				if (descripcion != ''){
					this.noticias.push(
						new News(noticia.title, descripcion, noticia.image_url, noticia.url)
					)
				}
		});
	}

	public async dibujarGraficoAcciones(){
		this.acciones = await this.apiService.getData('/stocks');

		let values = [];
		let labels = [];

		for (let accion of this.acciones){
			values.push(accion.amount);
			labels.push(accion.stock_symbol);
		}

		this.chartOptions = {
			series: values,
			labels: labels,
			chart: {
				type: 'donut',
				height: 300,
			},
			title:{
				text: "RESUMEN DE ACCIONES EN CARTERA",
				align: "center",
				margin: 0,
			},
			legend: {
				show: true,
				floating: true,
			}
		};
	}

	public async dibujarTablas(){
		let response = await this.apiService.getData('/fmp', {
			path: "v3/gainers",
		});

		for (let i = 0; i < 5; i++){
			let change_length = response[i].changesPercentage.length;
			let change = response[i].changesPercentage.substr(0,change_length-4).concat("%");
			this.mejoresAcciones.push(
				new Tickers(response[i].ticker, response[i].companyName, change)
			)
		}

		response = await this.apiService.getData('/fmp', {
			path: "v3/gainers",
		})

		for (let i = 0; i < 5; i++){
			let change_length = response[i].changesPercentage.length;
			let change = response[i].changesPercentage.substr(0,change_length-4).concat("%");
			this.peoresAcciones.push(
				new Tickers(response[i].ticker, response[i].companyName, change)
			)
		}
	}
}
