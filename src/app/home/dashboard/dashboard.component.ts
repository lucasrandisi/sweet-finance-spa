import { Component, OnInit,  } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { News } from './news';
import { forkJoin } from 'rxjs';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  	constructor(private http: HttpClient) { }

  	news : News[] = [];

	ngOnInit(): void {

		this.get_news();

	}

	get_news(){
		let observable1 = this.http.get(`${environment.apiUrl}/marketaux`,{
			params: {
				path: 'news/all',
				language: 'es',
				countries: 'us, ar, br, es, hk, in, mx, ru',
				page: '1' 
			}
		});

		let observable2 = this.http.get(`${environment.apiUrl}/marketaux`,{
			params: {
				path: 'news/all',
				language: 'es',
				countries: 'us, ar, br, es, hk, in, mx, ru',
				page: '2' 
			}
		});

		forkJoin([observable1, observable2]).subscribe((response : any)=>{
			let n1 = response[0].data;
			let n2 = response[1].data;

			for (let n of n1){

				let desc = n.description;
				let largo = desc.length;

				if (largo>250){
					desc = desc.substr(0,250).concat("...");
				}

				this.news.push(
					new News(n.title, desc, n.image_url, n.url)
				)
			}

			for (let n of n2){

				let desc = n.description;
				let largo = desc.length;

				if (largo>250){
					desc = desc.substr(0,250).concat("...");
				}

				this.news.push(
					new News(n.title, desc, n.image_url, n.url)
				)
			}			
		});
	}

}
