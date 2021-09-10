import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

import {
	ChartComponent,
	ApexAxisChartSeries,
	ApexChart,
	ApexYAxis,
	ApexXAxis,
	ApexPlotOptions,
	ApexDataLabels,
	ApexStroke
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

	ema21_value_number : number;
	price_number : number;

	@ViewChild("chart") chart: ChartComponent;
	public chartCandleOptions: any;
	public chartBarOptions: any;

	seriesData = [
		{
		x: new Date(2016, 1, 1),
		y: [51.98, 56.29, 51.59, 53.85]
		},
		{
		x: new Date(2016, 2, 1),
		y: [53.66, 54.99, 51.35, 52.95]
		},
		{
		x: new Date(2016, 3, 1),
		y: [52.96, 53.78, 51.54, 52.48]
		},
		{
		x: new Date(2016, 4, 1),
		y: [52.54, 52.79, 47.88, 49.24]
		},
		{
		x: new Date(2016, 5, 1),
		y: [49.1, 52.86, 47.7, 52.78]
		},
		{
		x: new Date(2016, 6, 1),
		y: [52.83, 53.48, 50.32, 52.29]
		},
		{
		x: new Date(2016, 7, 1),
		y: [52.2, 54.48, 51.64, 52.58]
		},
		{
		x: new Date(2016, 8, 1),
		y: [52.76, 57.35, 52.15, 57.03]
		},
		{
		x: new Date(2016, 9, 1),
		y: [57.04, 58.15, 48.88, 56.19]
		},
		{
		x: new Date(2016, 10, 1),
		y: [56.09, 58.85, 55.48, 58.79]
		},
		{
		x: new Date(2016, 11, 1),
		y: [58.78, 59.65, 58.23, 59.05]
		},
		{
		x: new Date(2017, 0, 1),
		y: [59.37, 61.11, 59.35, 60.34]
		},
		{
		x: new Date(2017, 1, 1),
		y: [60.4, 60.52, 56.71, 56.93]
		},
		{
		x: new Date(2017, 2, 1),
		y: [57.02, 59.71, 56.04, 56.82]
		},
		{
		x: new Date(2017, 3, 1),
		y: [56.97, 59.62, 54.77, 59.3]
		},
		{
		x: new Date(2017, 4, 1),
		y: [59.11, 62.29, 59.1, 59.85]
		},
		{
		x: new Date(2017, 5, 1),
		y: [59.97, 60.11, 55.66, 58.42]
		},
		{
		x: new Date(2017, 6, 1),
		y: [58.34, 60.93, 56.75, 57.42]
		},
		{
		x: new Date(2017, 7, 1),
		y: [57.76, 58.08, 51.18, 54.71]
		},
		{
		x: new Date(2017, 8, 1),
		y: [54.8, 61.42, 53.18, 57.35]
		},
		{
		x: new Date(2017, 9, 1),
		y: [57.56, 63.09, 57.0, 62.99]
		},
		{
		x: new Date(2017, 10, 1),
		y: [62.89, 63.42, 59.72, 61.76]
		},
		{
		x: new Date(2017, 11, 1),
		y: [61.71, 64.15, 61.29, 63.04]
		}
	];

	seriesDataLinear = [
		{
		x: new Date(2016, 1, 1),
		y: 3.85
		},
		{
		x: new Date(2016, 2, 1),
		y: 2.95
		},
		{
		x: new Date(2016, 3, 1),
		y: -12.48
		},
		{
		x: new Date(2016, 4, 1),
		y: 19.24
		},
		{
		x: new Date(2016, 5, 1),
		y: 12.78
		},
		{
		x: new Date(2016, 6, 1),
		y: 22.29
		},
		{
		x: new Date(2016, 7, 1),
		y: -12.58
		},
		{
		x: new Date(2016, 8, 1),
		y: -17.03
		},
		{
		x: new Date(2016, 9, 1),
		y: -19.19
		},
		{
		x: new Date(2016, 10, 1),
		y: -28.79
		},
		{
		x: new Date(2016, 11, 1),
		y: -39.05
		},
		{
		x: new Date(2017, 0, 1),
		y: 20.34
		},
		{
		x: new Date(2017, 1, 1),
		y: 36.93
		},
		{
		x: new Date(2017, 2, 1),
		y: 36.82
		},
		{
		x: new Date(2017, 3, 1),
		y: 29.3
		},
		{
		x: new Date(2017, 4, 1),
		y: 39.85
		},
		{
		x: new Date(2017, 5, 1),
		y: 28.42
		},
		{
		x: new Date(2017, 6, 1),
		y: 37.42
		},
		{
		x: new Date(2017, 7, 1),
		y: 24.71
		},
		{
		x: new Date(2017, 8, 1),
		y: 37.35
		},
		{
		x: new Date(2017, 9, 1),
		y: 32.99
		},
		{
		x: new Date(2017, 10, 1),
		y: 31.76
		},
		{
		x: new Date(2017, 11, 1),
		y: 43.04
		}
	];

 	constructor(private http: HttpClient) {
		
		this.chartCandleOptions = {
			series: [
			  {
				name: "candle",
				data: this.seriesData
			  }
			],
			chart: {
			  type: "candlestick",
			  height: 290,
			  id: "candles",
			  toolbar: {
				autoSelected: "pan",
				show: false
			  },
			  zoom: {
				enabled: false
			  }
			},
			plotOptions: {
			  candlestick: {
				colors: {
				  upward: "#3C90EB",
				  downward: "#DF7D46"
				}
			  }
			},
			xaxis: {
			  type: "datetime"
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
			  height: 160,
			  type: "bar",
			  brush: {
				enabled: true,
				target: "candles"
			  },
			  selection: {
				enabled: true,
				xaxis: {
				  min: new Date("20 Jan 2017").getTime(),
				  max: new Date("10 Dec 2017").getTime()
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
			  }
			}
		  };
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
				console.log(response);
				this.ema200 = response.values[0].ema;
				this.ema200 = this.ema200.substr(0, this.ema200.length-3);
		});
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


}
