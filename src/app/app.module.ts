import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpInterceptorProviders } from './shared/interceptors/http-interceptor-provider';
import { SharedModule } from './shared/shared.module';
import { LocatorService } from './shared/services/locator.service';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		SharedModule
	],
	providers: [
		httpInterceptorProviders,
	],
	bootstrap: [AppComponent]
})
export class AppModule {
    constructor(private injector: Injector) { 
        LocatorService.injector = this.injector;
    }
 }
