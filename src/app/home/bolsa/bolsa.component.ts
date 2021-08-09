import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

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

  technical_sma = 'Technical Analysis: SMA';

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
        series_type: 'close'
			}
		}).subscribe((response:any)=>{
			console.log(response); 
			this.sma21 = response[0].technical_sma[1].SMA;
      console.log(this.sma21);
		});
	}

}
