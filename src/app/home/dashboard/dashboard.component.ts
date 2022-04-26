import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { News } from './news';
import { Tickers } from './tickers';
import { forkJoin } from 'rxjs';

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

	@ViewChild("chart") chart: ChartComponent;
	public chartDonutOptions: any;

	flag_end_draw = false;

	ngOnInit(): void {

		this.get_user();

		this.get_news();

		this.draw_stocks();

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
				if(desc[largo-1]!="."){
					desc = desc + ".";
				}
				desc = desc + " " + n.snippet;
				if (desc !== ""){
					this.news.push(
						new News(n.title, desc, n.image_url, n.url)
					)
				}	
			}

			for (let n of n2){
				let desc = n.description;
				let largo = desc.length;
				if(desc[largo-1]!="."){
					desc = desc + ".";
				}
				desc = desc + " " + n.snippet;
				if (desc !== ""){
					this.news.push(
						new News(n.title, desc, n.image_url, n.url)
					)
				}
			}			
		});
	}

	draw_stocks(){
		this.http.get(`${environment.apiUrl}/stocks`,{
			params: {
			}
		}).subscribe((response:any)=>{

			let values = [];
			let labels = [];

			for (let s of response){
				values.push(s.amount);
				labels.push(s.stock_symbol);
			}

			this.chartDonutOptions = {
				series: values,
				labels: labels,
				chart: {
					type: 'donut',
					height: 300,
				},
				title:{
					text: "RESUMEN DE ACCIONES EN CARTERA",
					align: "center",
					margin: 0,
				},
				legend: {
					show: true,
					floating: true,
				}
			};

			this.flag_end_draw = true;
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
