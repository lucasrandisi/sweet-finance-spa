import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SerieData } from '../serieDataHour';
import { Router } from '@angular/router';
import { Orders } from '../orders';

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
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss']
})

export class TradingComponent implements OnInit {

	ticker: FormGroup;
	buy: FormGroup;
	sell: FormGroup;
	limit_buy: FormGroup;
	limit_sell: FormGroup;
	stop_limit_buy: FormGroup;
	stop_limit_sell: FormGroup;

	price : string;
	change_action : boolean;
	change: string;
	max24: string;
	min24: string;
	max52: string;
	min52: string;
	volume: string;
	ema21: string;
	ema21_value_number: number;
	price_number: number;
	estado: string;
	estado_action : boolean;
	symbol: string;
	finance: number;
	disponible : number;

	feedback_message : string;
	error_flag : boolean;

	insta: boolean;
	lim : boolean;
	stop : boolean;
	wait : boolean;

	switch: string = "instantanea";

	orders: Orders[] = [];

	@ViewChild("chart") chart: ChartComponent;
	public chartOptions : any;
	seriesData : SerieData[] = [];

	min_value : number;
	max_value : number;
	flag_chart : boolean;

  	constructor(private http: HttpClient, private router: Router) { }

  	ngOnInit(): void {

		this.insta = true;

		this.ticker = new FormGroup({
			ticker: new FormControl()
		});

		this.buy = new FormGroup({
			amount: new FormControl()
		});

		this.sell = new FormGroup({
			amount: new FormControl()
		});

		this.limit_buy = new FormGroup({
			limit: new FormControl(),
			amount: new FormControl()
		});

		this.limit_sell = new FormGroup({
			limit: new FormControl(),
			amount: new FormControl()
		});

		this.stop_limit_buy = new FormGroup({
			stop: new FormControl(),
			limit: new FormControl(),
			amount: new FormControl()
		});

		this.stop_limit_sell = new FormGroup({
			stop: new FormControl(),
			limit: new FormControl(),
			amount: new FormControl()
		});
			
		this.http.get(`${environment.apiEndpoint}/me`,{
			params: {
			}
		}).subscribe((response:any)=>{
			this.finance = response.data.finance; 
		});

		this.find_ticker_form('AAPL');

		this.get_orders();
	}

	find_ticker(){
		this.find_ticker_form(this.ticker.value['ticker'])
	}

 	find_ticker_form(ticker: any) {
		//request for ticker data
		this.http.get(`${environment.apiEndpoint}/twelve-data/price`,{
			params: {
			symbol: ticker
			}
		}).subscribe((response:any)=>{
			this.price = response.price; 
			this.price = this.price.substr(0, this.price.length-3);
		});

		this.http.get(`${environment.apiEndpoint}/twelve-data/quote`,{
			params: {
			symbol: ticker
			}
		}).subscribe((response:any)=>{
			this.symbol = response.symbol;
			this.change = response.percent_change;
			this.change = this.change.substr(0, this.change.length-3);
			if (this.change.substring(0,1) == "-"){
				this.change_action = false;
			} else {
				this.change_action = true;
			}
			this.change = this.change.concat("%");
			this.max24 = response.high;
			this.max24 = this.max24.substr(0, this.max24.length-3);
			this.min24 = response.low;
			this.min24 = this.min24.substr(0, this.min24.length-3);
			this.max52 = response.fifty_two_week.high;
			this.max52 = this.max52.substr(0, this.max52.length-3);
			this.min52 = response.fifty_two_week.low;
			this.min52 = this.min52.substr(0, this.min52.length-3);
			this.volume = this.convertVolume(response.volume);
		});

		this.http.get(`${environment.apiEndpoint}/twelve-data/price`,{
			params: {
			symbol: ticker
			}
		}).subscribe((response:any)=>{
			this.price = response.price;
			this.price = this.price.substr(0, this.price.length-3);
		});

		this.http.get(`${environment.apiEndpoint}/twelve-data/ema`,{
			params: {
				symbol: ticker,
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
					this.estado = "COMPRA";
					this.estado_action = true;
				} else {
					this.estado = "VENTA";
					this.estado_action = false;
				}
		});	

		this.available(ticker);

		this.draw(ticker);
    }

