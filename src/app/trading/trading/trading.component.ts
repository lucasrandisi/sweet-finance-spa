import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SerieData } from '../serieDataHour';
import { Router } from '@angular/router';
import { Orders } from '../orders';

import {
	ChartComponent,
	ApexAxisChartSeries,
	ApexChart,
	ApexYAxis,
	ApexXAxis,
	ApexPlotOptions,
	ApexDataLabels,
	ApexStroke,
} from "ng-apexcharts";
import { AuthService } from 'src/app/shared/services/auth.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { LocatorService } from 'src/app/shared/services/locator.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { SerieDataLinear } from 'src/app/bolsa/serieDataLinear';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

export type ChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	xaxis: ApexXAxis;
	yaxis: ApexYAxis;
	plotOptions: ApexPlotOptions;
	dataLabels: ApexDataLabels;
	stroke: ApexStroke;
};

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss']
})

export class TradingComponent implements OnInit {

	public user : any = {
		finance: ''
	};
	protected spinnerService  = LocatorService.injector.get(SpinnerService);

	public formularioTicker: FormGroup;
	public formularioCompra: FormGroup;
	public formularioVenta: FormGroup;
	public formularioCompraLimit: FormGroup;
	public formularioVentaLimit: FormGroup;
	public formularioCompraStopLimit: FormGroup;
	public formularioVentaStopLimit: FormGroup;

	public tickerInformacion : any = {
		nombre: '',
		simbolo: '',
		cambio: '',
		cambioAccion: true,
		mercado: '',
		precio: '',
		volumen: '',
		ema21: '',
		maximo24: '',
		minimo24: '',
		maximo52: '',
		minino52: '',
		estado: '',
		disponible : '0',
	}

	public minimoValorgrafico : number;
	public maximoValorgrafico : number;
	public ordenes: Orders[] = [];

	@ViewChild("chart") chart: ChartComponent;
	public chartOptions : any;
	public seriesData : SerieData[] = [];

  	constructor(
		private router: Router,
		private authService : AuthService,
		private apiService : ApiService,
		private snackBar: SnackBarService,
	) { }

  	async ngOnInit(){
		this.inicializarFormularios();
		await this.spinnerService.go(async() => {
			await this.obtenerUsuarioFinance();
			await this.obtenerInformacionTicker('AAPL');
			await this.obtenerOrdenes();
		});
	}

	public inicializarFormularios(){
		this.formularioTicker = new FormGroup({
			ticker: new FormControl()
		});

		this.formularioCompra = new FormGroup({
			amount: new FormControl()
		});

		this.formularioVenta = new FormGroup({
			amount: new FormControl()
		});

		this.formularioCompraLimit = new FormGroup({
			limit: new FormControl(),
			amount: new FormControl()
		});

		this.formularioVentaLimit = new FormGroup({
			limit: new FormControl(),
			amount: new FormControl()
		});

		this.formularioCompraStopLimit = new FormGroup({
			stop: new FormControl(),
			limit: new FormControl(),
			amount: new FormControl()
		});

		this.formularioVentaStopLimit = new FormGroup({
			stop: new FormControl(),
			limit: new FormControl(),
			amount: new FormControl()
		});
	}

	public async obtenerUsuarioFinance(){
		let responseFinance = await this.apiService.getData('/me');
		this.user.finance = responseFinance.data.finance;
	}

