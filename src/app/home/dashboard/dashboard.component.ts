import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.http.get(`${environment.apiUrl}/marketaux`,{
	params: {
		path: 'news/all',
		/*language: 'es',
		page: '2' */
	}
	}).subscribe((response:any)=>{
		console.log(response);
	}, (error:any)=>{
		
	});

  }

}
