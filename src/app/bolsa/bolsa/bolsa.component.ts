import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SerieData } from '../serieData';
import { SerieDataLinear } from '../serieDataLinear';
import { Favoritos } from '../favoritos';
import { Router } from '@angular/router';

import {
	ApexAxisChartSeries,
	ApexChart,
	ApexYAxis,
	ApexXAxis,
	ApexPlotOptions,
	ApexDataLabels,
	ApexStroke,
} from "ng-apexcharts";
import { ApiService } from 'src/app/shared/services/api.service';

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
	selector: 'app-bolsa',
	templateUrl: './bolsa.component.html',
	styleUrls: ['./bolsa.component.scss']
})

export class BolsaComponent implements OnInit {

	public form: FormGroup;
	
	public tickerInformacion : any = {
		nombre: '',
		simbolo: '',
		mercado: '',
		precio: '',
		ema21: '',
		ema200: '',
		rsi: '',
	}

	public estadoCompra : boolean;
	public estadoVenta : boolean;
	public puedeDibujar : boolean = false;

	public maximoValorEma21 : number = 0;
	public minimoValorEma21 : number= 99999;
	public maximoValorEma200 : number = 0;
	public minimoValorEma200 : number= 99999;
	public maximoValorVolumen : number = 0;
	public diferenciaLargo :number = 0;

	public seriesEMA200 : SerieDataLinear[] = [];
	public seriesEMA21 : SerieDataLinear[] = [];
	public seriesData : SerieData[] = [];
	public seriesDataLinear : SerieDataLinear[] = [];
	public seriesRSI : SerieDataLinear[] = [];
	public seriesMACD : SerieDataLinear[] = [];
	public seriesMACDSignal : SerieDataLinear[] = [];
	public seriesMACDHist : SerieDataLinear[] = [];
	public favoritos : Favoritos[] = [];

	public chartCandleOptions: any;
	public chartBarOptions: any;
	public chartRSIOptions: any;
	public chartMACDOptions: any;

 	constructor(
		private apiService: ApiService,
		private router: Router,
		) {
	}

  	async ngOnInit(): Promise<void> {
		this.inicializarForm();
		await this.obtenerFavoritos();
		await this.obtenerInformacionTicker('AAPL');
		await this.dibujarGraficos('AAPL');
	}

	public inicializarForm() {
		this.form = new FormGroup({
			ticker: new FormControl()
		});
	}

	public async buscarTicker(){
		this.puedeDibujar = false;
		await this.obtenerInformacionTicker(this.form.value['ticker']);
		await this.dibujarGraficos(this.form.value['ticker']);
	}

	public async obtenerInformacionTicker(ticker: any) {
		this.limpiarInformacionTicker();
		await this.obtenerInformacionGeneralTicker(ticker);
		await this.obtenerPrecioActualTicker(ticker);
		await this.obtenerEma21Ticker(ticker);
		await this.obtenerEma200Ticker(ticker);
		await this.obtenerRsiTicker(ticker);
	}

	public async obtenerInformacionGeneralTicker(ticker: any){
		let responseQuote = await this.apiService.getData('/twelve-data/quote', {
			symbol: ticker
		});
		this.tickerInformacion.nombre = responseQuote.name;
		this.tickerInformacion.simbolo = responseQuote.symbol;
		this.tickerInformacion.mercado = responseQuote.exchange;
	}

	public async obtenerPrecioActualTicker(ticker: any){
		let responsePrice = await this.apiService.getData('/twelve-data/price', {
			symbol: ticker
		});
		this.tickerInformacion.precio = responsePrice.price.substr(0, responsePrice.price.length-3);
	}

