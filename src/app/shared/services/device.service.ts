import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, NgModule } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
@NgModule()
export class DeviceService {

    public isDesktop! : boolean;
    public isMobile!  : boolean;
    public observer   : Subject<void> = new Subject<void>();

    constructor(
        private breakPointObserver : BreakpointObserver,
        
    ) 
    { 
        this.breakPointObserver.observe([
            '(max-width: 1008px)'
        ]).subscribe(result => {
            this.isDesktop = !result.matches;
            this.isMobile = result.matches;
            this.observer.next();
        })
    }
}