	available(ticker : any){
		this.http.get(`${environment.apiEndpoint}/stocks`,{
		}).subscribe((response:any)=>{
			for (let stock of response){
				if(stock.stock_symbol == ticker){
					this.disponible = stock.amount;
					return;
				}
			}
			this.disponible = 0;
		});
	}

	buy_ticker(){
		this.http.post(`${environment.apiEndpoint}/stocks/${this.symbol}/buy`,{
			amount: this.buy.value['amount']
		}).subscribe((response:any)=>{
			this.buy.reset();
			this.error_flag = false;
			this.available(this.symbol);
			this.finance = response.data.user.finance;
			this.feedback_message = "Operación realizada con éxito";
			this.waiting();
		}, (error:any)=>{
			this.buy.reset();
			this.error_flag = true;
			this.feedback_message = error.error.message;
			this.waiting();
		});
	}

	sell_ticker(){
		this.http.post(`${environment.apiEndpoint}/stocks/${this.symbol}/sell`,{
			amount: this.sell.value['amount']
		}).subscribe((response:any)=>{
			this.sell.reset();
			this.available(this.symbol);
			this.error_flag = false;
			this.finance = response.data.user.finance;
			this.feedback_message = "Operación realizada con éxito";
			this.waiting();
		},(error:any)=>{
			this.sell.reset();
			this.error_flag = true;
			this.feedback_message = error.error.message;
			this.waiting();
		});
	}

	limit_buy_ticker(){
		this.http.post(`${environment.apiEndpoint}/orders`,{
			stock_symbol: this.symbol,
			action: 'BUY',
			limit: this.limit_buy.value['limit'],
			amount: this.limit_buy.value['amount']
		}).subscribe((response:any)=>{
			this.limit_buy.reset();
			this.available(this.symbol);
			this.error_flag = false;
			this.get_orders();
			this.feedback_message = "Orden creada con éxito";
			this.waiting();
			this.finance = response.data.user.finance;
		}, (error:any)=>{
			this.limit_buy.reset();
			this.error_flag = true;
			this.feedback_message = error.error.message;
			this.waiting();
		});
	}

	limit_sell_ticker(){
		this.http.post(`${environment.apiEndpoint}/orders`,{
			stock_symbol: this.symbol,
			action: 'SELL',
			limit: this.limit_sell.value['limit'],
			amount: this.limit_sell.value['amount']
		}).subscribe((response:any)=>{
			this.limit_sell.reset();
			this.available(this.symbol);
			this.error_flag = false;
			this.get_orders();
			this.feedback_message = "Orden creada con éxito";
			this.waiting();
		}, (error:any)=>{
			this.limit_sell.reset();
			this.error_flag = true;
			this.feedback_message = error.error.message;
			this.waiting();
		});
	}

	stop_limit_buy_ticker(){
		this.http.post(`${environment.apiEndpoint}/orders`,{
			stock_symbol: this.symbol,
			action: 'BUY',
			stop: this.stop_limit_buy.value['stop'],
			limit: this.stop_limit_buy.value['limit'],
			amount: this.stop_limit_buy.value['amount']
		}).subscribe((response:any)=>{
			this.stop_limit_buy.reset();
			this.available(this.symbol);
			this.error_flag = false;
			this.get_orders();
			this.feedback_message = "Orden creada con éxito";
			this.waiting();
			this.finance = response.data.user.finance;
		}, (error:any)=>{
			this.stop_limit_buy.reset();
			this.error_flag = true;
			this.feedback_message = error.error.message;
			this.waiting();
		});
	}

	stop_limit_sell_ticker(){
		this.http.post(`${environment.apiEndpoint}/orders`,{
			stock_symbol: this.symbol,
			action: 'SELL',
			stop: this.stop_limit_sell.value['stop'],
			limit: this.stop_limit_sell.value['limit'],
			amount: this.stop_limit_sell.value['amount']
		}).subscribe((response:any)=>{
			this.stop_limit_sell.reset();
			this.available(this.symbol);
			this.error_flag = false;
			this.get_orders();
			this.feedback_message = "Orden creada con éxito";
			this.waiting();
		}, (error:any)=>{
			this.stop_limit_sell.reset();
			this.error_flag = true;
			this.feedback_message = error.error.message;
			this.waiting();
		});
	}