 	public async obtenerInformacionTicker(ticker: any) {
		await this.spinnerService.go(async() => {
			let responseQuote = await this.apiService.getData('/twelve-data/quote', {
				symbol: ticker
			});
			this.tickerInformacion.nombre = responseQuote.name;
			this.tickerInformacion.simbolo = responseQuote.symbol;
			this.tickerInformacion.mercado = responseQuote.exchange;
			this.tickerInformacion.cambio = responseQuote.percent_change.substr(0, responseQuote.percent_change.length-3).concat("%");
			if(this.tickerInformacion.cambio.substr(0,1) == '-') this.tickerInformacion.cambioAccion = false;
			this.tickerInformacion.maximo24 = responseQuote.high.substr(0, responseQuote.high.length-3);
			this.tickerInformacion.minimo24 = responseQuote.low.substr(0, responseQuote.low.length-3);
			this.tickerInformacion.maximo52 = responseQuote.fifty_two_week.high.substr(0, responseQuote.fifty_two_week.high.length-3);
			this.tickerInformacion.minimo52 = responseQuote.fifty_two_week.low.substr(0, responseQuote.fifty_two_week.low.length-3);
			this.tickerInformacion.volumen = this.obtenerVolumenFormateado(responseQuote.volume);
			
			let responsePrice = await this.apiService.getData('/twelve-data/price', {
				symbol: ticker
			});
			this.tickerInformacion.precio = responsePrice.price.substr(0, responsePrice.price.length-3);

			let responseEma21 = await this.apiService.getData('/twelve-data/ema', {
				symbol: ticker,
				interval: '1day',
				time_period: '21',
				outputsize: '90'
			});
			this.tickerInformacion.ema21 = responseEma21.values[0].ema.substr(0, responseEma21.values[0].ema.length-3);
			(Number(this.tickerInformacion.ema21) <= Number(this.tickerInformacion.precio)) ? this.tickerInformacion.estado = "COMPRA" : this.tickerInformacion.estado = "VENTA";

			await this.calcularDisponible(ticker);

			await this.dibujarGrafico(ticker);
		});
    }

	public async calcularDisponible(ticker: any){
		let responseAcciones = await this.apiService.getData('/stocks');
		for (let accion of responseAcciones){
			if(accion.stock_symbol == ticker){
				this.tickerInformacion.disponible = accion.amount;
				break;
			}
		}
	}

	public async dibujarGrafico(ticker : any){
		let responsePrecios = await this.apiService.getData('/twelve-data/time_series', {
			symbol: ticker,
			interval: '4h',
			outputsize: '30'
		});

		this.seriesData = [];
		this.maximoValorgrafico = 0;
		this.minimoValorgrafico = 9999999;

		for (let hora of responsePrecios.values){
			this.seriesData.push(
				new SerieData(
					+hora.datetime.substr(0,4),
					+hora.datetime.substr(5,2)-1, 
					+hora.datetime.substr(8,2), 
					+hora.datetime.substr(11,2), 
					+hora.datetime.substr(14,2), 
					+hora.close,
				)
			);

			if(Number(hora.close) > this.maximoValorgrafico){
				this.maximoValorgrafico = Number(hora.close);
			}

			if(Number(hora.close) < this.minimoValorgrafico){
				this.minimoValorgrafico = Number(hora.close);
			}
		}

		this.chartOptions = {
			series: [
				{
					name: ticker,
					data: this.seriesData
				},
			],
			chart: {
				type: "line",
				height: 300,
				toolbar: {
					autoSelected: "pan",
					show: false
				}
			},
			xaxis: {
				type: "datetime",
				position: "bottom",
				labels:{
					datetimeFormatter: {
						year: 'yy',
						month: "MMM 'yy",
						day: 'dd MMM',
						hour: 'HH:mm',
					}
				}
			},	
			yaxis: {
				max: this.maximoValorgrafico + 0.5,
				min: this.minimoValorgrafico - 0.5,
				decimalsInFloat: 2
			},
			title:{
				text: `${ticker}: Serie de Precios al Cierre 4horas/30`,
				align: "center",
				margin: 0
			},
			stroke: { 
				width: 2,
				curve: "smooth",
				colors: "#1AA7EC"
			},
			markers: {
				size: 0,
			}
		};

	}

	public obtenerVolumenFormateado(volumen: any){
		console.log('volumen', volumen);
		if(volumen.length>6){
			volumen = volumen.substr(0, volumen.length-6);
			return volumen.concat("M");
		} else{
			if (volumen.length>3){
				volumen = volumen.substr(0, volumen.length-3);
				return volumen.concat("K");
			} else{
				return volumen;
			}
		}
	}

	public async comprarTickerInstantanea(){
		await this.spinnerService.go(async() => {
			let responseCompra = await this.apiService.post(`/stocks/${this.tickerInformacion.simbolo}/buy`, {
				amount: this.formularioCompra.value['amount']
			});

			this.formularioCompra.reset();
			await this.calcularDisponible(this.tickerInformacion.simbolo);
			this.user.finance = responseCompra.data.user.finance;
			this.snackBar.show('Operación realizada con éxito.');
		});
	}

