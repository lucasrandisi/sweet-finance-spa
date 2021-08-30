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
  price : number;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.ticker = new FormGroup({
			ticker: new FormControl()
		});
  }

  find_ticker() {
		//request for ticker data
		this.http.get(`${environment.apiUrl}/alpha-vantage`,{
			params: {
			function: 'OVERVIEW',
			symbol: this.ticker.value['ticker']
			}
		}).subscribe((response:any)=>{
			//console.log(response); //para mostrar en la consola
			this.price = response[0].AnalystTargetPrice;
		});
  }

}
