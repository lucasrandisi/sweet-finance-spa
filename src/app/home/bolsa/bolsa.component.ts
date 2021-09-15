import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SerieData } from './serieData';
import { SerieDataLinear } from './serieDataLinear';
import * as moment from 'moment';

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

	max_candle : number;
	min_candle : number;
	max_vol : number;
	dif_lenght = 0;

 	constructor(private http: HttpClient) {
	}

  	ngOnInit(): void {
		this.initializeForm();
	}

	initializeForm() {
		this.form = new FormGroup({
			ticker: new FormControl()
		});
	}

	find_ticker() {
		//request for ticker data in alpha-vantage
		/*
		this.http.get(`${environment.apiUrl}/alpha-vantage`,{
			params: {
			function: 'OVERVIEW',
			symbol: this.form.value['ticker']
			}
		}).subscribe((response:any)=>{
			//console.log(response); //para mostrar en la consola
			this.name = response[0].Name;
			this.symbol = response[0].Symbol;
			this.industria = response[0].Industry;
			this.industria = this.convertUpperLower(this.industria);
			this.price = response[0].AnalystTargetPrice;
		});
		*/

		//request for ticker data in twelve-data
		this.http.get(`${environment.apiUrl}/twelve-data/quote`,{
			params: {
			symbol: this.form.value['ticker']
			}
		}).subscribe((response:any)=>{
			//console.log(response); //para mostrar en la consola
			this.estado_compra = false;
			this.estado_venta = false;
			this.name = response.name;
			this.symbol = response.symbol;
			this.mercado = response.exchange;
		});

		//request for price
		this.http.get(`${environment.apiUrl}/twelve-data/price`,{
			params: {
			symbol: this.form.value['ticker']
			}
		}).subscribe((response:any)=>{
			this.price = response.price;
			this.price = this.price.substr(0, this.price.length-3);
		});
		

		//request for RSI
		this.http.get(`${environment.apiUrl}/twelve-data/rsi`,{
			params: {
				symbol: this.form.value['ticker'],
				interval: '1day'
				}
			}).subscribe((response:any)=>{
				/*
				this.rsi = response[0]['Technical Analysis: RSI'];
				const last_rsi = this.getLast(this.rsi);
				this.rsi_value = response[0]['Technical Analysis: RSI'][last_rsi].RSI;
				this.rsi_value = this.rsi_value.substr(0, this.rsi_value.length-2);
				*/
				this.rsi = response.values[0].rsi;
				this.rsi = this.rsi.substr(0, this.rsi.length-3);
		});	

		//request for ema21
		this.http.get(`${environment.apiUrl}/twelve-data/ema`,{
			params: {
				symbol: this.form.value['ticker'],
				interval: '1day',
				time_period: '21'
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
		});	

		//request for ema200
		this.http.get(`${environment.apiUrl}/twelve-data/ema`,{
			params: {
				symbol: this.form.value['ticker'],
				interval: '1day',
				time_period: '200'
				}
			}).subscribe((response:any)=>{
				this.ema200 = response.values[0].ema;
				this.ema200 = this.ema200.substr(0, this.ema200.length-3);
		});

		this.draw();
	}

	/*
	// en caso de necesitar extraer el valor de la fecha más cercana
	getLast(object_sma: any){
		let	lastDate = moment('1940-07-01');
		for(const key in object_sma){
			lastDate = lastDate.isAfter('2010-10-19') ? lastDate : moment(key);
		}
		return lastDate.format('YYYY-MM-DD').toString();
	}
	*/

	//gráfico de velas + volumen
	draw(){
		
		//request for velas + volumen
		this.http.get(`${environment.apiUrl}/twelve-data/time_series`,{
			params: {
				symbol: this.form.value['ticker'],
				interval: '1day',
				outputsize: '30'
				}
			}).subscribe((response:any)=>{
				this.seriesData = [];
				this.seriesDataLinear = [];
				this.max_candle = 0;
				this.min_candle = 9999999999;
				let volume_avg_lenght = 0;
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
	
					volume_avg_lenght = volume_avg_lenght + day.volume.length;

					if(high > this.max_candle){
						this.max_candle = high;
					}

					if(low < this.min_candle){
						this.min_candle = low;
					}

					this.seriesData.push(
						new SerieData(year, month, day_s, open, high, low, close)
					);	
				}

				//corrección de volumenes erroneos provenientes de la API
				this.max_vol = 0;
				let max_lenght_vol = 0;
				volume_avg_lenght = Math.floor(volume_avg_lenght/30);
				for (let day of response.values){
					let year = +day.datetime.substr(0,4);
					let month = +day.datetime.substr(5,2)-1;
					let day_s = +day.datetime.substr(8,2);
					let volume_s = day.volume;

					if(volume_s.length>volume_avg_lenght){
						volume_s = volume_s.substr(0, volume_avg_lenght);
					}

					if(volume_s.length>max_lenght_vol){
						max_lenght_vol = volume_s.length;
					}

					let volume = +(volume_s/1000000);

					if (volume>this.max_vol){
						this.max_vol = volume;
					}

					this.seriesDataLinear.push(
						new SerieDataLinear(year, month, day_s, volume)
					);
				}

				this.dif_lenght = Math.abs(max_lenght_candle - max_lenght_vol) + 2;
				
				this.chartCandleOptions = {
					series: [
					  {
						name: "candle",
						data: this.seriesData
					  }
					],
					chart: {
						type: "candlestick",
						height: 300,
						width: '100%',
						id: "candles",
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
						max: this.max_candle + 0.5,
						min: this.min_candle - 0.5,
						decimalsInFloat: 2
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
						width: "100%",
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
						max: this.max_vol,
						tickAmount: 4,
						decimalsInFloat: this.dif_lenght
					},
					
				};	

				this.flag_candle = true;
				this.flag_vol = true;
		});

		//request for RSI
		this.http.get(`${environment.apiUrl}/twelve-data/rsi`,{
			params: {
				symbol: this.form.value['ticker'],
				interval: '1day',
				outputsize: '30'
				}
			}).subscribe((response:any)=>{
				this.seriesRSI = [];

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
						height: 120,
						toolbar: {
							autoSelected: "pan",
							show: false
						}
					},
					annotations: {
						yaxis: [
						  {
							y: 30,
							y2: 70,
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
				};

				this.flag_rsi = true;
		});	

		//request for MACD
		this.http.get(`${environment.apiUrl}/twelve-data/macd`,{
			params: {
				symbol: this.form.value['ticker'],
				interval: '1day',
				outputsize: '30'
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
						height: 120,
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
					}
				};

				this.flag_macd = true;
			});		
		}

		
}