	public async venderTickerInstantanea(){
		await this.spinnerService.go(async() => {
			let responseVenta = await this.apiService.post(`/stocks/${this.tickerInformacion.simbolo}/sell`, {
				amount: this.formularioVenta.value['amount']
			});

			this.formularioVenta.reset();
			await this.calcularDisponible(this.tickerInformacion.simbolo);
			this.user.finance = responseVenta.data.user.finance;
			this.snackBar.show('Operación realizada con éxito.');
		});
	}

	public async comprarTickerLimit(){
		await this.spinnerService.go(async() => {
			let responseCompraLimit = await this.apiService.post(`/orders`, {
				stock_symbol: this.tickerInformacion.simbolo,
				action: 'BUY',
				limit: this.formularioCompraLimit.value['limit'],
				amount: this.formularioCompraLimit.value['amount']
			});

			this.formularioCompraLimit.reset();
			await this.calcularDisponible(this.tickerInformacion.simbolo);
			await this.obtenerOrdenes();
			this.user.finance = responseCompraLimit.data.user.finance;
			this.snackBar.show('Orden creada con éxito.');
		});
	}

	public async venderTickerLimit(){
		await this.spinnerService.go(async() => {
			let responseVentaLimit = await this.apiService.post(`/orders`, {
				stock_symbol: this.tickerInformacion.simbolo,
				action: 'SELL',
				limit: this.formularioVentaLimit.value['limit'],
				amount: this.formularioVentaLimit.value['amount']
			});

			this.formularioVentaLimit.reset();
			await this.calcularDisponible(this.tickerInformacion.simbolo);
			await this.obtenerOrdenes();
			this.user.finance = responseVentaLimit.data.user.finance;
			this.snackBar.show('Orden creada con éxito.');
		});
	}

	public async comprarTickerStopLimit(){
		let responseCompraStopLimit = await this.apiService.post(`/orders`, {
			stock_symbol: this.tickerInformacion.simbolo,
			action: 'BUY',
			stop: this.formularioCompraStopLimit.value['stop'],
			limit: this.formularioCompraStopLimit.value['limit'],
			amount: this.formularioCompraStopLimit.value['amount']
		});

		this.formularioCompraStopLimit.reset();
		await this.calcularDisponible(this.tickerInformacion.simbolo);
		await this.obtenerOrdenes();
		this.user.finance = responseCompraStopLimit.data.user.finance;
		this.snackBar.show('Orden creada con éxito.');
	}

	public async venderTickerStopLimit(){
		let responseCompraStopLimit = await this.apiService.post(`/orders`, {
			stock_symbol: this.tickerInformacion.simbolo,
			action: 'SELL',
			stop: this.formularioVentaStopLimit.value['stop'],
			limit: this.formularioVentaStopLimit.value['limit'],
			amount: this.formularioVentaStopLimit.value['amount']
		});

		this.formularioVentaStopLimit.reset();
		await this.calcularDisponible(this.tickerInformacion.simbolo);
		await this.obtenerOrdenes();
		this.user.finance = responseCompraStopLimit.data.user.finance;
		this.snackBar.show('Orden creada con éxito.');
	}

	public async obtenerOrdenes(){
		let responseOrdenes = await this.apiService.getData('/orders', {});
		this.ordenes = [];

		for (let orden of responseOrdenes){
			this.ordenes.push(
				new Orders(
					orden.id, 
					(orden.action == "BUY") ? "COMPRA" : "VENTA", 
					(orden.action == "BUY") ? true : false, 
					orden.stock_symbol, 
					orden.amount,
					(orden.stop == null) ? '-' : orden.stop, 
					(orden.limit == null) ? '-' : orden.limit, 
					orden.created_at.substring(0,10),
				)
			);
		}
	}

	public async eliminarOrden(id: any, ticker: any){
		await this.spinnerService.go(async() => {
			let responseEliminar = await this.apiService.delete(`/orders/${id}`);
			this.user.finance = responseEliminar.user.finance;
			await this.obtenerOrdenes();
			await this.calcularDisponible(ticker);
		});
	}

	public navegarAcademia(){
		this.router.navigateByUrl('/academia/anatecnico');
	}
}
