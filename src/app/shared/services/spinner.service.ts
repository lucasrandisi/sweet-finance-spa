import { EventEmitter, Injectable, NgModule } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
@NgModule()
export class SpinnerService {

    public readonly state: EventEmitter<boolean> = new EventEmitter();
    public static instance: SpinnerService;

    public constructor() {
        if (!SpinnerService.instance) {
            SpinnerService.instance = this;
        }
    }

    public show() {
        this.state.emit(true);
    }

    public hide() {
        this.state.emit(false);
    }

    public async go(fn: () => Promise<any>, timeout: number = 0) {
        let to = setTimeout(() => {
            this.show();
        }, timeout);
        try {
            await fn();
        } finally {
            clearTimeout(to);
            this.hide();
        }
    }
}