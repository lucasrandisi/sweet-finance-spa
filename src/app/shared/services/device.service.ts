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
    public isMobileGalaxyFold : boolean = false;
    public observer   : Subject<void> = new Subject<void>();

    constructor(
        private breakPointObserver : BreakpointObserver,
        
    ) 
    { 
        this.breakPointObserver.observe([
            '(max-width: 1300px)'
        ]).subscribe(result => {
            this.isDesktop = !result.matches;
            this.isMobile = result.matches;
            this.isMobileGalaxyFold = window.outerWidth <= 280;
            this.observer.next();
        })
    }

    public observe(fn: Function) {
        this.observer.subscribe(() => {
            fn(this.isMobile);
        });

        // Hay que invocarla la primera vez igualmente.
        fn(this.isMobile);
    }
}