	public async obtenerEma21Ticker(ticker: any){
		let responseEma21 = await this.apiService.getData('/twelve-data/ema', {
			symbol: ticker,
			interval: '1day',
			time_period: '21',
			outputsize: '90'
		});

		this.tickerInformacion.ema21 = responseEma21.values[0].ema.substr(0, responseEma21.values[0].ema.length-3);

		if(Number(this.tickerInformacion.ema21) <= Number(this.tickerInformacion.precio)){
			this.estadoCompra = true;
		} else {
			this.estadoVenta = true;
		}

		for (let dia of responseEma21.values){
			this.seriesEMA21.push(
				new SerieDataLinear(
					+dia.datetime.substr(0,4), 
					+dia.datetime.substr(5,2)-1,
					+dia.datetime.substr(8,2),
					+dia.ema,
				)
			);

			if(+dia.ema > this.maximoValorEma21){
				this.maximoValorEma21 = +dia.ema;
			}

			if(+dia.ema < this.minimoValorEma21){
				this.minimoValorEma21 = +dia.ema;
			}
		}
	}

	public async obtenerEma200Ticker(ticker: any){
		let responseEma200 = await this.apiService.getData('/twelve-data/ema', {
			symbol: ticker,
			interval: '1day',
			time_period: '200',
			outputsize: '90'
		});

		this.tickerInformacion.ema200 = responseEma200.values[0].ema.substr(0, responseEma200.values[0].ema.length-3);

		for (let dia of responseEma200.values){
			this.seriesEMA200.push(
				new SerieDataLinear(
					+dia.datetime.substr(0,4), 
					+dia.datetime.substr(5,2)-1,
					+dia.datetime.substr(8,2),
					+dia.ema,
				)
			);

			if(+dia.ema > this.maximoValorEma200){
				this.maximoValorEma200 = +dia.ema;
			}

			if(+dia.ema < this.minimoValorEma200){
				this.minimoValorEma200 = +dia.ema;
			}
		}
	}

	public async obtenerRsiTicker(ticker: any){
		let responseRsi = await this.apiService.getData('/twelve-data/rsi', {
			symbol: ticker,
			interval: '1day',
			outputsize: '90'
		});

		this.tickerInformacion.rsi = responseRsi.values[0].rsi.substr(0, responseRsi.values[0].rsi.length-3);

		for (let dia of responseRsi.values){
			this.seriesRSI.push(
				new SerieDataLinear(
					+dia.datetime.substr(0,4), 
					+dia.datetime.substr(5,2)-1,
					+dia.datetime.substr(8,2),
					+dia.rsi,
				)
			);
		}
	}

	public limpiarInformacionTicker(){
		this.tickerInformacion.simbolo = "";
		this.tickerInformacion.nombre = "";
		this.tickerInformacion.mercado = "";
		this.tickerInformacion.precio = "";
		this.tickerInformacion.ema21 = "";
		this.tickerInformacion.ema200 = "";
		this.tickerInformacion.rsi = "";
		this.estadoCompra = false;
		this.estadoVenta = false;
		this.seriesEMA200 = [];
		this.seriesEMA21 = [];
		this.seriesData = [];
		this.seriesDataLinear = [];
		this.seriesRSI = [];
		this.seriesMACD = [];
		this.seriesMACDSignal = [];
		this.seriesMACDHist = [];
	}

	public async dibujarGraficos(ticker : any){
		this.puedeDibujar = false;
		await this.dibujarVelasVolumen(ticker);
		await this.dibujarRSI();
		await this.dibujarMACD(ticker);
		this.puedeDibujar = true;
	}

