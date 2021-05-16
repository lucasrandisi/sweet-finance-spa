import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpInterceptorProviders } from './shared/interceptors/http-interceptor-provider';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AuthModule,
		BrowserAnimationsModule,
		HttpClientModule,
	],
	providers: [
		httpInterceptorProviders
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
