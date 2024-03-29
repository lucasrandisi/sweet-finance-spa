import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    name: string;
    
    constructor(
		private authService: AuthService,
		private router: Router,
		private http: HttpClient
    ) { }

    ngOnInit(): void {
    }

    async logout() {
		await this.authService.logout();
		this.router.navigateByUrl('/login');
    }

	navegar(path: string){
		this.router.navigateByUrl(path);
	}

}
