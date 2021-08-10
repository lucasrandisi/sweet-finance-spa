import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-bolsa',
  templateUrl: './bolsa.component.html',
  styleUrls: ['./bolsa.component.scss']
})
export class BolsaComponent implements OnInit {

  form: FormGroup;
  symbol: string;
  name: string;
  industria: string;
  price: string;
  sma21: string;
  sma21_value : string;
  ema200 : string;
  ema200_value : string;
  rsi : string;
  rsi_value : string;
  estado_compra : boolean;
  estado_venta : boolean;

  sma21_value_number : number;
  price_number : number;


  constructor(
    private http: HttpClient) {}

  ngOnInit(): void {
		this.initializeForm();
	}

	initializeForm() {
		this.form = new FormGroup({
			ticker: new FormControl()
		});
	}

	find_ticker() {
		//request for ticker data
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

		//request for sma21
		this.http.get(`${environment.apiUrl}/alpha-vantage`,{
			params: {
				function: 'SMA',
				symbol: this.form.value['ticker'],
				interval: 'daily',
				time_period: '21',
				series_type: 'close',
				datatype: 'json'
				}
			}).subscribe((response:any)=>{
				this.sma21 = response[0]['Technical Analysis: SMA'];
				const last_sma21 = this.getLastSma21(this.sma21);
				this.sma21_value = response[0]['Technical Analysis: SMA'][last_sma21].SMA;
				this.sma21_value = this.sma21_value.substr(0, this.sma21_value.length-2);
				
				//calculate state
				this.sma21_value_number = +this.sma21_value;
				this.price_number = +this.price;
				if (this.sma21_value_number <= this.price_number){
					this.estado_compra = true;
				} else {
					this.estado_venta = true;
				}
		});

		//request for ema200
		this.http.get(`${environment.apiUrl}/alpha-vantage`,{
			params: {
				function: 'EMA',
				symbol: this.form.value['ticker'],
				interval: 'daily',
				time_period: '200',
				series_type: 'close',
				datatype: 'json'
				}
			}).subscribe((response:any)=>{
				this.ema200 = response[0]['Technical Analysis: EMA'];
				const last_ema200 = this.getLastSma21(this.ema200);
				this.ema200_value = response[0]['Technical Analysis: EMA'][last_ema200].EMA;
				this.ema200_value = this.ema200_value.substr(0, this.ema200_value.length-2);
		});

		//request for RSI
		this.http.get(`${environment.apiUrl}/alpha-vantage`,{
			params: {
				function: 'RSI',
				symbol: this.form.value['ticker'],
				interval: 'daily',
				time_period: '14',
				series_type: 'close',
				datatype: 'json'
				}
			}).subscribe((response:any)=>{
				this.rsi = response[0]['Technical Analysis: RSI'];
				const last_rsi = this.getLastSma21(this.rsi);
				this.rsi_value = response[0]['Technical Analysis: RSI'][last_rsi].RSI;
				this.rsi_value = this.rsi_value.substr(0, this.rsi_value.length-2);
		});	
		
	}

	convertUpperLower(cadena : string){
		var splitStr = cadena.toLowerCase().split(' ');
  	 	for (var i = 0; i < splitStr.length; i++) {
       		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   		}
   		return splitStr.join(' '); 
	}

	getLastSma21(object_sma: any){
		let	lastDate = moment('1940-07-01');
		for(const key in object_sma){
			lastDate = lastDate.isAfter('2010-10-19') ? lastDate : moment(key);
		}
		return lastDate.format('YYYY-MM-DD').toString();
	}

}
