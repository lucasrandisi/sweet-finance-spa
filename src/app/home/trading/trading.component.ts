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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
		this.ticker = new FormGroup({
			ticker: new FormControl()
		});

		this.buy = new FormGroup({
			amount: new FormControl()
		});

		this.sell = new FormGroup({
			amount: new FormControl()
		});
			
		this.http.get(`${environment.apiUrl}/me`,{
			params: {
			}
		}).subscribe((response:any)=>{
			this.finance = response.data.finance; 
		});
  }

  find_ticker() {
		//request for ticker data
		this.http.get(`${environment.apiUrl}/twelve-data/price`,{
			params: {
			symbol: this.ticker.value['ticker']
			}
		}).subscribe((response:any)=>{
			this.price = response.price; 
			this.price = this.price.substr(0, this.price.length-3);
		});

		this.http.get(`${environment.apiUrl}/twelve-data/quote`,{
			params: {
			symbol: this.ticker.value['ticker']
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
			symbol: this.ticker.value['ticker']
			}
		}).subscribe((response:any)=>{
			this.price = response.price;
			this.price = this.price.substr(0, this.price.length-3);
		});

		this.http.get(`${environment.apiUrl}/twelve-data/ema`,{
			params: {
				symbol: this.ticker.value['ticker'],
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
    }

	buy_ticker(){
		this.http.post(`${environment.apiUrl}/stocks/${this.symbol}/buy`,{
			amount: this.buy.value['amount']
		}).subscribe((response:any)=>{
			this.finance = response.data.user.finance;
		});
	}

	sell_ticker(){
		this.http.post(`${environment.apiUrl}/stocks/${this.symbol}/sell`,{
			amount: this.sell.value['amount']
		}).subscribe((response:any)=>{
			this.finance = response.data.user.finance;
		},(error:any)=>{
			console.log(error);
		} );
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

}
