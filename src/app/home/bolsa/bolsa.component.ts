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
	flag : boolean;

	ema21_value_number : number;
	price_number : number;

	@ViewChild("chart") chart: ChartComponent;
	public chartCandleOptions: any;
	public chartBarOptions: any;

	//x: new Date(Year, Month, Day), el mes enero es el 0
	//y: [Open, High, Low, Close]
	seriesData : SerieData[] = [];
	
	//x: new Date(Year, Month, Day)
	//y: Volume
	seriesDataLinear : SerieDataLinear[] = [];

	min_year : number;
	min_month : number;
	min_day : number;
	max_year : number;
	max_month : number;
	max_day : number;
	max_candle : number;
	min_candle : number;
	flag_min_max : boolean;

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
	//en caso de que venga formateado como APPLE INC.
	convertUpperLower(cadena : string){
		var splitStr = cadena.toLowerCase().split(' ');
  	 	for (var i = 0; i < splitStr.length; i++) {
       		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   		}
   		return splitStr.join(' '); 
	}
	*/

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
	
	/*
	//para cuando la consulta traía muchos exchanges
	findExchange(array : any){
		for (let object of array){
			if (object.currency == "USD"){
				return object.exchange;
			}
		}
	}*/

	//gráfico de velas + volumen
	draw(){
		this.http.get(`${environment.apiUrl}/twelve-data/time_series`,{
			params: {
				symbol: this.form.value['ticker'],
				interval: '1day',
				outputsize: '30'
				}
			}).subscribe((response:any)=>{
				this.seriesData = [];
				this.seriesDataLinear = [];
				this.flag_min_max = true;
				this.max_candle = 0;
				this.min_candle = 9999999999;
				for (let day of response.values){
					let year = +day.datetime.substr(0,4);
					let month = +day.datetime.substr(5,2);
					let day_s = +day.datetime.substr(8,2);
					let open = +day.open;
					let high = +day.high;
					let low = +day.low;
					let close = +day.close;
					let volume = +day.volume;

					if(this.flag_min_max){
						this.min_year = year;
						this.min_month = month;
						this.min_day = day;
						this.flag_min_max = false;
					}

					if(high > this.max_candle){
						this.max_candle = high;
					}

					if(low < this.min_candle){
						this.min_candle = low;
					}

					this.max_year = year;
					this.max_month = month;
					this.max_day = day;

					this.seriesData.push(
						new SerieData(year, month, day_s, open, high, low, close)
					);

					this.seriesDataLinear.push(
						new SerieDataLinear(year, month, day_s, volume)
					);	
				}
				
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
					  id: "candles",
					  toolbar: {
						autoSelected: "pan",
						show: false
					  },
					  zoom: {
						enabled: false
					  },
					},
					plotOptions: {
					  candlestick: {
						colors: {
						  upward: "#3C90EB",
						  downward: "#DF7D46"
						}
					  },
					},
					/*
					yaxis: {
						max: this.max_candle,
						min: this.min_candle
					},*/
					xaxis: {
					  type: "datetime"
					},		
				};

				this.chartBarOptions = {
					series: [
						{
						name: "volume",
						data: this.seriesDataLinear
						}
					],
					chart: {
						height: 160,
						type: "bar",
						brush: {
						enabled: true,
						target: "candles"
						},
						selection: {
						enabled: true,
						xaxis: {
							min: new Date(this.min_year, this.min_month, this.min_day),
							max: new Date(this.max_year, this.max_month, this.max_day)
						},
						fill: {
							color: "#ccc",
							opacity: 0.4
						},
						stroke: {
							color: "#0D47A1"
						}
						}
					},
					dataLabels: {
						enabled: false
					},
					plotOptions: {
						bar: {
						columnWidth: "80%",
						colors: {
							ranges: [
							{
								from: -1000,
								to: 0,
								color: "#F15B46"
							},
							{
								from: 1,
								to: 10000,
								color: "#FEB019"
							}
							]
						}
						}
					},
					stroke: {
						width: 0
					},
					xaxis: {
						type: "datetime",
						axisBorder: {
						offsetX: 13
						}
					},
					yaxis: {
						labels: {
						show: false
						},
					}
				};

				this.flag = true;
		});
	}

}
