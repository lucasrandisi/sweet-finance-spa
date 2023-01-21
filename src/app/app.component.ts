import { Component } from '@angular/core';
import { DeviceService } from './shared/services/device.service';
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
    public isMobile    : boolean = false;

    public constructor(
        private spinnerService : SpinnerService,
        private deviceService: DeviceService
    ) {

    }

    public ngOnInit(): void {
        this.deviceService.observe((result: boolean) => {
            this.isMobile = result;
        });

        this.spinnerService.state.subscribe((value)=>{
            setTimeout(() => {
                this.showSpinner = value;
            }, 0);
        });
    }
}