	public async dibujarVelasVolumen(ticker: any){
		let valorMaximoVela = 0;
		let valorMinimoVela = 9999999999;
		let maximoLargoVela = 0;
		let maximoLargoVolumen = 0;

		let responsePrecios = await this.apiService.getData('/twelve-data/time_series', {
			symbol: ticker,
			interval: '1day',
			outputsize: '90'
		});

		for (let dia of responsePrecios.values){
			this.seriesData.push(
				new SerieData(
					+dia.datetime.substr(0,4), 
					+dia.datetime.substr(5,2)-1,
					+dia.datetime.substr(8,2),
					+dia.open,
					+dia.high,
					+dia.low,
					+dia.close
				)
			);

			if(dia.volume.length>maximoLargoVolumen){
				maximoLargoVolumen = dia.volume.length;
			}

			this.seriesDataLinear.push(
				new SerieDataLinear(
					+dia.datetime.substr(0,4), 
					+dia.datetime.substr(5,2)-1,
					+dia.datetime.substr(8,2), 
					+dia.volume/1000000
					)
			);

			if(dia.high.length>maximoLargoVela){
				maximoLargoVela = dia.high.length;
			}

			if(+dia.high > valorMaximoVela){
				valorMaximoVela = +dia.high;
			}

			if(+dia.low < valorMinimoVela){
				valorMinimoVela = +dia.low;
			}
		}

		if (this.minimoValorEma200 < valorMinimoVela){
			valorMinimoVela = this.minimoValorEma200;
		}

		if (this.maximoValorEma200 > valorMaximoVela){
			valorMaximoVela = this.maximoValorEma200;
		}

		if (this.minimoValorEma21 < valorMinimoVela){
			valorMinimoVela = this.minimoValorEma21;
		}

		if (this.maximoValorEma21 > valorMaximoVela){
			valorMaximoVela = this.maximoValorEma21;
		}

		this.diferenciaLargo = Math.abs(maximoLargoVela - maximoLargoVolumen) + 2;

		this.chartCandleOptions = {
			series: [
				{
					name: "candle",
					type: "candlestick",
					data: this.seriesData
				},
				{
					name: "EMA200",
					type: "line",
					data: this.seriesEMA200
				},
				{
					name: "EMA21",
					type: "line",
					data: this.seriesEMA21
				},
			],
			chart: {
				type: "candlestick",
				height: 300,
				toolbar: {
					autoSelected: "pan",
					show: false
				}
			},
			plotOptions: {
			  candlestick: {
				colors: {
				  upward: "#13AE4B",
				  downward: "#FF2400"
				}
			  },
			},
			xaxis: {
				type: "datetime",
				position: "top"
			},	
			yaxis: {
				max: valorMaximoVela + 0.5,
				min: valorMinimoVela - 0.5,
				decimalsInFloat: 2
			},
			title:{
				text: `${ticker}: Velas Japonesas daily + Media Móvil Exponencial 21/200/close`,
				align: "center",
				margin: 0
			},
			legend:{
				show: false
			},
			stroke: {
				width: [1, 1],
				curve: "smooth",
				colors: ["#FFA701", "#266D98"]
			},
			tooltip:{
				enabled: true,
				shared: false,
				intersect: true
			}
		};

		this.chartBarOptions = {
			series: [
				{
				name: "volume",
				data: this.seriesDataLinear
				}
			],
			chart: {
				height: 120,
				type: "bar",
				toolbar: {
					autoSelected: "pan",
					show: false
				}
			},
			dataLabels: {
				enabled: false
			},
			plotOptions: {
				bar: {
				columnWidth: "100%",
				colors: {
					ranges: [
					{
						from: 0,
						to: 999999999999,
						color: "#03A9F4"
					}]
				}
				}
			},
			stroke: {
				width: 0
			},
			xaxis: {
				type: "datetime",
				labels:{
					show: false
				}
			},
			yaxis: {
				labels: {
					how: true
				},
				tickAmount: 4,
				decimalsInFloat: this.diferenciaLargo
			},
			title:{
				text: "Volumen Diario en Millones",
				align: "center",
				margin: 0
			}
		};	
	}

	public async dibujarRSI(){
		this.chartRSIOptions = {
			series: [{
				name: 'RSI',
				data: this.seriesRSI
			  }],
			chart: {
				type: 'line',
				height: 150,
				toolbar: {
					autoSelected: "pan",
					show: false
				}
			},
			annotations: {
				yaxis: [
				  {
					y: 25,
					y2: 75,
					fillColor: '#D499ED',
				  }
				]
			},
			stroke: { 
				width: 2,
				curve: "smooth",
				colors: "#9400D3"
			},
			markers: {
				size: 0,
			},
			yaxis: {
				labels: {
					show: true
				},
				min: 0,
				max: 100,
				tickAmount: 4,
				decimalsInFloat: this.diferenciaLargo
			},
			xaxis: {
				type: 'datetime',
				labels:{
					show: false
				}
			},
			title:{
				text: "Índice de Fuerza Relativa (RSI)",
				align: "center",
				margin: 0
			}

		};
	}