	get_orders(){
		this.http.get(`${environment.apiEndpoint}/orders`,{
			params: {
			}
		}).subscribe((response:any)=>{
			this.orders = [];
			let action_boolean: boolean;

			for(let order of response){

				if(order.action == "BUY"){
					order.action = "COMPRA";
					action_boolean = true;
				} else{
					order.action = "VENTA";
					action_boolean = false;
				}

				if(order.limit == null){
					order.limit = "-";
				}

				if(order.stop == null){
					order.stop = "-";
				}

				let fecha = order.created_at.substring(0,10);

				this.orders.push(
					new Orders(order.id, order.action, action_boolean, order.stock_symbol, order.amount,
						order.stop, order.limit, fecha)
				);
			}
		});
	}

	delete_order(id : any){
		this.http.delete(`${environment.apiEndpoint}/orders/${id}`,{})
		.subscribe((response:any)=>{
			this.get_orders();
			//actualizar finance
		});
	}

	navigate_academy(){
		this.router.navigateByUrl('/anatecnico');
	}

	draw(ticker : any){
		//request for velas + volumen
		this.http.get(`${environment.apiEndpoint}/twelve-data/time_series`,{
		params: {
			symbol: ticker,
			interval: '4h',
			outputsize: '30'
			}
		}).subscribe((response:any)=>{
			this.seriesData = [];
			this.max_value = 0;
			this.min_value = 9999999;
		
			for (let hour of response.values){
				let year = +hour.datetime.substr(0,4);
				let month = +hour.datetime.substr(5,2)-1;
				let day = +hour.datetime.substr(8,2);
				let hour_v = +hour.datetime.substr(11,2);
				let minute = +hour.datetime.substr(14,2);
				let close = +hour.close;

				if(close > this.max_value){
					this.max_value = close;
				}

				if(close < this.min_value){
					this.min_value = close;
				}

				this.seriesData.push(
					new SerieData(year, month, day, hour_v, minute, close)
				);	
			}

			this.chartOptions = {
				series: [
					{
						name: ticker,
						data: this.seriesData
					},
				],
				chart: {
					type: "line",
					height: 300,
					toolbar: {
						autoSelected: "pan",
						show: false
					}
				},
				xaxis: {
					type: "datetime",
					position: "bottom",
					labels:{
						datetimeFormatter: {
							year: 'yy',
							month: "MMM 'yy",
							day: 'dd MMM',
							hour: 'HH:mm',
						}
					}
				},	
				yaxis: {
					max: this.max_value + 0.5,
					min: this.min_value - 0.5,
					decimalsInFloat: 2
				},
				title:{
					text: `${ticker}: Serie de Precios al Cierre 4hour/close/30`,
					align: "center",
					margin: 0
				},
				stroke: { 
					width: 2,
					curve: "smooth",
					colors: "#1AA7EC"
				},
				markers: {
					size: 0,
				}
			};

			this.flag_chart = true;
			
		});
	}

	waiting(): void {
		this.wait = true;
		setTimeout(function(this: any) {
			this.wait = false;
		}.bind(this), 3000);
	}

	convertVolume(vol : any){
		if(vol.length>6){
			vol = vol.substr(0, vol.length-6);
			return vol.concat("M");
		} else{
			if (vol.length>3){
				vol = vol.substr(0, vol.length-3);
				return vol.concat("K");
			} else{
				return vol;
			}
		}
	}

	onChangeHeight(event : any){
		if (event == "instantanea"){
			this.lim = false;
			this.stop = false;
			this.insta = true;
		}
		
		if (event == "limit"){
			this.lim = true;
			this.stop = false;
			this.insta = false;
		}

		if (event == "stop-limit"){
			this.lim = false;
			this.stop = true;
			this.insta = false;
		}
	}

}
