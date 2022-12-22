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

    logout() {
		this.authService.logout().subscribe(
			() => this.router.navigate(['/login'])
		)
    }

	navegar(path: string){
		this.router.navigateByUrl(path);
	}

}
