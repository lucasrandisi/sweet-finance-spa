import { Component, OnInit,  } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { News } from './news';
import { Tickers } from './tickers';
import { forkJoin } from 'rxjs';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  	constructor(private http: HttpClient) { }

	username : string;

  	news : News[] = [];
	better_tickers : Tickers[] = [];
	worst_tickers : Tickers[] = [];

	ngOnInit(): void {

		this.get_user();

		this.get_news();

		this.get_betterWorst_stocks();

	}

	get_user(){
		this.http.get(`${environment.apiUrl}/me`,{
			params: {
			}
		}).subscribe((response:any)=>{
			this.username = response.data.name;
		});
	}

	get_news(){
		let observable1 = this.http.get(`${environment.apiUrl}/marketaux`,{
			params: {
				path: 'news/all',
				language: 'es',
				countries: 'us, ar, br, cn',
				page: '1' 
			}
		});

		let observable2 = this.http.get(`${environment.apiUrl}/marketaux`,{
			params: {
				path: 'news/all',
				language: 'es',
				countries: 'us, ar, br, cn',
				page: '2' 
			}
		});

		this.news = [];

		forkJoin([observable1, observable2]).subscribe((response : any)=>{
			let n1 = response[0].data;
			let n2 = response[1].data;

			for (let n of n1){

				let desc = n.description;
				let largo = desc.length;

				if (largo>250){
					desc = desc.substr(0,250).concat("...");
				}

				if (desc !== ""){
					this.news.push(
						new News(n.title, desc, n.image_url, n.url)
					)
				}
				
			}

			for (let n of n2){

				let desc = n.description;
				let largo = desc.length;

				if (largo>250){
					desc = desc.substr(0,250).concat("...");
				}

				if (desc !== ""){
					this.news.push(
						new News(n.title, desc, n.image_url, n.url)
					)
				}
			}			
		});
	}

	get_betterWorst_stocks(){

		this.better_tickers = [];
		this.worst_tickers = [];

		this.http.get(`${environment.apiUrl}/fmp`,{
			params: {
			path: "v3/gainers"
			}
		}).subscribe((response:any)=>{
			console.log(response);
			for (let i = 0; i < 5; i++){
				let change_length = response[i].changesPercentage.length;
				let change = response[i].changesPercentage.substr(0,change_length-4).concat("%");
				this.better_tickers.push(
					new Tickers(response[i].ticker, response[i].companyName, change)
				)
			}
		}, (error:any)=>{
		});

		this.http.get(`${environment.apiUrl}/fmp`,{
			params: {
			path: "v3/losers"
			}
		}).subscribe((response:any)=>{
			console.log(response);
			for (let i = 0; i < 5; i++){
				let change_length = response[i].changesPercentage.length;
				let change = response[i].changesPercentage.substr(0,change_length-4).concat("%");
				this.worst_tickers.push(
					new Tickers(response[i].ticker, response[i].companyName, change)
				)
			}
		}, (error:any)=>{
		});
	}
}