	public async dibujarMACD(ticker: any){
		let responsePrecios = await this.apiService.getData('/twelve-data/macd', {
			symbol: ticker,
			interval: '1day',
			outputsize: '90'
		});

		for (let dia of responsePrecios.values){
			this.seriesMACD.push(
				new SerieDataLinear(
					+dia.datetime.substr(0,4), 
					+dia.datetime.substr(5,2)-1, 
					+dia.datetime.substr(8,2), 
					+dia.macd
					)
			);	
			this.seriesMACDSignal.push(
				new SerieDataLinear(
					+dia.datetime.substr(0,4), 
					+dia.datetime.substr(5,2)-1, 
					+dia.datetime.substr(8,2), 
					+dia.macd_signal
					)
			);
			this.seriesMACDHist.push(
				new SerieDataLinear(
					+dia.datetime.substr(0,4), 
					+dia.datetime.substr(5,2)-1, 
					+dia.datetime.substr(8,2), 
					+dia.macd_hist
					)
			);
		}

		this.chartMACDOptions = {
			series:[
				{
					name: "MACD",
					type: "line",
					data: this.seriesMACD
				},
				{
					name: "MACD Signal",
					type: "line",
					data: this.seriesMACDSignal
				},
				{
					name: "MACD Hist",
					type: "bar",
					data: this.seriesMACDHist
				}
			],
			chart: {
				height: 150,
				type: "line",
				stacked: false,
				toolbar: {
					autoSelected: "pan",
					show: false
				}
			},
			stroke: {
				width: [2, 2, 0],
				curve: "smooth",
				colors: ["#003166","#ff6600"]
			},
			plotOptions: {
				bar: {
					columnWidth: "100%",
					colors: {
					  ranges: [
						{
						  from: -9999,
						  to: 0,
						  color: "#ED2939"
						},
						{
						  from: 0,
						  to: 9999,
						  color: "#4FA64F"
						}
					  ]
					}
				}
			},
			markers: {
				size: 0
			},
			xaxis: {
				type: "datetime",
				labels:{
					show: false
				}
			},
			yaxis: {
				labels: {
					show: true
				},
				tickAmount: 4,
				decimalsInFloat: this.diferenciaLargo
			},
			legend: {
				show: false
			},
			title:{
				text: "Media Móvil de Convergencia/Divergencia (MACD)",
				align: "center",
				margin: 0
			}
		};

	}

	public async obtenerFavoritos(){
		this.favoritos = [];
		let responseFavoritos = await this.apiService.getData('/stocks/favorites',{});

		for (let favorito of responseFavoritos){
			let responsePrecio = await this.apiService.getData('/twelve-data/price',{
				symbol: favorito.stock_symbol
			});

			let responseInformacion = await this.apiService.getData('/twelve-data/quote',{
				symbol: favorito.stock_symbol
			});

			this.favoritos.push(
				new Favoritos(
					favorito.id, 
					favorito.stock_symbol, 
					responseInformacion.percent_change.substr(0, responseInformacion.percent_change.length-3) + '%', 
					(+responseInformacion.percent_change>=0) ? true : false, 
					responsePrecio.price.substr(0, responsePrecio.price.length-3)
				)
			);
		}
	}

	public async agregarFavorito(){
		await this.apiService.post('/stocks/favorites', {
			stock_symbol: this.form.value['ticker']
		});

		await this.obtenerFavoritos();
	}

	public async eliminarFavorito(id : any){
		await this.apiService.delete(`/stocks/favorites/${id}`);
		let index = 0;
		for (let favorito of this.favoritos){
			if(favorito.id == id){
				break;
			}
			index = index + 1;
		}
		this.favoritos.splice(index, 1);
	}

	public navegarAcademia(){
		this.router.navigateByUrl('/academia/anatecnico');
	}
		
}
