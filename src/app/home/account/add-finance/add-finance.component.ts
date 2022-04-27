import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-finance',
  templateUrl: './add-finance.component.html',
  styleUrls: ['./add-finance.component.scss']
})
export class AddFinanceComponent implements OnInit {

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  form: FormGroup;
  finance: number;

  ngOnInit(): void {
    this.initializeForm();

    this.http.get(`${environment.apiUrl}/me`,{
			params: {
			}
		}).subscribe((response:any)=>{
			this.finance = response.data.finance; 
		});
  }
  
  initializeForm() {
		this.form = new FormGroup({
			finance: new FormControl()
		});
	}

  onSubmit(){
    console.log(this.form.value['finance']);
  }

}
