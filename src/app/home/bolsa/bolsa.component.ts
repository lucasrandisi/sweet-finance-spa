import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SerieData } from './serieData';
import { SerieDataLinear } from './serieDataLinear';
import { Favorites } from './favorites';
import Swal from 'sweetalert2';

import {
	ChartComponent,
	ApexAxisChartSeries,
	ApexChart,
	ApexYAxis,
	ApexXAxis,
	ApexPlotOptions,
	ApexDataLabels,
	ApexStroke,
	YAxisAnnotations
} from "ng-apexcharts";
import { forkJoin } from 'rxjs';

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

	form: FormGroup;
	symbol: string;
	name: string;
	mercado: string;
	price: string;
	ema21: string;
	ema200 : string;
	rsi : string;
	estado_compra : boolean;
	estado_venta : boolean;
	flag_candle = false;
	flag_vol = false;
	flag_rsi = false;
	flag_macd = false;

	ema21_value_number : number;
	price_number : number;

	@ViewChild("chart") chart: ChartComponent;
	public chartCandleOptions: any;
	public chartBarOptions: any;
	public chartRSIOptions: any;
	public chartMACDOptions: any;

	//x: new Date(Year, Month, Day), el mes enero es el 0
	//y: [Open, High, Low, Close]
	seriesData : SerieData[] = [];
	
	//x: new Date(Year, Month, Day)
	//y: Volume
	seriesDataLinear : SerieDataLinear[] = [];

	seriesRSI : SerieDataLinear[] = [];

	seriesMACD : SerieDataLinear[] = [];
	seriesMACDSignal : SerieDataLinear[] = [];
	seriesMACDHist : SerieDataLinear[] = [];

	seriesEMA200 : SerieDataLinear[] = [];
	seriesEMA21 : SerieDataLinear[] = [];

	max_ema200 : number;
	min_ema200 : number;
	max_ema21 : number;
	min_ema21 : number;
	max_vol : number;
	dif_lenght = 0;

	favorites : Favorites[] = [];

 	constructor(private http: HttpClient) {
	}

  	ngOnInit(): void {
		this.initializeForm();
		this.get_favorites();
		this.find_ticker_form('AAPL');
		//setTimeout(() => console.log(this.favorites),1000);
	}

	initializeForm() {
		this.form = new FormGroup({
			ticker: new FormControl()
		});
	}

	find_ticker(){
		this.find_ticker_form(this.form.value['ticker']);
	}

	clear(){
		this.symbol = "";
		this.name = "";
		this.mercado = "";
		this.price = "";
		this.ema21 = "";
		this.ema200 = "";
		this.rsi = "";
		this.estado_compra = false;
		this.estado_venta = false;
	}

	find_ticker_form(ticker: any) {
		this.clear();
		//request for ticker data in twelve-data
		this.http.get(`${environment.apiUrl}/twelve-data/quote`,{
			params: {
			symbol: ticker
			}
		}).subscribe((response:any)=>{
			//console.log(response); 
			this.estado_compra = false;
			this.estado_venta = false;
			this.name = response.name;
			this.symbol = response.symbol;
			this.mercado = response.exchange;
		}, (error:any)=>{
			Swal.fire('Error en la carga de datos', 'Por favor, intentalo nuevamente', 'error');
		});

		//request for actual price
		this.http.get(`${environment.apiUrl}/twelve-data/price`,{
			params: {
			symbol: ticker
			}
		}).subscribe((response:any)=>{
			this.price = response.price;
			this.price = this.price.substr(0, this.price.length-3);
		}, (error:any)=>{
			Swal.fire('Error en la carga de datos', 'Por favor, intentalo nuevamente', 'error')
		});

		//request for ema21
		this.http.get(`${environment.apiUrl}/twelve-data/ema`,{
			params: {
				symbol: ticker,
				interval: '1day',
				time_period: '21',
				outputsize: '90'
				}
			}).subscribe((response:any)=>{
				this.ema21 = response.values[0].ema;
				this.ema21 = this.ema21.substr(0, this.ema21.length-3);

				//calculate state
				this.ema21_value_number = +this.ema21;
				this.price_number = +this.price;
				if (this.ema21_value_number <= this.price_number){
					this.estado_compra = true;
				} else {
					this.estado_venta = true;
				}

				this.seriesEMA21 = [];

				this.max_ema21 = 0;
				this.min_ema21 = 999999;

				for (let day of response.values){
					let year = +day.datetime.substr(0,4);
					let month = +day.datetime.substr(5,2)-1;
					let day_s = +day.datetime.substr(8,2);
					let ema21_value = +day.ema;

					this.seriesEMA21.push(
						new SerieDataLinear(year, month, day_s, ema21_value)
					);

					if(ema21_value > this.max_ema21){
						this.max_ema21 = ema21_value;
					}

					if(ema21_value < this.min_ema21){
						this.min_ema21 = ema21_value;
					}
				}
		}, (error:any)=>{
			Swal.fire('Error en la carga de datos', 'Por favor, intentalo nuevamente', 'error')
		});	

		//request for ema200
		this.http.get(`${environment.apiUrl}/twelve-data/ema`,{
			params: {
				symbol: ticker,
				interval: '1day',
				time_period: '200',
				outputsize: '90'
				}
			}).subscribe((response:any)=>{
				this.ema200 = response.values[0].ema;
				this.ema200 = this.ema200.substr(0, this.ema200.length-3);

				this.seriesEMA200 = [];

				this.max_ema200 = 0;
				this.min_ema200 = 999999;

				for (let day of response.values){
					let year = +day.datetime.substr(0,4);
					let month = +day.datetime.substr(5,2)-1;
					let day_s = +day.datetime.substr(8,2);
					let ema200_value = +day.ema;

					this.seriesEMA200.push(
						new SerieDataLinear(year, month, day_s, ema200_value)
					);

					if(ema200_value > this.max_ema200){
						this.max_ema200 = ema200_value;
					}

					if(ema200_value < this.min_ema200){
						this.min_ema200 = ema200_value;
					}

				}
		}, (error:any)=>{
			Swal.fire('Error en la carga de datos', 'Por favor, intentalo nuevamente', 'error')
		});

		this.draw(ticker);
	}

	draw(ticker : any){
		//request for velas + volumen
		this.http.get(`${environment.apiUrl}/twelve-data/time_series`,{
			params: {
				symbol: ticker,
				interval: '1day',
				outputsize: '90'
				}
			}).subscribe((response:any)=>{
				this.seriesData = [];
				this.seriesDataLinear = [];
				let max_candle = 0;
				let min_candle = 9999999999;
				let max_lenght_candle = 0;	

				for (let day of response.values){
					let year = +day.datetime.substr(0,4);
					let month = +day.datetime.substr(5,2)-1;
					let day_s = +day.datetime.substr(8,2);
					let open = +day.open;
					let high = +day.high;
					let low = +day.low;
					let close = +day.close;

					let high_lenght = day.high.length;

					if(high_lenght>max_lenght_candle){
						max_lenght_candle = high_lenght;
					}

					if(high > max_candle){
						max_candle = high;
					}

					if(low < min_candle){
						min_candle = low;
					}

					this.seriesData.push(
						new SerieData(year, month, day_s, open, high, low, close)
					);	
				}

				if (this.min_ema200 < min_candle){
					min_candle = this.min_ema200;
				}

				if (this.max_ema200 > max_candle){
					max_candle = this.max_ema200;
				}

				if (this.min_ema21 < min_candle){
					min_candle = this.min_ema21;
				}

				if (this.max_ema21 > max_candle){
					max_candle = this.max_ema21;
				}

				//corrección de volumenes erroneos provenientes de la API
				this.max_vol = 0;
				let max_lenght_vol = 0;
				for (let day of response.values){
					let year = +day.datetime.substr(0,4);
					let month = +day.datetime.substr(5,2)-1;
					let day_s = +day.datetime.substr(8,2);
					let volume_s = day.volume;
					let v = +day.volume;

					if(volume_s.length>max_lenght_vol){
						max_lenght_vol = volume_s.length;
					}

					let volume = v/1000000;

					this.seriesDataLinear.push(
						new SerieDataLinear(year, month, day_s, volume)
					);
				}

				this.dif_lenght = Math.abs(max_lenght_candle - max_lenght_vol) + 2;
				
				this.chartCandleOptions = {
					series: [
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
						{
							name: "candle",
							type: "candlestick",
							data: this.seriesData
					 	}
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
						max: max_candle + 0.5,
						min: min_candle - 0.5,
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
						decimalsInFloat: this.dif_lenght
					},
					title:{
						text: "Volumen Diario en Millones",
						align: "center",
						margin: 0
					}
					
				};	

				this.flag_candle = true;
				this.flag_vol = true;
		}, (error:any)=>{
			Swal.fire('Error en la carga de datos', 'Por favor, intentalo nuevamente', 'error')
		});

		//request for RSI
		this.http.get(`${environment.apiUrl}/twelve-data/rsi`,{
			params: {
				symbol: ticker,
				interval: '1day',
				outputsize: '90'
				}
			}).subscribe((response:any)=>{
				this.seriesRSI = [];

				this.rsi = response.values[0].rsi;
				this.rsi = this.rsi.substr(0, this.rsi.length-3);

				for (let day of response.values){
					let year = +day.datetime.substr(0,4);
					let month = +day.datetime.substr(5,2)-1;
					let day_s = +day.datetime.substr(8,2);
					let rsi = +day.rsi;

					this.seriesRSI.push(
						new SerieDataLinear(year, month, day_s, rsi)
					);	
				}

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
						decimalsInFloat: this.dif_lenght
					},
					xaxis: {
						type: 'datetime',
						labels:{
							show: false
						}
					},
					title:{
						text: "Índice de Fuerza Relativa (RSI) 14/close",
						align: "center",
						margin: 0
					}

				};

				this.flag_rsi = true;
		}, (error:any)=>{
			Swal.fire('Error en la carga de datos', 'Por favor, intentalo nuevamente', 'error')
		});	

		//request for MACD
		this.http.get(`${environment.apiUrl}/twelve-data/macd`,{
			params: {
				symbol: ticker,
				interval: '1day',
				outputsize: '90'
				}
			}).subscribe((response:any)=>{
				this.seriesMACD = [];
				this.seriesMACDHist = [];
				this.seriesMACDSignal = [];

				for (let day of response.values){
					let year = +day.datetime.substr(0,4);
					let month = +day.datetime.substr(5,2)-1;
					let day_s = +day.datetime.substr(8,2);
					let macd = +day.macd;
					let macd_signal = +day.macd_signal;
					let macd_hist = +day.macd_hist;

					this.seriesMACD.push(
						new SerieDataLinear(year, month, day_s, macd)
					);	
					this.seriesMACDSignal.push(
						new SerieDataLinear(year, month, day_s, macd_signal)
					);
					this.seriesMACDHist.push(
						new SerieDataLinear(year, month, day_s, macd_hist)
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
						decimalsInFloat: this.dif_lenght
					},
					legend: {
						show: false
					},
					title:{
						text: "Media Móvil de Convergencia/Divergencia (MACD) 12/26/close/9",
						align: "center",
						margin: 0
					}
				};

				this.flag_macd = true;
			}, (error:any)=>{
				Swal.fire('Error en la carga de datos', 'Por favor, intentalo nuevamente', 'error')
			});		
	}

	get_favorites(){
		this.http.get(`${environment.apiUrl}/stocks/favorites`,{
			params: {
			}
		}).subscribe((response:any)=>{
			this.favorites = [];

			for(let f of response){
				let observable1 = this.http.get(`${environment.apiUrl}/twelve-data/price`,{
					params: {
					symbol: f.stock_symbol
					}
				});
		
				let observable2 = this.http.get(`${environment.apiUrl}/twelve-data/quote`,{
					params: {
					symbol: f.stock_symbol
					}
				});
		
				forkJoin([observable1, observable2]).subscribe((response : any)=>{
					let price_obs = response[0];
					let change_obs = response[1];
		
					let fav_price = price_obs.price;
					fav_price = fav_price.substr(0, fav_price.length-3);
		
					let fav_change = change_obs.percent_change;
					fav_change = fav_change.substr(0, fav_change.length-3);
					fav_change = fav_change.concat("%");

					let change = +change_obs.percent_change;
					let change_status = false;
					if (change>=0){
						change_status = true;
					}

					this.favorites.push(
						new Favorites(f.id, f.stock_symbol, fav_change, change_status, fav_price)
					);
				});
				
			}
		}, (error:any)=>{
			Swal.fire('Error en la carga de datos', 'Por favor, intentalo nuevamente', 'error')
		});
	}

	add_favorite(){
		let ticker = this.form.value['ticker'];

		this.http.post(`${environment.apiUrl}/stocks/favorites`,{
			stock_symbol: ticker
		}).subscribe((response:any)=>{

			let max = 0;
			for(let e of this.favorites){
				if (e.id > max){
					max = e.id;
				}
			}
			max = max+1;

			let observable1 = this.http.get(`${environment.apiUrl}/twelve-data/price`,{
				params: {
				symbol: ticker
				}
			});
	
			let observable2 = this.http.get(`${environment.apiUrl}/twelve-data/quote`,{
				params: {
				symbol: ticker
				}
			});
	
			forkJoin([observable1, observable2]).subscribe((response : any)=>{
				let price_obs = response[0];
				let change_obs = response[1];
	
				let fav_price = price_obs.price;
				fav_price = fav_price.substr(0, fav_price.length-3);
	
				let fav_change = change_obs.percent_change;
				fav_change = fav_change.substr(0, fav_change.length-3);
				fav_change = fav_change.concat("%");

				let change = +change_obs.percent_change;
				let change_status = false;
				if (change>=0){
					change_status = true;
				}

				this.favorites.push(
					new Favorites(max, ticker, fav_change, change_status, fav_price)
				);
			});

		}, (error:any)=>{
			Swal.fire('Error en la carga de datos', 'Por favor, intentalo nuevamente', 'error')
		});
	}

	delete_favorite(id : any){
		this.http.delete(`${environment.apiUrl}/stocks/favorites/${id}`,{})
		.subscribe((response:any)=>{
			let c = 0;
			for (let e of this.favorites){
				if (e.id == id){
					this.favorites.splice(c,1);
				}
				c = c+1;
			}
		}, (error:any)=>{
			Swal.fire('Error en la carga de datos', 'Por favor, intentalo nuevamente', 'error')
		});
	}
		
}
