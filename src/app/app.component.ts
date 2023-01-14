import { Component } from '@angular/core';
import { SpinnerService } from './shared/services/spinner.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'sweet-finance-spa';

	public showSpinner : boolean = false;
    public showCap     : boolean = true;

    public constructor(
        private spinnerService : SpinnerService,
    ) {

    }

    public ngOnInit(): void {

        this.spinnerService.state.subscribe((value)=>{
            setTimeout(() => {
                this.showSpinner = value;
            }, 0);
        });
    }
}
