import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { stringify } from '@angular/compiler/src/util';

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
		this.http.get(`${environment.apiUrl}/alpha-vantage`,{
			params: {
			function: 'OVERVIEW',
			symbol: this.form.value['ticker']
			}
		}).subscribe((response:any)=>{
			console.log(response); //para mostrar en la consola
			this.name = response[0].Name;
			this.symbol = response[0].Symbol;
			this.industria = response[0].Industry;
			this.price = response[0].AnalystTargetPrice;
	});

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
		});
	}

	getLastSma21(object_sma: any){

		let	lastDate = moment('1940-07-01');

		for(const key in object_sma){
			lastDate = lastDate.isAfter('2010-10-19') ? lastDate : moment(key);
		}

		return lastDate.format('YYYY-MM-DD HH:mm:ss').toString();
	}

}
