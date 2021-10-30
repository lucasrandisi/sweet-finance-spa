import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

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

  	constructor(private http: HttpClient) { }

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
			
		this.http.get(`${environment.apiUrl}/me`,{
			params: {
			}
		}).subscribe((response:any)=>{
			this.finance = response.data.finance; 
		});

		this.find_ticker_form('AAPL');
	}

	find_ticker(){
		this.find_ticker_form(this.ticker.value['ticker'])
	}

 	find_ticker_form(ticker: any) {
		//request for ticker data
		this.http.get(`${environment.apiUrl}/twelve-data/price`,{
			params: {
			symbol: ticker
			}
		}).subscribe((response:any)=>{
			this.price = response.price; 
			this.price = this.price.substr(0, this.price.length-3);
		});

		this.http.get(`${environment.apiUrl}/twelve-data/quote`,{
			params: {
			symbol: ticker
			}
		}).subscribe((response:any)=>{
			this.symbol = response.symbol;
			this.change = response.percent_change;
			this.change = this.change.substr(0, this.change.length-3);
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

		this.http.get(`${environment.apiUrl}/twelve-data/price`,{
			params: {
			symbol: ticker
			}
		}).subscribe((response:any)=>{
			this.price = response.price;
			this.price = this.price.substr(0, this.price.length-3);
		});

		this.http.get(`${environment.apiUrl}/twelve-data/ema`,{
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
				} else {
					this.estado = "VENTA";
				}
		});	

		this.available(ticker);
    }

	available(ticker : any){
		this.http.get(`${environment.apiUrl}/stocks`,{
		}).subscribe((response:any)=>{
			for (let stock of response){
				if(stock.stock_symbol == ticker){
					this.disponible = stock.amount;
				}
			}
		});
	}

	buy_ticker(){
		this.http.post(`${environment.apiUrl}/stocks/${this.symbol}/buy`,{
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
		this.http.post(`${environment.apiUrl}/stocks/${this.symbol}/sell`,{
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
		this.http.post(`${environment.apiUrl}/orders`,{
			stock_symbol: this.symbol,
			action: 'BUY',
			limit: this.limit_buy.value['limit'],
			amount: this.limit_buy.value['amount']
		}).subscribe((response:any)=>{
			this.limit_buy.reset();
			this.available(this.symbol);
			this.error_flag = false;
			this.feedback_message = "Orden creada con éxito";
			this.finance = response.data.user.finance;
			this.waiting();
		}, (error:any)=>{
			this.limit_buy.reset();
			this.error_flag = true;
			this.feedback_message = error.error.message;
			this.waiting();
		});
	}

	limit_sell_ticker(){
		this.http.post(`${environment.apiUrl}/orders`,{
			stock_symbol: this.symbol,
			action: 'SELL',
			limit: this.limit_sell.value['limit'],
			amount: this.limit_sell.value['amount']
		}).subscribe((response:any)=>{
			this.limit_sell.reset();
			this.available(this.symbol);
			this.error_flag = false;
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
		this.http.post(`${environment.apiUrl}/orders`,{
			stock_symbol: this.symbol,
			action: 'BUY',
			stop: this.stop_limit_buy.value['stop'],
			limit: this.stop_limit_buy.value['limit'],
			amount: this.stop_limit_buy.value['amount']
		}).subscribe((response:any)=>{
			this.stop_limit_buy.reset();
			this.available(this.symbol);
			this.error_flag = false;
			this.feedback_message = "Orden creada con éxito";
			this.finance = response.data.user.finance;
			this.waiting();
		}, (error:any)=>{
			this.stop_limit_buy.reset();
			this.error_flag = true;
			this.feedback_message = error.error.message;
			this.waiting();
		});
	}

	stop_limit_sell_ticker(){
		this.http.post(`${environment.apiUrl}/orders`,{
			stock_symbol: this.symbol,
			action: 'SELL',
			stop: this.stop_limit_sell.value['stop'],
			limit: this.stop_limit_sell.value['limit'],
			amount: this.stop_limit_sell.value['amount']
		}).subscribe((response:any)=>{
			this.stop_limit_sell.reset();
			this.available(this.symbol);
			this.error_flag = false;
			this.feedback_message = "Orden creada con éxito";
			this.waiting();
		}, (error:any)=>{
			this.stop_limit_sell.reset();
			this.error_flag = true;
			this.feedback_message = error.error.message;
			this.waiting();
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
