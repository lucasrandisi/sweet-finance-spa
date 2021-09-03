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
  mercado: string;
  price: string;
  ema21: string;
  //ema21_value : string;
  ema200 : string;
  //ema200_value : string;
  rsi : string;
  //rsi_value : string;
  estado_compra : boolean;
  estado_venta : boolean;

  ema21_value_number : number;
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
				console.log(response);
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
}
